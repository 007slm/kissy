/**
 * @module  UIBase
 * @author  yiminghe@gmail.com,lifesinger@gmail.com
 * @refer http://martinfowler.com/eaaDev/uiArchs.html
 */
KISSY.add('uibase/base', function (S, Base, DOM, Node) {

    var UI_SET = '_uiSet',
        SRC_NODE = 'srcNode',
        ATTRS = 'ATTRS',
        HTML_PARSER = 'HTML_PARSER',
        noop = function() {
        };

    function capitalFirst(s) {
        s = s + '';
        return s.charAt(0).toUpperCase() + s.substring(1);
    }

    /*
     * UIBase for class-based component
     */
    function UIBase(config) {
        // 读取用户设置的属性值并设置到自身
        Base.apply(this, arguments);
        // 根据 srcNode 设置属性值
        // 按照类层次执行初始函数，主类执行 initializer 函数，扩展类执行构造器函数
        initHierarchy(this, config);
        // 是否自动渲染
        config && config.autoRender && this.render();
    }

    /**
     * 模拟多继承
     * init attr using constructors ATTRS meta info
     */
    function initHierarchy(host, config) {

        var c = host.constructor;

        while (c) {

            // 从 markup 生成相应的属性项
            if (config &&
                config[SRC_NODE] &&
                c.HTML_PARSER) {
                if ((config[SRC_NODE] = Node.one(config[SRC_NODE]))) {
                    applyParser.call(host, config[SRC_NODE], c.HTML_PARSER);
                }
            }

            c = c.superclass && c.superclass.constructor;
        }

        callMethodByHierarchy(host, "initializer", "constructor");

    }

    function callMethodByHierarchy(host, mainMethod, extMethod) {
        var c = host.constructor,
            extChains = [],
            ext,
            main,
            exts,
            t;

        // define
        while (c) {

            // 收集扩展类
            t = [];
            if (exts = c.__ks_exts) {
                for (var i = 0; i < exts.length; i++) {
                    ext = exts[i];
                    if (ext) {
                        if (extMethod != "constructor") {
                            //只调用真正自己构造器原型的定义，继承原型链上的不要管
                            if (ext.prototype.hasOwnProperty(extMethod)) {
                                ext = ext.prototype[extMethod];
                            } else {
                                ext = null;
                            }
                        }
                        ext && t.push(ext);
                    }
                }
            }

            // 收集主类
            // 只调用真正自己构造器原型的定义，继承原型链上的不要管 !important
            // 所以不用自己在 renderUI 中调用 superclass.renderUI 了，UIBase 构造器自动搜寻
            // 以及 initializer 等同理
            if (c.prototype.hasOwnProperty(mainMethod) && (main = c.prototype[mainMethod])) {
                t.push(main);
            }

            // 原地 reverse
            if (t.length) {
                extChains.push.apply(extChains, t.reverse());
            }

            c = c.superclass && c.superclass.constructor;
        }

        // 初始化函数
        // 顺序：父类的所有扩展类函数 -> 父类对应函数 -> 子类的所有扩展函数 -> 子类对应函数
        for (i = extChains.length - 1; i >= 0; i--) {
            extChains[i] && extChains[i].call(host);
        }
    }

    /**
     * 销毁组件
     * 顺序： 子类 destructor -> 子类扩展 destructor -> 父类 destructor -> 父类扩展 destructor
     */
    function destroyHierarchy(host) {
        var c = host.constructor,
            exts,
            d,
            i;

        while (c) {
            // 只触发该类真正的析构器，和父亲没关系，所以不要在子类析构器中调用 superclass
            if (c.prototype.hasOwnProperty("destructor")) {
                c.prototype.destructor.apply(host);
            }

            if ((exts = c.__ks_exts)) {
                for (i = exts.length - 1; i >= 0; i--) {
                    d = exts[i] && exts[i].prototype.__destructor;
                    d && d.apply(host);
                }
            }

            c = c.superclass && c.superclass.constructor;
        }
    }

    function applyParser(srcNode, parser) {
        var host = this, p, v;

        // 从 parser 中，默默设置属性，不触发事件
        for (p in parser) {
            if (parser.hasOwnProperty(p)) {
                v = parser[p];

                // 函数
                if (S.isFunction(v)) {
                    host.__set(p, v.call(host, srcNode));
                }
                // 单选选择器
                else if (S.isString(v)) {
                    host.__set(p, srcNode.one(v));
                }
                // 多选选择器
                else if (S.isArray(v) && v[0]) {
                    host.__set(p, srcNode.all(v[0]))
                }
            }
        }
    }

    UIBase.HTML_PARSER = {};

    UIBase.ATTRS = {
        // 是否已经渲染完毕
        rendered:{
            value:false
        },
        // dom 节点是否已经创建完毕
        created:{
            value:false
        },
        // 渲染该组件的目的容器
        render:{
            view:true,
            valueFn:function() {
                return Node.one(document.body);
            },
            setter:function(v) {
                return Node.one(v);
            }
        }
    };

    S.extend(UIBase, Base, {

        /**
         * 建立节点，先不放在 dom 树中，为了性能!
         */
        create:function() {
            var self = this;
            // 是否生成过节点
            if (!self.get("created")) {
                self._createDom();
                self.fire('createDom');
                callMethodByHierarchy(self, "createDom", "__createDom");
                self.fire('afterCreateDom');
                self.set("created", true);
            }
        },

        render: function() {
            var self = this;
            // 是否已经渲染过
            if (!self.get("rendered")) {
                self.create();
                self._renderUI();
                // 实际上是 beforeRenderUI
                self.fire('renderUI');
                callMethodByHierarchy(self, "renderUI", "__renderUI");
                self.fire('afterRenderUI');
                self._bindUI();
                // 实际上是 beforeBindUI
                self.fire('bindUI');
                callMethodByHierarchy(self, "bindUI", "__bindUI");
                self.fire('afterBindUI');
                self._syncUI();
                // 实际上是 beforeSyncUI
                self.fire('syncUI');
                callMethodByHierarchy(self, "syncUI", "__syncUI");
                self.fire('afterSyncUI');
                self.set("rendered", true);
            }
        },

        /**
         * 创建 dom 节点，但不放在 document 中
         */
        _createDom:noop,

        /**
         * 节点已经创建完毕，可以放在 document 中了
         */
        _renderUI: noop,
        renderUI: noop,

        /**
         * 根据属性变化设置 UI
         */
        _bindUI: function() {
            var self = this,
                attrs = self.__attrs,
                attr, m;

            for (attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    m = UI_SET + capitalFirst(attr);
                    if (self[m]) {
                        // 自动绑定事件到对应函数
                        (function(attr, m) {
                            self.on('after' + capitalFirst(attr) + 'Change', function(ev) {
                                self[m](ev.newVal, ev);
                            });
                        })(attr, m);
                    }
                }
            }
        },
        bindUI: noop,

        /**
         * 根据当前（初始化）状态来设置 UI
         */
        _syncUI: function() {
            var self = this,
                attrs = self.__attrs;
            for (var a in attrs) {
                if (attrs.hasOwnProperty(a)) {
                    var m = UI_SET + capitalFirst(a);
                    //存在方法，并且用户设置了初始值或者存在默认值，就同步状态
                    if (self[m]
                        // 用户如果设置了显式不同步，就不同步，比如一些值从 html 中读取，不需要同步再次设置
                        && attrs[a].sync !== false
                        && self.get(a) !== undefined) {
                        self[m](self.get(a));
                    }
                }
            }
        },
        syncUI: noop,

        destroy: function() {
            destroyHierarchy(this);
            this.fire('destroy');
            this.detach();
        }
    });

    /**
     * 根据基类以及扩展类得到新类
     * @param {function} base 基类
     * @param exts 扩展类
     * @param {Object} px 原型 mix 对象
     * @param {Object} sx 静态 mix 对象
     */
    UIBase.create = function(base, exts, px, sx) {
        if (S.isArray(base)) {
            sx = px;
            px = exts;
            exts = base;
            base = UIBase;
        }
        base = base || UIBase;
        if (S.isObject(exts)) {
            sx = px;
            px = exts;
            exts = [];
        }

        function C() {
            UIBase.apply(this, arguments);
        }

        S.extend(C, base, px, sx);

        if (exts) {
            C.__ks_exts = exts;

            S.each(exts, function(ext) {
                if (!ext)return;
                // 合并 ATTRS/HTML_PARSER 到主类
                S.each([ATTRS, HTML_PARSER], function(K) {
                    if (ext[K]) {
                        C[K] = C[K] || {};
                        // 不覆盖主类上的定义，因为继承层次上扩展类比主类层次高
                        // 但是值是对象的话会深度合并
                        deepMix(C[K], ext[K]);
                    }
                });

                // 合并功能代码到主类，不覆盖
                for (var p in ext.prototype) {
                    // 不覆盖主类，但是主类的父类还是覆盖吧
                    if (!C.prototype.hasOwnProperty((p)) &&
                        ext.prototype.hasOwnProperty(p)) {
                        C.prototype[p] = ext.prototype[p];
                    }
                }
            });
        }

        return C;
    };
    function deepMix(r, s) {
        if (!s) return r;
        for (var p in s) {
            // 如果属性是对象，接着递归进行
            if (S.isObject(s[p]) && S.isObject(r[p])) {
                deepMix(r[p], s[p]);
            } else if (!(p in r)) {
                r[p] = s[p];
            }
        }
        return undefined;
    }

    return UIBase;
}, {
    requires:["base","dom","node"]
});
/**
 * render 和 create 区别
 * render 包括 create ，以及把生成的节点放在 document 中
 * create 仅仅包括创建节点
 **/