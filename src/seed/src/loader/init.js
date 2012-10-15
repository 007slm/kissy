/**
 * @ignore
 * @fileOverview mix loader into S and infer KISSy baseUrl if not set
 * @author yiminghe@gmail.com, lifesinger@gmail.com
 */
(function (S) {

    S.mix(S,
        {
            /**
             * Registers a module with the KISSY global.
             * @param {String} name module name.
             * it must be set if combine is true in {@link KISSY#config}
             * @param {Function} fn module definition function that is used to return
             * this module value
             * @param {KISSY} fn.S KISSY global instance
             * @param {Object} [cfg] module optional config data
             * @param {String[]} cfg.requires this module's required module name list
             * @member KISSY
             *
             * for example:
             *      @example
             *      // dom module's definition
             *      KISSY.add('dom', function(S, UA){
             *          return {css: function(el, name, val){}};
             *      },{
             *          requires:['ua']
             *      });
             */
            add: function (name, fn, cfg) {
                this.getLoader().add(name, fn, cfg);
            },
            /**
             * Attached one or more modules to global KISSY instance.
             * @param {String|String[]} names moduleNames. 1-n modules to bind(use comma to separate)
             * @param {Function} callback callback function executed
             * when KISSY has the required functionality.
             * @param {KISSY} callback.S KISSY instance
             * @param callback.x... used module values
             * @member KISSY
             *
             * for example:
             *      @example
             *      // loads and attached overlay,dd and its dependencies
             *      KISSY.use('overlay,dd', function(S, Overlay){});
             */
            use: function (names, callback) {
                this.getLoader().use(names, callback);
            },
            /**
             * get KISSY 's loader instance
             * @member KISSY
             * @return {KISSY.Loader}
             */
            getLoader: function () {
                var self = this,
                    Config = self.Config,
                    Env = self.Env;
                if (Config.combine && !Env.nodejs) {
                    return Env._comboLoader;
                } else {
                    return Env._loader;
                }
            },
            clearLoader: function () {
                var self = this,
                    Env = self.Env,
                    l;

                if ((l = Env._comboLoader) && l.clear) {
                    l.clear();
                }
                if ((l = Env._loader) && l.clear) {
                    l.clear();
                }

                self.config({
                    map: false,
                    mapCombo: false,
                    modules: false,
                    packages: false
                })
            },
            /**
             * get module value defined by define function
             * @param {string} moduleName
             * @member KISSY
             */
            require: function (moduleName) {
                var mods = this.Env.mods,
                    mod = mods[moduleName];
                return mod && mod.value;
            }
        });

    var Loader = S.Loader,
        Env = S.Env,
        utils = Loader.Utils,
        ComboLoader = S.Loader.Combo;

    function returnJson(s) {
        return (new Function('return ' + s))();
    }

    /**
     * get base from seed/kissy.js
     * @return base for kissy
     * @ignore
     *
     * for example:
     *      @example
     *      http://a.tbcdn.cn/??s/kissy/1.4.0/seed-min.js,p/global/global.js
     *      note about custom combo rules, such as yui3:
     *      combo-prefix='combo?' combo-sep='&'
     */
    function getBaseInfo() {
        // get base from current script file path
        // notice: timestamp
        var baseReg = /^(.*)(seed|kissy)(?:-min)?\.js[^/]*/i,
            baseTestReg = /(seed|kissy)(?:-min)?\.js/i,
            comboPrefix,
            comboSep,
            scripts = Env.host.document.getElementsByTagName('script'),
            script = scripts[scripts.length - 1],
            src = utils.resolveByPage(script.src).toString(),
            baseInfo = script.getAttribute('data-config');

        if (baseInfo) {
            baseInfo = returnJson(baseInfo);
        } else {
            baseInfo = {};
        }

        // taobao combo syntax
        // /??seed.js,dom.js
        // /?%3fseed.js%2cdom.js
        src = src.replace(/%3f/gi, '?').replace(/%2c/gi, ',');

        comboPrefix = baseInfo.comboPrefix = baseInfo.comboPrefix || '??';
        comboSep = baseInfo.comboSep = baseInfo.comboSep || ',';

        var parts ,
            base,
            index = src.indexOf(comboPrefix);

        // no combo
        if (index == -1) {
            base = src.replace(baseReg, '$1');
        } else {
            base = src.substring(0, index);
            parts = src.substring(index + comboPrefix.length).split(comboSep);
            S.each(parts, function (part) {
                if (part.match(baseTestReg)) {
                    base += part.replace(baseReg, '$1');
                    return false;
                }
            });
        }
        return S.mix({
            base: base
        }, baseInfo);
    }

    if (S.Env.nodejs) {
        S.config('base', __dirname.replace(/\\/g, '/').replace(/\/$/, '') + '/');
    } else {
        S.config(S.mix({
            // 2k(2048) url length
            comboMaxUrlLength: 2000,
            // file limit number for a single combo url
            comboMaxFileNum: 40,
            charset: 'utf-8',
            tag: '@TIMESTAMP@'
        }, getBaseInfo()));
    }

    // Initializes loader.
    Env.mods = {}; // all added mods
    Env._loader = new Loader(S);

    if (ComboLoader) {
        Env._comboLoader = new ComboLoader(S);
    }

})(KISSY);