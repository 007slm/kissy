/**
 * @module  event-mouseenter
 * @author  lifesinger@gmail.com,yiminghe@gmail.com
 */
KISSY.add('event/mouseenter', function(S, Event, DOM, UA) {

    if (!UA['ie']) {
        S.each([
            { name: 'mouseenter', fix: 'mouseover' },
            { name: 'mouseleave', fix: 'mouseout' }
        ], function(o) {


            // 元素内触发的 mouseover/out 不能算 mouseenter/leave
            function withinElement(event) {

                var parent = event.relatedTarget;

                // 设置用户实际注册的事件名，触发该事件所对应的 listener 数组
                event.type = o.name;

                // Firefox sometimes assigns relatedTarget a XUL element
                // which we cannot access the parentNode property of
                try {

                    // Chrome does something similar, the parentNode property
                    // can be accessed but is null.
                    if (parent && parent !== document && !parent.parentNode) {
                        return;
                    }

                    // Traverse up the tree
                    while (parent && parent !== this) {
                        parent = parent.parentNode;
                    }

                    if (parent !== this) {
                        // handle event if we actually just moused on to a non sub-element
                        Event._handle(this, event);
                    }

                    // assuming we've left the element since we most likely mousedover a xul element
                } catch(e) {
                }
            }


            Event.special[o.name] = {

                // 第一次 mouseenter 时注册下
                // 以后都直接放到 listener 数组里， 由 mouseover 读取触发
                setup: function() {
                    Event.add(this, o.fix, withinElement);
                },

                //当 listener 数组为空时，也清掉 mouseover 注册，不再读取
                tearDown:function() {
                    Event.remove(this, o.fix, withinElement);
                }
            }
        });
    }

    return Event;
}, {
        requires:["./base","dom","ua"]
    });

/**
 * 承玉：2011-06-07
 * - 根据新结构，调整 mouseenter 兼容处理
 *
 * TODO:
 *  - ie6 下，原生的 mouseenter/leave 貌似也有 bug, 比如 <div><div /><div /><div /></div>
 *    jQuery 也异常，需要进一步研究
 */
