/**
 * @module  EventTarget
 * @author  yiminghe@gmail.com
 */
KISSY.add('event/target', function(S, Event, EventObject) {
    var KS_PUBLISH = "__~ks_publish",
        KS_BUBBLE_TARGETS = "__~ks_bubble_targets",
        ALL_EVENT = "*";

    function getCustomEvent(self, type, eventData) {
        if (eventData instanceof EventObject) {
            // set currentTarget in the process of bubbling
            eventData.currentTarget = self;
            return eventData;
        }
        var customEvent = new EventObject(self, undefined, type);
        if (S.isPlainObject(eventData)) {
            S.mix(customEvent, eventData);
        }
        // protect type
        customEvent.type = type;
        return customEvent
    }

    function getEventPublishObj(self) {
        self[KS_PUBLISH] = self[KS_PUBLISH] || {};
        return self[KS_PUBLISH];
    }

    function getBubbleTargetsObj(self) {
        self[KS_BUBBLE_TARGETS] = self[KS_BUBBLE_TARGETS] || {};
        return self[KS_BUBBLE_TARGETS];
    }

    function isBubblable(self, eventType) {
        var publish = getEventPublishObj(self);
        return publish[eventType] && publish[eventType].bubbles || publish[ALL_EVENT] && publish[ALL_EVENT].bubbles
    }

    function attach(method) {
        return function(type, fn, scope) {
            var self = this;
            splitAndRun(type, function(t) {
                Event["__" + method](false, self, t, fn, scope);
            });
            return self; // chain
        };
    }

    function splitAndRun(type, fn) {
        S.each(S.trim(type).split(/\s+/), fn);
    }

    /**
     * 提供事件发布和订阅机制
     * @name Target
     * @memberOf Event
     */
    var Target =
    /**
     * @lends Event.Target
     */
    {
        /**
         * 触发事件
         * @param {String} type 事件名
         * @param {Object} eventData 事件附加信息对象
         * @returns 如果一个 listener 返回false，则返回 false ，否则返回最后一个 listener 的值.
         */
        fire: function(type, eventData) {
            var self = this,
                ret,
                r2,
                customEvent;
            if ((type = S.trim(type)) &&
                type.indexOf(" ") > 0) {
                splitAndRun(type, function(t) {
                    r2 = self.fire(t, eventData);
                    if (r2 === false) {
                        ret = false;
                    }
                });
                return ret;
            }
            customEvent = getCustomEvent(self, type, eventData);
            ret = Event._handle(self, customEvent);
            if (!customEvent.isPropagationStopped &&
                isBubblable(self, type)) {
                r2 = self.bubble(type, customEvent);
                // false 优先返回
                if (r2 === false) {
                    ret = r2;
                }
            }
            return ret
        },

        /**
         * defined event config
         * @param type
         * @param cfg
         *        example { bubbles: true}
         *        default bubbles: false
         */
        publish: function(type, cfg) {
            var self = this,
                publish = getEventPublishObj(self);
            publish[type] = cfg;
        },

        /**
         * bubble event to its targets
         * @param type
         * @param eventData
         */
        bubble: function(type, eventData) {
            var self = this,
                ret,
                targets = getBubbleTargetsObj(self);
            S.each(targets, function(t) {
                var r2 = t.fire(type, eventData);
                if (ret !== false) {
                    ret = r2;
                }
            });
            return ret;
        },

        /**
         * add target which bubblable event bubbles towards
         * @param target another EventTarget instance
         */
        addTarget: function(target) {
            var self = this,
                targets = getBubbleTargetsObj(self);
            targets[S.stamp(target)] = target;
        },

        removeTarget:function(target) {
            var self = this,
                targets = getBubbleTargetsObj(self);
            delete targets[S.stamp(target)];
        },

        /**
         * 监听事件
         * @param {String} type 事件名
         * @param {Function} fn 事件处理器
         * @param {Object} scope 事件处理器内的 this 值，默认当前实例
         * @returns 当前实例
         */
        on: attach("add")
    };

    /**
     * 取消监听事件
     * @param {String} type 事件名
     * @param {Function} fn 事件处理器
     * @param {Object} scope 事件处理器内的 this 值，默认当前实例
     * @returns 当前实例
     */
    Target.detach = attach("remove");

    return Target;
}, {
    /*
     实际上只需要 dom/data ，但是不要跨模块引用另一模块的子模块，
     否则会导致build打包文件 dom 和 dom-data 重复载入
     */
    requires:["./base",'./object']
});
/**
 *  2011-10-17
 *    yiminghe: implement bubble for custom event
 **/