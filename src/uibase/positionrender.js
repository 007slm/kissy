/**
 * position and visible extension，可定位的隐藏层
 * @author  承玉<yiminghe@gmail.com>
 */
KISSY.add("uibase/positionrender", function() {

    var ZINDEX=9999;

    function Position() {
    }

    Position.ATTRS = {
        x: {
            // 水平方向绝对位置
            valueFn:function() {
                return this.get("el") && this.get("el").offset().left;
            }
        },
        y: {
            // 垂直方向绝对位置
            valueFn:function() {
                return this.get("el") && this.get("el").offset().top;
            }
        },
        zIndex: {
            value: ZINDEX
        }
    };


    Position.prototype = {

        __renderUI:function() {
            var el = this.get("el");
            el.addClass(this.get("prefixCls") + "ext-position");
            el.css({
                visibility:"visible",
                display: "",
                left:-9999,
                top:-9999,
                bottom:"",
                right:""
            });
        },

        _uiSetZIndex:function(x) {
            this.get("el").css("z-index", x);
        },
        _uiSetX:function(x) {
            this.get("el").offset({
                left:x
            });
        },
        _uiSetY:function(y) {
            this.get("el").offset({
                top:y
            });
        }
    };

    return Position;
});