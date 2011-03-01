/**
 * UIBase.Box
 * @author: 承玉<yiminghe@gmail.com>
 */
KISSY.add('uibase/boxrender', function(S) {


    function Box() {
    }

    S.mix(Box, {
        APPEND:1,
        INSERT:0
    });

    Box.ATTRS = {
        el: {
            //容器元素
            setter:function(v) {
                var Node = S.require("node/node");
                if (S['isString'](v))
                    return Node.one(v);
            }
        },
        elCls: {
            // 容器的 class
        },
        elStyle:{
            //容器的行内样式
        },
        width: {
            // 宽度
        },
        height: {
            // 高度
        },
        elTagName:{
            //生成标签名字
            value:"div"
        },
        elAttrs:{
            //其他属性
        },
        elOrder:{
            //插入容器位置
            //0 : prepend
            //1 : append
            value:1
        },
        html: {}
    };

    Box.HTML_PARSER = {
        el:function(srcNode) {
            return srcNode;
        }
    };

    Box.prototype = {

        __renderUI:function() {
            var Node = S.require("node/node");
            var self = this,
                render = self.get("render"),
                el = self.get("el");
            render = new Node(render);
            if (!el) {
                el = new Node("<" + self.get("elTagName") + ">");
                if (self.get("elOrder")) {
                    render.append(el);
                } else {
                    render.prepend(el);
                }
                self.set("el", el);
            }
        },
        _uiSetElAttrs:function(attrs) {
                this.get("el").attr(attrs);
        },
        _uiSetElCls:function(cls) {
                this.get("el").addClass(cls);
        },

        _uiSetElStyle:function(style) {
                this.get("el").css(style);
        },

        _uiSetWidth:function(w) {

            var self = this;
                self.get("el").width(w);
        },

        _uiSetHeight:function(h) {
            //S.log("_uiSetHeight");
            var self = this;
                self.get("el").height(h);
        },

        _uiSetHtml:function(c) {
            this.get("el").html(c);
        },

        __destructor:function() {
            //S.log("box __destructor");
            var el = this.get("el");
            if (el) {
                el.detach();
                el.remove();
            }
        }
    };

    return Box;
});
