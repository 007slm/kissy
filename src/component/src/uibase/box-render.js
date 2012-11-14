/**
 * @ignore
 * @fileOverview UIBase.Box
 * @author yiminghe@gmail.com
 */
KISSY.add('component/uibase/box-render', function (S) {

    var $ = S.all, doc = S.Env.host.document;

    function BoxRender() {
    }

    BoxRender.ATTRS = {
        el: {
            //容器元素
            setter: function (v) {
                return $(v);
            }
        },

        // 构建时批量生成，不需要执行单个
        elCls: {
        },

        elStyle: {
        },

        width: {
        },

        height: {
        },

        elTagName: {
            // 生成标签名字
            value: "div"
        },

        elAttrs: {
        },

        content: {
        },

        elBefore: {
            // better named to renderBefore, too late !
        },

        render: {},

        visible: {
            value: true
        },

        visibleMode: {
            value: "display"
        },
        // content 设置的内容节点,默认根节点
        contentEl: {
            valueFn: function () {
                return this.get("el");
            }
        }
    };

    BoxRender.HTML_PARSER = {
        el: function (srcNode) {
            return srcNode;
        },
        content: function (el) {
            var contentEl = this.get("contentEl") || el;
            return contentEl.html();
        }
    };

    BoxRender.prototype = {

        /**
         * @ignore
         * 只负责建立节点，如果是 decorate 过来的，甚至内容会丢失
         * 通过 render 来重建原有的内容
         */
        __createDom: function () {
            var self = this, el, contentEl;
            if (!self.get("srcNode")) {
                contentEl = self.get("contentEl");

                el = $("<" + self.get("elTagName") + ">");

                if (contentEl) {
                    el.append(contentEl);
                }

                self.setInternal("el", el);

                if (!contentEl) {
                    // 没取到,这里设下值, uiSet 时可以 set("content")  取到
                    self.setInternal("contentEl", el);
                }
            }
        },

        __renderUI: function () {
            var self = this;
            // 新建的节点才需要摆放定位
            if (!self.get("srcNode")) {
                var render = self.get("render"),
                    el = self.get("el"),
                    renderBefore = self.get("elBefore");
                if (renderBefore) {
                    el.insertBefore(renderBefore, undefined);
                } else if (render) {
                    el.appendTo(render, undefined);
                } else {
                    el.appendTo(doc.body, undefined);
                }
            }
        },

        _uiSetElAttrs: function (attrs) {
            this.get("el").attr(attrs);
        },

        _uiSetElCls: function (cls) {
            this.get("el").addClass(cls);
        },

        _uiSetElStyle: function (style) {
            this.get("el").css(style);
        },

        _uiSetWidth: function (w) {
            this.get("el").width(w);
        },

        _uiSetHeight: function (h) {
            var self = this;
            self.get("el").height(h);
        },

        _uiSetContent: function (c) {
            var self = this, el;
            // srcNode 时不重新渲染 content
            // 防止内部有改变，而 content 则是老的 html 内容
            if (self.get("srcNode") && !self.get("rendered")) {
            } else {
                el = self.get("contentEl");
                if (typeof c == "string") {
                    el.html(c);
                } else if (c) {
                    el.empty().append(c);
                }
            }
        },

        _uiSetVisible: function (visible) {
            var self = this,
                el = self.get("el"),
                shownCls = self.getCssClassWithState('-shown'),
                hiddenCls = self.getCssClassWithState('-hidden'),
                visibleMode = self.get("visibleMode");
            if (visible) {
                el.removeClass(hiddenCls);
                el.addClass(shownCls);
            } else {
                el.removeClass(shownCls);
                el.addClass(hiddenCls);
            }
            //return;
            // !TODO 兼容代码，去除，通过 css 控制隐藏属性
            if (visibleMode == "visibility") {
                el.css("visibility", visible ? "visible" : "hidden");
            } else {
                el.css("display", visible ? "" : "none");
            }
        },

        __destructor: function () {
            var el = this.get("el");
            if (el) {
                el.remove();
            }
        }
    };

    return BoxRender;
}, {
    requires: ['node']
});
