/**
 * @fileOverview combination of menu and button ,similar to native select
 * @author yiminghe@gmail.com
 */
KISSY.add("menubutton/base", function (S, Node, Button, MenuButtonRender, Menu, Component, undefined) {

    var win = S.Env.host;

    function getMenu(self, init) {
        var m = self.get("menu");
        if (m && m.xclass) {
            if (init) {
                m = Component.create(m, self);
                self.__set("menu", m);
            } else {
                return null;
            }
        }
        return m;
    }

    function constructMenu(self) {
        var m = new Menu.PopupMenu(S.mix({
            prefixCls:self.get("prefixCls")
        }, self.get("menuCfg")));
        self.__set("menu", m);
        return m;
    }

    function reposition() {
        var self = this,
            menu = getMenu(self);
        if (menu && menu.get("visible")) {
            menu.set("align", S.merge({
                node:self.get("el")
            }, ALIGN, self.get("menuCfg").align));
        }
    }

    function hideMenu(self) {
        var menu = getMenu(self);
        if (menu) {
            menu.hide();
        }
    }

    function showMenu(self) {
        var el = self.get("el"),
            menu = getMenu(self, 1);
        // 保证显示前已经 bind 好 menu 事件
        self.bindMenu();
        if (menu && !menu.get("visible")) {
            var menuCfg = self.get("menuCfg");
            // 根据 el 自动调整大小
            if (menuCfg.width == null) {
                menu.set("width", el.width());
            }
            menu.set("align", S.merge({
                node:el
            }, ALIGN, menuCfg.align));
            menu.show();
            el.attr("aria-haspopup", menu.get("el").attr("id"));
        }
    }

    var $ = Node.all,
        KeyCodes = Node.KeyCodes,
        ALIGN = {
            points:["bl", "tl"],
            overflow:{
                adjustX:1,
                adjustY:1
            }
        };
    /**
     * A menu button component, consist of a button and a drop down popup menu.
     * @class
     * @name MenuButton
     * @extends Button
     */
    var MenuButton = Button.extend([Component.DecorateChild],
        /**
         * @lends MenuButton.prototype
         */
        {

            /**
             * Get menu from attribute consider function type.
             * @param {Boolean} [initByCallFunction] If attribute 's value is a function, whether to call this function to get its returned value.
             * @return {Menu} Menu instance or null.
             */
            getMenu:function (initByCallFunction) {
                return getMenu(this, initByCallFunction);
            },

            initializer:function () {
                this._reposition = S.buffer(reposition, 50, this);
            },

            _uiSetCollapsed:function (v) {
                if (v) {
                    hideMenu(this);
                } else {
                    showMenu(this);
                }
            },

            /**
             * Bind menu to current component.
             * Protected, should only be overridden by subclasses.
             * @protected
             */
            bindMenu:function () {
                var self = this,
                    menu = self.get("menu");
                if (menu) {
                    menu.on("afterActiveItemChange", function (ev) {
                        self.set("activeItem", ev.newVal);
                    });

                    menu.on("click", self.handleMenuClick, self);

                    // 窗口改变大小，重新调整
                    $(win).on("resize", self._reposition, self);

                    /*
                     只绑定事件一次
                     */
                    self.bindMenu = S.noop;
                }
            },

            /**
             * Handle click on drop down menu. Fire click event on menubutton.
             * Protected, should only be overridden by subclasses.
             * @param {Event.Object} e Click event object.
             * @protected
             */
            handleMenuClick:function (e) {
                var self = this;
                self.fire("click", {
                    target:e.target
                });
            },

            /**
             * Handle keydown/up event.
             * If drop down menu is visible then handle event to menu.
             * Returns true if the event was handled, falsy otherwise.
             * Protected, should only be overridden by subclasses.
             * @param {Event.Object} e key event to handle.
             * @return {Boolean} True Whether the key event was handled.
             * @protected
             * @override
             */
            handleKeyEventInternal:function (e) {
                var self = this,
                    menu = getMenu(self);

                // space 只在 keyup 时处理
                if (e.keyCode == KeyCodes.SPACE) {
                    // Prevent page scrolling in Chrome.
                    e.preventDefault();
                    if (e.type != "keyup") {
                        return undefined;
                    }
                } else if (e.type != "keydown") {
                    return undefined;
                }
                //转发给 menu 处理
                if (menu && menu.get("visible")) {
                    var handledByMenu = menu.handleKeydown(e);
                    // esc
                    if (e.keyCode == KeyCodes.ESC) {
                        self.set("collapsed", true);
                        return true;
                    }
                    return handledByMenu;
                }

                // Menu is closed, and the user hit the down/up/space key; open menu.
                if (e.keyCode == KeyCodes.SPACE ||
                    e.keyCode == KeyCodes.DOWN ||
                    e.keyCode == KeyCodes.UP) {
                    self.set("collapsed", false);
                    return true;
                }
                return undefined;
            },

            /**
             * Perform default action for menubutton.
             * Toggle the drop down menu to show or hide.
             * Protected, should only be overridden by subclasses.
             * @protected
             * @override
             */
            performActionInternal:function () {
                var self = this;
                self.set("collapsed", !self.get("collapsed"));
            },

            /**
             * Handles blur event.
             * When it loses keyboard focus, close the drop dow menu.
             * @param {Event.Object} e Blur event.
             * Protected, should only be overridden by subclasses.
             * @protected
             * @override
             */
            handleBlur:function (e) {
                var self = this;
                MenuButton.superclass.handleBlur.call(self, e);
                // such as : click the document
                self.set("collapsed", true);
            },


            /**
             * Adds a new menu item at the end of the menu.
             * @param {Menu.Item} item Menu item to add to the menu.
             */
            addItem:function (item, index) {
                var menu = getMenu(this, 1) || constructMenu(this);
                menu.addChild(item, index);
            },

            /**
             * Remove a existing menu item from drop down menu.
             * @param c {Menu.Item} Existing menu item.
             * @param [destroy] {Boolean} Whether destroy removed menu item.
             */
            removeItem:function (c, destroy) {
                /**
                 * @type Controller
                 */
                var menu = getMenu(this);
                if (menu) {
                    menu.removeChild(c, destroy);
                }
            },

            /**
             * Remove all menu items from drop down menu.
             * @param [destroy] {Boolean} Whether destroy removed menu items.
             */
            removeItems:function (destroy) {
                var menu = getMenu(this);
                menu && menu.removeChildren(destroy);
            },

            /**
             * Returns the child menu item of drop down menu at the given index, or null if the index is out of bounds.
             * @param {Number} index 0-based index.
             */
            getItemAt:function (index) {
                var menu = getMenu(this);
                return menu && menu.getChildAt(index);
            },

            // 禁用时关闭已显示菜单
            _uiSetDisabled:function (v) {
                var self = this;
                !v && self.set("collapsed", true);
            },

            /**
             * Decorate child element to from a child component.
             * @param {Function} UI Child component's constructor
             * @param {NodeList} el Child component's root element.
             * @protected
             * @override
             */
            decorateChildrenInternal:function (UI, el) {
                // 不能用 diaplay:none , menu 的隐藏是靠 visibility
                // eg: menu.show(); menu.hide();
                el.css("visibility", "hidden");
                var self = this,
                    docBody = S.one(el[0].ownerDocument.body);
                docBody.prepend(el);
                var menu = new UI(S.mix({
                    srcNode:el,
                    prefixCls:self.get("prefixCls")
                }, self.get("menuCfg")));
                self.__set("menu", menu);
            },

            destructor:function () {
                var self = this;
                $(win).detach("resize", self._reposition, self);
            }

        },

        {
            ATTRS:/**
             * @lends MenuButton.prototype
             */
            {
                /**
                 * Current active menu item.
                 * @type Menu.Item
                 */
                activeItem:{
                    view:true
                },

                /**
                 * Extra Menu configuration.See {@link Menu}.
                 * Can set "align" to specify button's alignment with menu.
                 * Can set "width" to specify button's menu width.
                 * If not set "width" , menu's width will be same with menubutton.
                 * @type Object
                 */
                menuCfg:{
                    value:{}
                },
                /**
                 * @private
                 */
                decorateChildCls:{
                    value:"popupmenu"
                },
                /**
                 * Drop down menu associated with this menubutton.
                 * @type Menu
                 */
                menu:{
                    setter:function (v) {
                        if (v instanceof Menu) {
                            v.__set("parent", this);
                        }
                    }
                },
                /**
                 * Whether drop menu is shown.
                 * @type Boolean
                 */
                collapsed:{
                    value:true,
                    view:true
                },
                xrender:{
                    value:MenuButtonRender
                }
            }
        }, {
            xclass:'menu-button',
            priority:20
        });

    return MenuButton;
}, {
    requires:[ "node", "button", "./menubuttonRender", "menu", "component"]
});