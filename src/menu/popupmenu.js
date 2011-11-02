/**
 * positionable and not focusable menu
 * @author yiminghe@gmail.com
 */
KISSY.add("menu/popupmenu", function(S, UIBase, Component, Menu, PopupMenuRender) {

    function getParentMenu(self) {
        var subMenuItem = self.get("parent"),
            parentMenu;
        if (subMenuItem) {
            if (subMenuItem.get("menu") === self) {
                parentMenu = subMenuItem.get("parent");
            }
        }
        if (parentMenu && parentMenu.get(autoHideOnMouseLeave)) {
            return parentMenu;
        }
        return 0;
    }

    function getOldestMenu(self) {
        var pre = self,now = self;
        while (now) {
            pre = now;
            now = getParentMenu(pre);
            if (!now) {
                break;
            }
        }
        return pre;
    }

    var autoHideOnMouseLeave = "autoHideOnMouseLeave";

    function clearOwn(self) {
        var l;
        if (l = self._leaveHideTimer) {
            clearTimeout(l);
            self._leaveHideTimer = 0;
        }
    }

    var PopMenu = UIBase.create(Menu, [
        UIBase.Position,
        UIBase.Align
    ], {
        _clearLeaveHideTimers:function() {
            var self = this,i,item,menu;
            if (!self.get(autoHideOnMouseLeave)) {
                return;
            }
            clearOwn(self);
            var cs = self.get("children");
            for (i = 0; i < cs.length; i++) {
                item = cs[i];
                if ((menu = item.get("menu")) &&
                    menu.get(autoHideOnMouseLeave)) {
                    menu._clearLeaveHideTimers();
                }
            }
        },
        _handleMouseLeave:function() {
            var self = this;
            if (!self.get(autoHideOnMouseLeave)) {
                return;
            }
            self._leaveHideTimer = setTimeout(function() {
                // only hide ancestor is enough , it will listen to its ancestor's hide event to hide
                getOldestMenu(self).hide();
            }, self.get("autoHideDelay"));
        },

        _handleMouseEnter:function() {
            var self = this,parent = getParentMenu(self);
            if (parent) {
                parent._clearLeaveHideTimers();
            } else {
                self._clearLeaveHideTimers();
            }
        },

        /**
         *  suppose it has focus (as a context menu),
         *  then it must hide when click document
         */
        _handleBlur:function() {
            var self = this;
            PopMenu.superclass._handleBlur.apply(self, arguments);
            self.hide();
        }
    }, {
        ATTRS:{
            // 弹出菜单一般不可聚焦，焦点在使它弹出的元素上
            focusable:{
                value:false
            },
            visibleMode:{
                value:"visibility"
            },
            autoHideOnMouseLeave:{},
            autoHideDelay:{
                value:100
            }
        },
        DefaultRender:PopupMenuRender
    });

    Component.UIStore.setUIByClass("popupmenu", {
        priority:Component.UIStore.PRIORITY.LEVEL2,
        ui:PopMenu
    });

    return PopMenu;

}, {
    requires:['uibase','component','./menu','./popupmenurender']
});