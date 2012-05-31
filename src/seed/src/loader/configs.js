/**
 * @fileOverview Declare config info for KISSY.
 * @author yiminghe@gmail.com
 */
(function (S) {
    if (typeof require !== 'undefined') {
        return;
    }
    var utils = S.Loader.Utils;
    /**
     * modify current module path
     * @private
     * @param rules
     * @example
     * <code>
     *      [
     *          [/(.+-)min(.js(\?t=\d+)?)$/,"$1$2"],
     *          [/(.+-)min(.js(\?t=\d+)?)$/,function(_,m1,m2){
     *              return m1+m2;
     *          }]
     *      ]
     * </code>
     */
    S.configs.map = function (rules) {
        var self = this;
        return self.Config.mappedRules = (self.Config.mappedRules || []).concat(rules || []);
    };

    /**
     * 包声明
     * biz -> .
     * 表示遇到 biz/x
     * 在当前网页路径找 biz/x.js
     * @private
     */
    S.configs.packages = function (cfgs) {
        var self = this,
            name,
            base,
            tag,
            Env = self.Env,
            ps = Env.packages = Env.packages || {};
        if (cfgs) {
            S.each(cfgs, function (cfg, key) {
                // 兼容数组方式
                name = cfg.name || key;
                // 兼容 path
                base = cfg.base || cfg.path;
                tag = cfg.tag;
                ps[ name ] = cfg;
                // 注意正则化
                cfg.name = name;
                cfg.base = base && utils.normalBasePath(base);
                cfg.tag = tag && encodeURIComponent(tag);
                delete cfg.path;
            });
        }
    };

    /*
     只用来指定模块依赖信息.
     * <code>
     *
     * KISSY.config({
     *  base:'',
     *  // dom-min.js
     *  debug:'',
     *  combine:true,
     *  tag:'',
     *  packages:{
     *      "biz1": {
     *          // path change to base
     *          base: "haha",
     *          // x.js
     *          debug:'',
     *          tag:'',
     *          combine:false,
     *      }
     *  },
     *  modules:{
     *      "biz1/main" : {
     *          requires: [ "biz1/part1" , "biz1/part2" ]
     *      }
     *  }
     * });
     */
    S.configs.modules = function (modules) {
        var self = this,
            t,
            mods = self.Env.mods;
        if (modules) {
            S.each(modules, function (modCfg, modName) {
                modName = utils.indexMapStr(modName);
                utils.createModuleInfo(self, modName, modCfg);
            });
        }
    };

    S.configs.modules.order = 10;

    /**
     * KISSY 's base path.
     */
    S.configs.base = function (base) {
        var self = this;
        if (!base) {
            return self.Config.base;
        }
        self.Config.base = utils.normalBasePath(base);
    };
})(KISSY);