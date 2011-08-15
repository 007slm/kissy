/**
 * position and visible extension，可定位的隐藏层
 * @author  承玉<yiminghe@gmail.com>
 */
KISSY.add("uibase/positionrender", function() {

    var ZINDEX = 9999;

    function Position() {
    }

    Position.ATTRS = {
        x: {
            // 水平方向绝对位置
            valueFn:function() {
                // 读到这里时，el 一定是已经加到 dom 树中了，否则报未知错误
                // el 不在 dom 树中 offset 报错的
                // 最早读就是在 syncUI 中，一点重复设置(读取自身 X 再调用 _uiSetX)无所谓了
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
            this.get("el").addClass(this.get("prefixCls") + "ext-position");
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