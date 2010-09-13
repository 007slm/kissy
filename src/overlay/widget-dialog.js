/**
 * KISSY.Dialog
 * @creator     乔花<qiaohua@taobao.com>
 */
KISSY.add('dialog', function(S) {

    var DOM = S.DOM, Event = S.Event,

        DOT = '.', DIV = '<div>',

        CLS_CONTAINER = 'ks-overlay ks-dialog',
        CLS_PREFIX = 'ks-dialog-',

        defaultConfig = {
            title: '',
            footer: '',

            containerCls: CLS_CONTAINER,
            hdCls: CLS_PREFIX + 'hd',
            bdCls: CLS_PREFIX + 'bd',
            ftCls: CLS_PREFIX + 'ft',
            closeBtnCls: CLS_PREFIX + 'close',

            width: 400,
            height: 300,
            closable: true
        };

    /**
     * Dialog Class
     * @constructor
     * attached members：
     *  - this.header
     *  - this.footer
     */
    function Dialog(container, config) {
        var self = this;

        // factory or constructor
        if (!(self instanceof Dialog)) {
            return new Dialog(container, config);
        }

        config = config || { };
        if (S.isPlainObject(container)) config = container;
        else config.container = container;
        config.align = S.merge(S.clone(defaultConfig.align), config.align);
        
        Dialog.superclass.constructor.call(self, S.merge(defaultConfig, config));

        self.manager = S.DialogManager;
        self.manager.register(self);
    }

    S.extend(Dialog, S.Overlay);
    S.Dialog = Dialog;

    S.augment(Dialog, S.EventTarget, {

        _prepareMarkup: function() {
            var self = this,
                config = self.config;

            Dialog.superclass._prepareMarkup.call(self);

            self.header = S.get(DOT + config.hdCls, self.container);
            self.footer = S.get(DOT + config.ftCls, self.container);

            if (config.title || config.closable) {
                if (!self.header) {
                    self.header = DOM.create(DIV, { 'class': config.hdCls });
                    if (self.body === self.container){
                        self.setBody('');
                        self.body = DOM.create(DIV, { 'class': config.bdCls });
                        self.setBody(config.content);
                        self.container.appendChild(self.body);
                    }
                    DOM.insertBefore(self.header, self.body);
                }
                self.setHeader(config.title);
                if(config.closable) self._initClose();
            }

            if (config.footer) {
                if (!self.footer) {
                    self.footer = DOM.create(DIV, { 'class': config.ftCls });
                    self.container.appendChild(self.footer);
                }
                self.setFooter(config.footer);
            }
        },

        _initClose: function() {
            var self = this, config = self.config,
                elem = DOM.create(DIV, { 'class': config.closeBtnCls });

            DOM.html(elem, 'close');
            
            Event.on(elem, 'click', function(e) {
                e.halt();
                self.hide();
            });

            self.header.appendChild(elem);
        },

        setHeader: function(html) {
            if(S.isString(html)) DOM.html(this.header, html);
        },

        setFooter: function(html) {
            if(S.isString(html)) DOM.html(this.footer, html);
        }
    });


    S.DialogManager = {
        register: function(dlg) {
            this._dialog.push(dlg);
        },
        _dialog: [],
        hideAll: function(){
            S.each(this._dialog, function(dlg){
                dlg.hide();
            })
        }
    };

}, { host: 'overlay' });

