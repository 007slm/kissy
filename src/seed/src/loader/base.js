/**
 * @fileOverview setup data structure for kissy loader
 * @author yiminghe@gmail.com,lifesinger@gmail.com
 */
(function (S) {
    if (typeof require !== 'undefined') {
        return;
    }

    /**
     * @class KISSY Loader constructor
     * This class should not be instantiated manually.
     * @memberOf KISSY
     */
    function Loader(SS) {
        this.SS = SS;
        /**
         * @name KISSY.Loader#afterModAttached
         * @description fired after a module is attached
         * @event
         * @param e
         * @param {KISSY.Loader.Module} e.mod current module object
         */
    }

    KISSY.Loader = Loader;

    /**
     * @class KISSY Module constructor
     * This class should not be instantiated manually.
     * @memberOf KISSY.Loader
     */
    function Module(ps) {
        S.mix(this, ps);
    }

    S.augment(Module,
        /**
         * @lends KISSY.Loader.Module#
         */
        {
            /**
             * Set the value of current module
             * @param v value to be set
             */
            setValue:function (v) {
                this.value = v;
            },

            /**
             * Get the fullpath of current module if load dynamically
             */
            getFullPath:function () {
                var self = this, t;
                return self.fullpath || (self.fullpath =
                    Loader.Utils.getMappedPath(self.SS,
                        self.packageInfo.base +
                            self.path +
                            ((t = self.getTag()) ? ("?t=" + t) : "")));
            },

            /**
             * Get the value of current module
             */
            getValue:function () {
                return this.value;
            },

            /**
             * Get the name of current module
             * @returns {String}
             */
            getName:function () {
                return this.name;
            },

            /**
             * Get the packageInfo of current module
             * @return {Object}
             */
            getPackageInfo:function () {
                return this.packageInfo;
            },

            /**
             * Get the tag of current module
             * @return {String}
             */
            getTag:function () {
                return this.tag || this.packageInfo.tag;
            },

            /**
             * Get the charset of current module
             * @return {String}
             */
            getCharset:function () {
                return this.charset || this.packageInfo.charset;
            }
        });

    Loader.Module = Module;

    // 模块(mod)状态
    Loader.STATUS = {
        "INIT":0,
        "LOADING":1,
        "LOADED":2,
        "ERROR":3,
        "ATTACHED":4
    };
})(KISSY);