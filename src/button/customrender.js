/**
 * view for button , double div for pseudo-round corner
 * @author:yiminghe@gmail.com
 */
KISSY.add("button/customrender", function(S, UIBase, Css3Render) {
    //双层 div 模拟圆角
    var CUSTOM_RENDER_HTML = "<div class='goog-inline-block {prefixCls}-outer-box'>" +
        "<div class='goog-inline-block {prefixCls}-inner-box'></div></div>";

    return UIBase.create(Css3Render, [], {
        renderUI:function() {
            this.get("el").html(S.substitute(CUSTOM_RENDER_HTML, {
                prefixCls:this.get("prefixCls")
            }));
        },
        _uiSetContent:function(v) {
            if (v == undefined) return;
            this.get("el").one('div').one('div').html(v);
        }
    }, {
        ATTRS:{
            prefixCls:{
                value:"goog-custom-button"
            }
        }
    });
}, {
    requires:['uibase','button/css3render']
});