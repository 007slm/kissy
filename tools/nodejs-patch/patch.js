/**
 * patch for nodejs
 * @author:yiminghe@gmail.com
 * @requires: jsdom (npm install jsdom) ,path
 * @description:emulate browser environment and rewrite loader
 */

/**
 * emulate browser and exports kissy
 */
(function() {
    var jsdom = require("jsdom").jsdom;
    document = jsdom("<html><head></head><body></body></html>");
    window = document.createWindow();
    location = window.location;

    KISSY = {
        __HOST:window
    };
    exports.KISSY = KISSY;
})();

/**
 * rewrite loader
 */
(function(S) {
    var path = require("path");
    S.Env = {};
    function mix(d, s) {
        for (var i in s) {
            if (s.hasOwnProperty(i)) {
                d[i] = s[i];
            }
        }
    }

    S.Env.mods = {};
    var mods = S.Env.mods;

    mix(S, {
        Config:{
            base:__filename.replace(/[^/]*$/i, "")
        },
        add: function(name, def, cfg) {
            mods[name] = {
                name:name,
                fn:def
            };
            S.mix(mods[name], cfg);
        },

        _packages:function(cfgs) {
            var self = this,
                ps;
            ps = self.__packages = self.__packages || {};
            for (var i = 0; i < cfgs.length; i++) {
                var cfg = cfgs[i];
                ps[cfg.name] = cfg;
                if (cfg.path && !cfg.path.match(/\/$/)) {
                    cfg.path += "/";
                }
            }
        },

        _getPath:function(modName) {
            this.__packages = this.__packages || {};
            var packages = this.__packages;
            var base = packages[modName] || this.baseUrl;
            return base + modName;
        },

        _combine:function(from, to) {
            var self = this,cs;
            if (S['isObject'](from)) {
                S.each(from, function(v, k) {
                    S.each(v, function(v2) {
                        self._combine(v2, k);
                    });
                });
                return;
            }
            cs = self.__combines = self.__combines || {};
            if (to) {
                cs[from] = to;
            } else {
                return cs[from] || from;
            }
        },
        _require:function(moduleName) {
            var self = this,
                mod = mods[moduleName];
            var re = self['onRequire'] && self['onRequire'](mod);
            if (re !== undefined) return re;
            return mod && mod.value;
        },
        _attach:function(modName) {
            var modPath = this._getPath(this._combine(modName));
            require(modPath);
            var mod = mods[modName];
            mod.requires = mod.requires || [];
            var requires = mod.requires;
            normalDepModuleName(modName, requires);
            var deps = [this];
            for (var i = 0; i < requires.length; i++) {
                this._attach(requires[i]);
                deps.push(this._require(requires[i]));
            }
            mod.value = mod.fn.apply(null, deps);
        },
        use:function(modNames, callback) {
            modNames = modNames.replace(/\s+/g, "").split(',');
            var self = this;
            var deps = [this];
            S.each(modNames, function(modName) {
                self._attach(modName);
                deps.push(self._require(modName));
            });
            callback && callback.apply(null, deps);
        }
    });
    function startsWith(str, prefix) {
        return str.lastIndexOf(prefix, 0) == 0;
    }

    function normalDepModuleName(moduleName, depName) {
        if (!depName) return depName;
        if (S.isArray(depName)) {
            for (var i = 0; i < depName.length; i++) {
                depName[i] = normalDepModuleName(moduleName, depName[i]);
            }
            return depName;
        }
        if (startsWith(depName, "../") || startsWith(depName, "./")) {
            var anchor = "",index;
            // x/y/z -> x/y/
            if ((index = moduleName.lastIndexOf("/")) != -1) {
                anchor = moduleName.substring(0, index + 1);
            }
            return path.normalize(anchor + depName);
        } else if (depName.indexOf("./") != -1
            || depName.indexOf("../") != -1) {
            return path.normalize(depName);
        } else {
            return depName;
        }
    }

})(KISSY);