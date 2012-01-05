/**
 * @fileOverview UIBase.Box
 * @author yiminghe@gmail.com
 */
KISSY.add('uibase/boxrender', function (S, Node) {

    var $ = S.all;

    /**
     * @class
     * @memberOf UIBase.Box
     */
    function BoxRender() {
    }

    BoxRender.ATTRS =
    /**
     * @lends UIBase.Box.Render#
     */
    {
        el:{
            //容器元素
            setter:function (v) {
                return $(v);
            }
        },
        // 构建时批量生成，不需要执行单个
        elCls:{
            sync:false
        },
        elStyle:{
            sync:false
        },
        width:{
            sync:false
        },
        height:{
            sync:false
        },
        elTagName:{
            sync:false,
            // 生成标签名字
            value:"div"
        },
        elAttrs:{
            sync:false
        },
        html:{
            sync:false
        },
        elBefore:{
        },
        render:{},
        visible:{
        },
        visibleMode:{

        }
    };

    BoxRender.construct = constructEl;

    function constructEl(cls, style, width, height, tag, attrs, html) {
        style = style || {};
        html = html || "";

        if (width) {
            style.width = typeof width == "number" ? (width + "px") : width;
        }

        if (height) {
            style.height = typeof height == "number" ? (height + "px") : height;
        }

        var styleStr = '';

        for (var s in style) {
            if (style.hasOwnProperty(s)) {
                styleStr += s + ":" + style[s] + ";";
            }
        }

        var attrStr = '';

        for (var a in attrs) {
            if (attrs.hasOwnProperty(a)) {
                attrStr += " " + a + "='" + attrs[a] + "'" + " ";
            }
        }

        return "<" + tag + (styleStr ? (" style='" + styleStr + "' ") : "")
            + attrStr + (cls ? (" class='" + cls + "' ") : "")
            + ">" + html + "<" + "/" + tag + ">";
        //return ret;
    }

    BoxRender.HTML_PARSER =
    /**
     * @ignore
     */
    {
        html:function (el) {
            return el.html();
        }
    };

    BoxRender.prototype =
    /**
     * @lends UIBase.Box.Render#
     */
    {

        __renderUI:function () {
            var self = this;
            // 新建的节点才需要摆放定位
            if (self.__boxRenderNew) {
                var render = self.get("render"),
                    el = self.get("el"),
                    elBefore = self.get("elBefore");
                if (elBefore) {
                    el.insertBefore(elBefore);
                }
                else if (render) {
                    el.appendTo(render);
                }
                else {
                    el.appendTo(document.body);
                }
            }
        },

        /**
         * 只负责建立节点，如果是 decorate 过来的，甚至内容会丢失
         * 通过 render 来重建原有的内容
         */
        __createDom:function () {
            var self = this,
                el = self.get("el");
            if (!el) {
                self.__boxRenderNew = true;
                el = new Node(constructEl(self.get("elCls"),
                    self.get("elStyle"),
                    self.get("width"),
                    self.get("height"),
                    self.get("elTagName"),
                    self.get("elAttrs"),
                    self.get("html")));
                self.__set("el", el);
            }
        },

        _uiSetElAttrs:function (attrs) {
            this.get("el").attr(attrs);
        },

        _uiSetElCls:function (cls) {
            this.get("el").addClass(cls);
        },

        _uiSetElStyle:function (style) {
            this.get("el").css(style);
        },

        _uiSetWidth:function (w) {
            this.get("el").width(w);
        },

        _uiSetHeight:function (h) {
            var self = this;
            self.get("el").height(h);
        },

        _uiSetHtml:function (c) {
            this.get("el").html(c);
        },

        _uiSetVisible:function (isVisible) {
            var el = this.get("el"),
                visibleMode = this.get("visibleMode");
            if (visibleMode == "visibility") {
                el.css("visibility", isVisible ? "visible" : "hidden");
            } else {
                el.css("display", isVisible ? "" : "none");
            }
        },

        show:function () {
            var self = this;
            self.render();
            self.set("visible", true);
        },

        hide:function () {
            this.set("visible", false);
        },

        __destructor:function () {
            //S.log("box __destructor");
            var el = this.get("el");
            if (el) {
                el.detach();
                el.remove();
            }
        }
    };

    return BoxRender;
}, {
    requires:['node']
});
