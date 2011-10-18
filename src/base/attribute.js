/**
 * @module  Attribute
 * @author  yiminghe@gmail.com, lifesinger@gmail.com
 */
KISSY.add('base/attribute', function(S, undef) {

    // atomic flag
    Attribute.INVALID = {};

    var INVALID = Attribute.INVALID;

    /**
     *
     * @param host
     * @param method
     * @return method if fn or host[method]
     */
    function normalFn(host, method) {
        if (S.isString(method)) {
            return host[method];
        }
        return method;
    }

    /**
     *
     * @param obj
     * @param name
     * @param create
     * @return non-empty property value of obj
     */
    function ensureNonEmpty(obj, name, create) {
        var ret = obj[name] || {};
        if (create) {
            obj[name] = ret;
        }
        return ret;
    }

    /**
     *
     * @param self
     * @return non-empty attr config holder
     */
    function getAttrs(self) {
        /**
         * attribute meta information
         {
         attrName: {
         getter: function,
         setter: function,
         value: v, // default value
         valueFn: function
         }
         }
         */
        return ensureNonEmpty(self, "__attrs", true);
    }

    /**
     *
     * @param self
     * @return non-empty attr value holder
     */
    function getAttrVals(self) {
        /**
         * attribute value
         {
         attrName: attrVal
         }
         */
        return ensureNonEmpty(self, "__attrVals", true);
    }

    /**
     * o, [x,y,z] => o[x][y][z]
     * @param o
     * @param path
     */
    function getValueByPath(o, path) {
        for (var i = 0,len = path.length;
             o != undef && i < len;
             i++) {
            o = o[path[i]];
        }
        return o;
    }

    /**
     * o, [x,y,z], val => o[x][y][z]=val
     * @param o
     * @param path
     * @param val
     */
    function setValueByPath(o, path, val) {
        var rlen = path.length - 1,
            s = o;
        if (rlen >= 0) {
            for (var i = 0; i < rlen; i++) {
                o = o[path[i]];
            }
            if (o != undef) {
                o[path[i]] = val;
            } else {
                s = undef;
            }
        }
        return s;
    }

    /**
     * 提供属性管理机制
     * @name Attribute
     * @class
     */
    function Attribute() {
    }

    S.augment(Attribute,
        /**
         * @lends Attribute.prototype
         */
        {

            /**
             * @return un-cloned attr config collections
             */
            getAttrs: function() {
                return getAttrs(this);
            },

            /**
             * @return un-cloned attr value collections
             */
            getAttrVals:function() {
                var self = this,
                    o = {},
                    a,
                    attrs = getAttrs(self);
                for (a in attrs) {
                    o[a] = self.get(a);
                }
                return o;
            },

            /**
             * Adds an attribute with the provided configuration to the host object.
             * @param {String} name attrName
             * @param {Object} attrConfig The config supports the following properties:
             * {
             *     value: 'the default value', // 最好不要使用自定义类生成的对象，这时使用 valueFn
             *     valueFn: function //
             *     setter: function
             *     getter: function
             * }
             * @param {boolean} override whether override existing attribute config ,default true
             */
            addAttr: function(name, attrConfig, override) {
                var self = this,
                    attrs = getAttrs(self),
                    cfg = S.clone(attrConfig);
                if (!attrs[name]) {
                    attrs[name] = cfg;
                } else {
                    S.mix(attrs[name], cfg, override);
                }
                return self;
            },

            /**
             * Configures a group of attributes, and sets initial values.
             * @param {Object} attrConfigs  An object with attribute name/configuration pairs.
             * @param {Object} initialValues user defined initial values
             */
            addAttrs: function(attrConfigs, initialValues) {
                var self = this;

                S.each(attrConfigs, function(attrConfig, name) {
                    self.addAttr(name, attrConfig);
                });
                if (initialValues) {
                    for (var k in initialValues) {
                        self.set(k, initialValues[k]);
                    }
                }
                return self;
            },

            /**
             * Checks if the given attribute has been added to the host.
             */
            hasAttr: function(name) {
                return name && getAttrs(this).hasOwnProperty(name);
            },

            /**
             * Removes an attribute from the host object.
             */
            removeAttr: function(name) {
                var self = this;

                if (self.hasAttr(name)) {
                    delete getAttrs(self)[name];
                    delete getAttrVals(self)[name];
                }

                return self;
            },

            /**
             * Sets the value of an attribute.
             */
            set: function(name, value) {
                var self = this,
                    dot = ".",
                    path,
                    subVal,
                    prevVal,
                    fullName = name;

                if (name.indexOf(dot) !== -1) {
                    path = name.split(dot);
                    name = path.shift();
                }

                prevVal = self.get(name);

                if (path) {
                    subVal = getValueByPath(prevVal, path);
                }

                // if no change, just return
                if (!path && prevVal === value) {
                    return;
                } else if (path && subVal === value) {
                    return;
                }

                if (path) {
                    var tmp = S.clone(prevVal);
                    setValueByPath(tmp, path, value);
                    value = tmp;
                }

                // check before event
                if (false === self.__fireAttrChange('before', name, prevVal, value, fullName)) {
                    return false;
                }

                // set it
                var ret = self.__set(name, value);

                if (ret === false) {
                    return ret;
                }

                // fire after event
                self.__fireAttrChange('after', name, prevVal, getAttrVals(self)[name], fullName);

                return self;
            },

            __fireAttrChange: function(when, name, prevVal, newVal, subAttrName) {
                return this.fire(when + capitalFirst(name) + 'Change', {
                    attrName: name,
                    subAttrName:subAttrName,
                    prevVal: prevVal,
                    newVal: newVal
                });
            },

            /**
             * internal use, no event involved, just set.
             * @private
             */
            __set: function(name, value) {
                var self = this,
                    setValue,
                    // if host does not have meta info corresponding to (name,value)
                    // then register on demand in order to collect all data meta info
                    // 一定要注册属性元数据，否则其他模块通过 _attrs 不能枚举到所有有效属性
                    // 因为属性在声明注册前可以直接设置值
                    attrConfig = ensureNonEmpty(getAttrs(self), name, true),
                    validator = attrConfig['validator'],
                    setter = attrConfig['setter'];

                // validator check
                if (validator = normalFn(self, validator)) {
                    if (!validator.call(self, value, name)) {
                        return false;
                    }
                }

                // if setter has effect
                if (setter = normalFn(self, setter)) {
                    setValue = setter.call(self, value, name);
                }

                if (setValue === INVALID) {
                    return false;
                }

                if (setValue !== undef) {
                    value = setValue;
                }

                // finally set
                getAttrVals(self)[name] = value;
            },

            /**
             * Gets the current value of the attribute.
             */
            get: function(name) {
                var self = this,
                    dot = ".",
                    path,
                    attrConfig,
                    getter, ret;

                if (name.indexOf(dot) !== -1) {
                    path = name.split(dot);
                    name = path.shift();
                }

                attrConfig = ensureNonEmpty(getAttrs(self), name);
                getter = attrConfig['getter'];

                // get user-set value or default value
                //user-set value takes privilege
                ret = name in getAttrVals(self) ?
                    getAttrVals(self)[name] :
                    self.__getDefAttrVal(name);

                // invoke getter for this attribute
                if (getter = normalFn(self, getter)) {
                    ret = getter.call(self, ret, name);
                }

                if (path) {
                    ret = getValueByPath(ret, path);
                }

                return ret;
            },

            /**
             * get default attribute value from valueFn/value
             * @private
             * @param name
             */
            __getDefAttrVal: function(name) {
                var self = this,
                    attrConfig = ensureNonEmpty(getAttrs(self), name),
                    valFn,
                    val;

                if ((valFn = normalFn(self, attrConfig.valueFn))) {
                    val = valFn.call(self);
                    if (val !== undef) {
                        attrConfig.value = val;
                    }
                    delete attrConfig.valueFn;
                    getAttrs(self)[name] = attrConfig;
                }

                return attrConfig.value;
            },

            /**
             * Resets the value of an attribute.just reset what addAttr set  (not what invoker set when call new Xx(cfg))
             * @param {String} name name of attribute
             */
            reset: function (name) {
                var self = this;

                if (name) {
                    if (self.hasAttr(name)) {
                        // if attribute does not have default value, then set to undefined.
                        return self.set(name, self.__getDefAttrVal(name));
                    }
                    else {
                        return self;
                    }
                }

                var attrs = getAttrs(self);

                // reset all
                for (name in attrs) {
                    self.reset(name);
                }

                return self;
            }
        });

    function capitalFirst(s) {
        return s.charAt(0).toUpperCase() + s.substring(1);
    }

    Attribute['__capitalFirst'] = capitalFirst;

    return Attribute;
});

/**
 *  2011-10-18
 *    get/set sub attribute value ,set("x.y",val) x 最好为 {} ，不要是 new Clz() 出来的
 *    add validator
 */
