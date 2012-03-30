/**
 * input wrapper for autoComplete component
 * @author yiminghe@gmail.com
 */
KISSY.add("autocomplete/input", function (S, Event, UIBase, Component, Menu, AutoCompleteRender) {
    var AutoComplete,
        KeyCodes = Event.KeyCodes;

    /**
     * Input/Textarea Wrapper for autoComplete
     * @name AutoComplete
     * @extends Component.Controller
     * @class
     */
    AutoComplete = UIBase.create(Component.Controller, [],
        /**
         * @lends AutoComplete
         */
        {
            __CLASS:"AutoComplete",

            // user's input text
            _savedInputValue:null,

            _stopNotify:0,

            bindUI:function () {
                var self = this,
                    el = self.get("el");
                el.on("valuechange", self._onValueChange, self);
            },
            /**
             * fetch autoComplete list by value and show autoComplete list
             * @param {String} value value for fetching autoComplete list
             */
            sendRequest:function (value) {
                var self = this,
                    dataSource = self.get("dataSource");
                dataSource.fetchData(value, self._renderData, self);
            },
            _onValueChange:function () {
                var self = this;
                if (self._stopNotify) {
                    return;
                }
                self._savedInputValue = self.get('el').val();
                self.sendRequest(self._savedInputValue);
            },

            _handleFocus:function () {
                AutoComplete.superclass._handleFocus.apply(this, arguments);
                var autoCompleteMenu = this.get("menu");
                if (autoCompleteMenu) {
                    // 通知 menu
                    autoCompleteMenu._onInputFocus(this);
                }
            },

            _handleBlur:function () {
                AutoComplete.superclass._handleBlur.apply(this, arguments);
                var autoCompleteMenu = this.get("menu");
                if (autoCompleteMenu) {
                    // 通知 menu
                    autoCompleteMenu._onInputBlur();
                }
            },

            _renderData:function (data) {
                var self = this,
                    autoCompleteMenu = self.get("menu");
                autoCompleteMenu.removeChildren(true);
                if (data && data.length) {
                    data = data.slice(0, self.get("maxItemCount"));
                    var menuCfg = self.get("menuCfg") || {};
                    // 同步当前 width
                    autoCompleteMenu.set("width", menuCfg.width || self.get("el").css("width"));
                    var contents = data;
                    var texts = data;
                    if (self.get("formatHtml")) {
                        contents = self.get("formatHtml").call(self,
                            self.get("el").val(),
                            data);
                    }
                    if (self.get("formatText")) {
                        texts = self.get("formatText").call(self,
                            self.get("el").val(),
                            data);
                    }
                    for (var i = 0; i < data.length; i++) {
                        autoCompleteMenu.addChild(new Menu.Item({
                            prefixCls:self.get("prefixCls") + "autocomplete-",
                            content:contents[i],
                            textContent:texts[i],
                            value:data[i]
                        }))
                    }
                    autoCompleteMenu._showForAutoComplete();
                } else {
                    autoCompleteMenu.hide();
                }
            },

            _handleKeyEventInternal:function (e) {
                var self = this,
                    el = self.get("el"),
                    autoCompleteMenu = self.get("menu");
                if (!autoCompleteMenu) {
                    return;
                }

                // autocomplete will change input value
                // but it does not need to reload data
                if (S.inArray(e.keyCode, [
                    KeyCodes.UP,
                    KeyCodes.DOWN,
                    KeyCodes.ESC
                ])) {
                    self._stopNotify = 1;
                } else {
                    self._stopNotify = 0;
                }
                var activeItem;
                if (autoCompleteMenu.get("visible")) {
                    var handledByMenu = autoCompleteMenu._handleKeydown(e);

                    if (S.inArray(e.keyCode, [KeyCodes.DOWN, KeyCodes.UP])) {
                        // update menu's active value to input just for show
                        el.val(autoCompleteMenu.get("activeItem").get("textContent"))
                    }
                    // esc
                    if (e.keyCode == KeyCodes.ESC) {
                        autoCompleteMenu.hide();
                        // restore original user's input text
                        el.val(self._savedInputValue);
                        return true;
                    }
                    // tab
                    // if menu is open and an menuitem is highlighted, see as click/enter
                    if (e.keyCode == KeyCodes.TAB) {
                        if (activeItem = autoCompleteMenu.get("activeItem")) {
                            activeItem._performInternal();
                            return true;
                        }
                    }
                    return handledByMenu;
                } else if (e.keyCode == KeyCodes.DOWN || e.keyCode == KeyCodes.UP) {
                    if (autoCompleteMenu.get("children").length) {
                        autoCompleteMenu._showForAutoComplete();
                        return true;
                    } else {
                        self.sendRequest(el.val());
                    }
                }
            },

            _uiSetSelectedItem:function (item) {
                var self = this;
                if (item) {
                    var textContent = item.get("textContent");
                    self.get("el").val(textContent);
                    self._savedInputValue = textContent;
                    /**
                     * @name AutoComplete#select
                     * @description fired when user select from suggestion list
                     * @event
                     * @param e
                     * @param e.value value of selected menuItem
                     * @param e.content content of selected menuItem
                     * @param e.input current active input
                     */
                    self.fire("select", {
                        value:item.get("value"),
                        content:item.get("content"),
                        textContent:textContent
                    });
                }
            },

            destructor:function () {
                var self = this,
                    autoCompleteMenu = self.get("menu");
                autoCompleteMenu.detachInput(self, self.get("destroyMenu"));
                self.__set("menu", null);
            }
        }, {
            ATTRS:/**
             * @lends AutoComplete
             */
            {
                focusable:{
                    value:true
                },
                handleMouseEvents:{
                    value:false
                },
                allowTextSelection_:{
                    value:true
                },

                /**
                 * Whether destroy menu when this destroys.Default false
                 * @type Boolean
                 */
                destroyMenu:{
                    value:false
                },

                /**
                 * AutoComplete dropDown menuList
                 * @type AutoComplete.Menu
                 */
                menu:{
                    setter:function (m) {
                        if (m) {
                            m.attachInput(this);
                        }
                    }
                },
                /**
                 * aria-owns.ReadOnly.
                 * @type String
                 */
                ariaOwns:{
                    view:true
                },
                /**
                 * aria-expanded.ReadOnly.
                 * @type String
                 */
                ariaExpanded:{
                    view:true
                },
                /**
                 * dataSource for autoComplete.For Configuration when new.
                 * @type AutoComplete.LocalDataSource|AutoComplete.RemoteDataSource
                 */
                dataSource:{
                    // 和 input 关联起来，input可以有很多，每个数据源可以不一样，但是 menu 共享
                },
                /**
                 * maxItemCount max count of data to be shown
                 * @type Number
                 */
                maxItemCount:{value:99999},
                /**
                 * Config autoComplete menu list.For Configuration when new.
                 * {Number} menuCfg.width :
                 * Config autoComplete menu list's alignment.
                 * Default to current active input's width.<br/>
                 * {Object} menuCfg.align :
                 * Config autoComplete menu list's alignment.
                 * Same with {@link UIBase.Align#align} .
                 * Default : align current input's bottom left edge
                 * with autoComplete list's top left edge.
                 * @type Object
                 */
                menuCfg:{
                    value:{
                        // width
                        // align
                    }
                },
                /**
                 * Format function to return  array of html from array of data.
                 * @type {Function}
                 */
                formatHtml:{},
                /**
                 * Format function to return  array of text
                 * from array of data for autocomplete input.
                 * @type {Function}
                 */
                formatText:{},

                /**
                 * Readonly.User selected menu item by click or enter on highlighted suggested menu item
                 * @type Menu.Item
                 */
                selectedItem:{}
            },

            DefaultRender:AutoCompleteRender
        });

    Component.UIStore.setUIByClass("autocomplete-input", {
        priority:Component.UIStore.PRIORITY.LEVEL1,
        ui:AutoComplete
    });

    return AutoComplete;
}, {
    requires:[
        'event',
        'uibase', 'component',
        'menu',
        './inputRender']
});