/*
Copyright 2011, KISSY UI Library v1.20dev
MIT Licensed
build time: ${build.time}
*/
/**
 * KISSY Overlay
 * @author: 玉伯<lifesinger@gmail.com>, 承玉<yiminghe@gmail.com>,乔花<qiaohua@taobao.com>
 */
KISSY.add("overlay/overlayrender", function(S, UA, UIBase, Component) {

    function require(s) {
        return S.require("uibase/" + s);
    }

    return UIBase.create(Component.Render, [
        require("boxrender"),
        require("contentboxrender"),
        require("positionrender"),
        require("loadingrender"),
        UA['ie'] == 6 ? require("shimrender") : null,
        require("maskrender")
    ], {

        renderUI:function() {
            this.get("el").addClass("ks-overlay");
        }

    }, {
        ATTRS:{
            elOrder:0
        }
    });
}, {
    requires: ["ua","uibase","component"]
});

/**
 * 2010-11-09 2010-11-10 承玉<yiminghe@gmail.com>重构，attribute-base-uibase-Overlay ，采用 UIBase.create
 */
/**
 * model and control for overlay
 * @author:yiminghe@gmail.com
 */
KISSY.add("overlay/overlay", function(S, UIBase, Component, OverlayRender) {
    function require(s) {
        return S.require("uibase/" + s);
    }

    return UIBase.create(Component.ModelControl, [
        require("box"),
        require("contentbox"),
        require("position"),
        require("loading"),
        require("align"),
        require("resize"),
        require("mask")], {
    }, {
        ATTRS:{
            view:{
                valueFn:function() {
                    return new OverlayRender();
                }
            }
        }
    });
}, {
    requires:['uibase','component','./overlayrender']
})KISSY.add("overlay/dialogrender", function(S, UIBase, OverlayRender) {
    function require(s) {
        return S.require("uibase/" + s);
    }

    return UIBase.create(OverlayRender, [
        require("stdmodrender"),
        require("closerender")
    ]);
}, {
    requires:['uibase','./overlayrender']
});/**
 * KISSY.Dialog
 * @author: 承玉<yiminghe@gmail.com>, 乔花<qiaohua@taobao.com>
 */
KISSY.add('overlay/dialog', function(S, Overlay, UIBase, DialogRender) {

    function require(s) {
        return S.require("uibase/" + s);
    }

    return UIBase.create(Overlay, [
        require("stdmod"),
        require("close"),
        require("drag"),
        require("constrain")
    ], {
        renderUI:function() {
            var self = this;
            self.get("view").get("el").addClass("ks-dialog");
            //设置值，drag-ext 绑定时用到
            self.set("handlers", [self.get("view").get("header")]);
        }
    }, {
        ATTRS:{
            view:{
                valueFn:function() {
                    return new DialogRender();
                }
            }
        }
    });


}, {
    requires:[ "overlay/overlay","uibase",'overlay/dialogrender']
});

/**
 * 2010-11-10 承玉<yiminghe@gmail.com>重构，使用扩展类
 */



KISSY.add("overlay", function(S, O, OR, D, DR) {
    O.Render = OR;
    D.Render = DR;
    O.Dialog = D;
    return O;
}, {
    requires:["overlay/overlay","overlay/overlayrender","overlay/dialog","overlay/dialogrender"]
});
