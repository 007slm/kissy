﻿/*
Copyright 2012, KISSY UI Library v1.30dev
MIT Licensed
build time: Feb 25 23:13
*/
/*
 * @fileOverview a seed where KISSY grows up from , KISS Yeah !
 * @author lifesinger@gmail.com,yiminghe@gmail.com
 */
(function (S, undefined) {
    /**
     * @namespace
     * @name KISSY
     */

    var host = this,
        hasEnumBug = !({toString:1}.propertyIsEnumerable('toString')),
        hasOwn = Object.prototype.hasOwnProperty,
        emumProperties = [
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'toString',
            'toLocaleString',
            'valueOf'
        ],
        meta = {
            /**
             * Copies all the properties of s to r.
             * @memberOf KISSY
             * @param {Object} r the augmented object
             * @param {Object} s the object need to augment
             * @param {boolean} [ov=true] whether overwrite existing property
             * @param {String[]} [wl] array of white-list properties
             * @param deep {boolean} whether recursive mix if encounter object,
             * if deep is set true,then ov should set true too!
             * @return {Object} the augmented object
             * @example
             * <code>
             * var t={};
             * S.mix({x:{y:2,z:4}},{x:{y:3,a:t}},1,0,1) =>{x:{y:3,z:4,a:{}}} , a!==t
             * S.mix({x:{y:2,z:4}},{x:{y:3,a:t}},1) => {x:{y:3,a:t}}
             * </code>
             */
            mix:function (r, s, ov, wl, deep) {
                if (!s || !r) {
                    return r;
                }
                if (ov === undefined) {
                    ov = true;
                }
                var i, p, len;

                if (wl && (len = wl.length)) {
                    for (i = 0; i < len; i++) {
                        p = wl[i];
                        if (p in s) {
                            _mix(p, r, s, ov, deep);
                        }
                    }
                } else {
                    for (p in s) {
                        // no hasOwnProperty judge !
                        _mix(p, r, s, ov, deep);
                    }

                    // fix #101
                    if (hasEnumBug) {
                        for (var j = 0; j < emumProperties.length; j++) {
                            p = emumProperties[j];
                            if (ov && hasOwn.call(s, p)) {
                                r[p] = s[p];
                            }
                        }
                    }

                }
                return r;
            }
        },

        _mix = function (p, r, s, ov, deep) {
            if (ov || !(p in r)) {
                var target = r[p], src = s[p];
                // prevent never-end loop
                if (target === src) {
                    return;
                }
                // 来源是数组和对象，并且要求深度 mix
                if (deep && src && (S.isArray(src) || S.isPlainObject(src))) {
                    // 目标值为对象或数组，直接 mix
                    // 否则 新建一个和源值类型一样的空数组/对象，递归 mix
                    var clone = target && (S.isArray(target) || S.isPlainObject(target)) ?
                        target :
                        (S.isArray(src) ? [] : {});
                    r[p] = S.mix(clone, src, ov, undefined, true);
                } else if (src !== undefined) {
                    r[p] = s[p];
                }
            }
        },

        // If KISSY is already defined, the existing KISSY object will not
        // be overwritten so that defined namespaces are preserved.
        seed = (host && host[S]) || {},

        guid = 0,
        EMPTY = '';

    // The host of runtime environment. specify by user's seed or <this>,
    // compatibled for  '<this> is null' in unknown engine.
    host = seed.__HOST || (seed.__HOST = host || {});

    // shortcut and meta for seed.
    // override previous kissy
    S = host[S] = meta.mix(seed, meta);

    S.mix(S,
        /**
         * @lends KISSY
         */
        {
            /**
             * @private
             */
            configs:(S.configs || {}),
            // S.app() with these members.
            __APP_MEMBERS:['namespace'],
            __APP_INIT_METHODS:[init],

            /**
             * The version of the library.
             * @type {String}
             */
            version:'1.30dev',

            /**
             * The build time of the library
             * @type {String}
             */
            __BUILD_TIME:'20120225231314',

            /**
             * Returns a new object containing all of the properties of
             * all the supplied objects. The properties from later objects
             * will overwrite those in earlier objects. Passing in a
             * single object will create a shallow copy of it.
             * @param {...} m1 objects need to be merged
             * @return {Object} the new merged object
             */
            merge:function (m1) {
                var o = {}, i, l = arguments.length;
                for (i = 0; i < l; i++) {
                    S.mix(o, arguments[i]);
                }
                return o;
            },

            /**
             * Applies prototype properties from the supplier to the receiver.
             * @param   {Object} r received object
             * @param   {...Object} s1 object need to  augment
             *          {boolean} [ov=true] whether overwrite existing property
             *          {String[]} [wl] array of white-list properties
             * @return  {Object} the augmented object
             */
            augment:function (r, s1) {
                var args = S.makeArray(arguments),
                    len = args.length - 2,
                    i = 1,
                    ov = args[len],
                    wl = args[len + 1];

                if (!S.isArray(wl)) {
                    ov = wl;
                    wl = undefined;
                    len++;
                }
                if (!S.isBoolean(ov)) {
                    ov = undefined;
                    len++;
                }

                for (; i < len; i++) {
                    S.mix(r.prototype, args[i].prototype || args[i], ov, wl);
                }

                return r;
            },

            /**
             * Utility to set up the prototype, constructor and superclass properties to
             * support an inheritance strategy that can chain constructors and methods.
             * Static members will not be inherited.
             * @param r {Function} the object to modify
             * @param s {Function} the object to inherit
             * @param px {Object} prototype properties to add/override
             * @param {Object} [sx] static properties to add/override
             * @return r {Object}
             */
            extend:function (r, s, px, sx) {
                if (!s || !r) {
                    return r;
                }

                var create = Object.create ?
                    function (proto, c) {
                        return Object.create(proto, {
                            constructor:{
                                value:c
                            }
                        });
                    } :
                    function (proto, c) {
                        function F() {
                        }

                        F.prototype = proto;

                        var o = new F();
                        o.constructor = c;
                        return o;
                    },
                    sp = s.prototype,
                    rp;

                // add prototype chain
                rp = create(sp, r);
                r.prototype = S.mix(rp, r.prototype);
                r.superclass = create(sp, s);

                // add prototype overrides
                if (px) {
                    S.mix(rp, px);
                }

                // add object overrides
                if (sx) {
                    S.mix(r, sx);
                }

                return r;
            },

            /****************************************************************************************

             *                            The KISSY System Framework                                *

             ****************************************************************************************/


            /**
             * Returns the namespace specified and creates it if it doesn't exist. Be careful
             * when naming packages. Reserved words may work in some browsers and not others.
             * <code>
             * S.namespace('KISSY.app'); // returns KISSY.app
             * S.namespace('app.Shop'); // returns KISSY.app.Shop
             * S.namespace('TB.app.Shop', true); // returns TB.app.Shop
             * </code>
             * @return {Object}  A reference to the last namespace object created
             */
            namespace:function () {
                var args = S.makeArray(arguments),
                    l = args.length,
                    o = null, i, j, p,
                    global = (args[l - 1] === true && l--);

                for (i = 0; i < l; i++) {
                    p = (EMPTY + args[i]).split('.');
                    o = global ? host : this;
                    for (j = (host[p[0]] === o) ? 1 : 0; j < p.length; ++j) {
                        o = o[p[j]] = o[p[j]] || { };
                    }
                }
                return o;
            },

            /**
             * create app based on KISSY.
             * @param name {String} the app name
             * @param sx {Object} static properties to add/override
             * <code>
             * S.app('TB');
             * TB.namespace('app'); // returns TB.app
             * </code>
             * @return {Object}  A reference to the app global object
             */
            app:function (name, sx) {
                var isStr = S.isString(name),
                    O = isStr ? host[name] || {} : name,
                    i = 0,
                    __APP_INIT_METHODS=S.__APP_INIT_METHODS,
                    len = __APP_INIT_METHODS.length;

                S.mix(O, this, true, S.__APP_MEMBERS);
                for (; i < len; i++) {
                    __APP_INIT_METHODS[i].call(O);
                }

                S.mix(O, S.isFunction(sx) ? sx() : sx);
                isStr && (host[name] = O);

                return O;
            },

            /**
             * set KISSY config
             * @param c
             * @param {Object[]} c.packages
             * @param {Array[]} c.map
             */
            config:function (c) {
                var configs, cfg, r;
                for (var p in c) {
                    if (c.hasOwnProperty(p)) {
                        // some filter
                        if ((configs = this['configs']) && (cfg = configs[p])) {
                            r = cfg(c[p]);
                        } else {
                            // or set directly
                            S.Config[p] = c[p];
                        }
                    }
                }
                return r;
            },

            /**
             * Prints debug info.
             * @param msg {String} the message to log.
             * @param {String} [cat] the log category for the message. Default
             *        categories are "info", "warn", "error", "time" etc.
             * @param {String} [src] the source of the the message (opt)
             */
            log:function (msg, cat, src) {
                if (S.Config.debug) {
                    if (src) {
                        msg = src + ': ' + msg;
                    }
                    if (host['console'] !== undefined && console.log) {
                        console[cat && console[cat] ? cat : 'log'](msg);
                    }
                }
            },

            /**
             * Throws error message.
             */
            error:function (msg) {
                if (S.Config.debug) {
                    throw msg;
                }
            },

            /*
             * Generate a global unique id.
             * @param {String} [pre] guid prefix
             * @return {String} the guid
             */
            guid:function (pre) {
                return (pre || EMPTY) + guid++;
            }
        });

    /**
     * Initializes
     */
    function init() {
        var self = this,
            c;

        c = self.Config = self.Config || {};
        self.Env = self.Env || {};

        // NOTICE: '@DEBUG@' will replace with '' when compressing.
        // So, if loading source file, debug is on by default.
        // If loading min version, debug is turned off automatically.
        c.debug = '@DEBUG@';
    }

    init.call(S);
    return S;

})('KISSY', undefined);
/**
 * @fileOverview   lang
 * @author  lifesinger@gmail.com,yiminghe@gmail.com
 * @description this code can run in any ecmascript compliant environment
 */
(function (S, undefined) {

    var TRUE = true,
        FALSE = false,
        OP = Object.prototype,
        toString = OP.toString,
        hasOwnProperty = OP.hasOwnProperty,
        AP = Array.prototype,
        indexOf = AP.indexOf,
        lastIndexOf = AP.lastIndexOf,
        filter = AP.filter,
        every = AP.every,
        some = AP.some,
        //reduce = AP.reduce,
        trim = String.prototype.trim,
        map = AP.map,
        EMPTY = '',
        HEX_BASE = 16,
        CLONE_MARKER = '__~ks_cloned',
        COMPARE_MARKER = '__~ks_compared',
        STAMP_MARKER = '__~ks_stamped',
        RE_TRIM = /^[\s\xa0]+|[\s\xa0]+$/g,
        encode = encodeURIComponent,
        decode = decodeURIComponent,
        SEP = '&',
        EQ = '=',
        // [[Class]] -> type pairs
        class2type = {},
        // http://www.owasp.org/index.php/XSS_(Cross_Site_Scripting)_Prevention_Cheat_Sheet
        htmlEntities = {
            '&amp;':'&',
            '&gt;':'>',
            '&lt;':'<',
            '&#x60;':'`',
            '&#x2F;':'/',
            '&quot;':'"',
            '&#x27;':"'"
        },
        reverseEntities = {},
        escapeReg,
        unEscapeReg,
        // - # $ ^ * ( ) + [ ] { } | \ , . ?
        escapeRegExp = /[\-#$\^*()+\[\]{}|\\,.?\s]/g;
    (function () {
        for (var k in htmlEntities) {
            if (htmlEntities.hasOwnProperty(k)) {
                reverseEntities[htmlEntities[k]] = k;
            }
        }
    })();

    function getEscapeReg() {
        if (escapeReg) {
            return escapeReg
        }
        var str = EMPTY;
        S.each(htmlEntities, function (entity) {
            str += entity + '|';
        });
        str = str.slice(0, -1);
        return escapeReg = new RegExp(str, "g");
    }

    function getUnEscapeReg() {
        if (unEscapeReg) {
            return unEscapeReg
        }
        var str = EMPTY;
        S.each(reverseEntities, function (entity) {
            str += entity + '|';
        });
        str += '&#(\\d{1,5});';
        return unEscapeReg = new RegExp(str, "g");
    }


    function isValidParamValue(val) {
        var t = typeof val;
        // If the type of val is null, undefined, number, string, boolean, return true.
        return val == null || (t !== 'object' && t !== 'function');
    }

    S.mix(S,
        /**
         * @lends KISSY
         */
        {

            /**
             * stamp a object by guid
             * @param {Object} o object needed to be stamped
             * @param {boolean} [readOnly] while set marker on o if marker does not exist
             * @param {String} [marker] the marker will be set on Object
             * @return guid associated with this object
             */
            stamp:function (o, readOnly, marker) {
                if (!o) {
                    return o
                }
                marker = marker || STAMP_MARKER;
                var guid = o[marker];
                if (guid) {
                    return guid;
                } else if (!readOnly) {
                    try {
                        guid = o[marker] = S.guid(marker);
                    }
                    catch (e) {
                        guid = undefined;
                    }
                }
                return guid;
            },

            /**
             * empty function
             */
            noop:function () {
            },

            /**
             * Determine the internal JavaScript [[Class]] of an object.
             */
            type:function (o) {
                return o == null ?
                    String(o) :
                    class2type[toString.call(o)] || 'object';
            },

            /**
             * whether o === null
             * @param o
             */
            isNull:function (o) {
                return o === null;
            },

            /**
             * whether o === undefined
             * @param o
             */
            isUndefined:function (o) {
                return o === undefined;
            },

            /**
             * Checks to see if an object is empty.
             */
            isEmptyObject:function (o) {
                for (var p in o) {
                    if (p !== undefined) {
                        return FALSE;
                    }
                }
                return TRUE;
            },

            /**
             * Checks to see if an object is a plain object (created using "{}"
             * or "new Object()" or "new FunctionClass()").
             */
            isPlainObject:function (o) {
                /**
                 * note by yiminghe
                 * isPlainObject(node=document.getElementById("xx")) -> false
                 * toString.call(node) : ie678 == '[object Object]',other =='[object HTMLElement]'
                 * 'isPrototypeOf' in node : ie678 === false ,other === true
                 * refer http://lifesinger.org/blog/2010/12/thinking-of-isplainobject/
                 */
                return o && toString.call(o) === '[object Object]' && 'isPrototypeOf' in o;
            },


            /**
             * 两个目标是否内容相同
             * @param a 比较目标1
             * @param b 比较目标2
             * @returns {boolean} a.equals(b)
             */
            equals:function (a, b, /*internal use*/mismatchKeys, /*internal use*/mismatchValues) {
                // inspired by jasmine
                mismatchKeys = mismatchKeys || [];
                mismatchValues = mismatchValues || [];

                if (a === b) {
                    return TRUE;
                }
                if (a === undefined || a === null || b === undefined || b === null) {
                    // need type coercion
                    return a == null && b == null;
                }
                if (a instanceof Date && b instanceof Date) {
                    return a.getTime() == b.getTime();
                }
                if (S.isString(a) && S.isString(b)) {
                    return (a == b);
                }
                if (S.isNumber(a) && S.isNumber(b)) {
                    return (a == b);
                }
                if (typeof a === "object" && typeof b === "object") {
                    return compareObjects(a, b, mismatchKeys, mismatchValues);
                }
                // Straight check
                return (a === b);
            },

            /**
             * Creates a deep copy of a plain object or array. Others are returned untouched.
             * @param input
             * @param {Function} [filter] filter function
             * @returns the new cloned object
             * @see http://www.w3.org/TR/html5/common-dom-interfaces.html#safe-passing-of-structured-data
             */
            clone:function (input, filter) {
                // 稍微改改就和规范一样了 :)
                // Let memory be an association list of pairs of objects,
                // initially empty. This is used to handle duplicate references.
                // In each pair of objects, one is called the source object
                // and the other the destination object.
                var memory = {},
                    ret = cloneInternal(input, filter, memory);
                S.each(memory, function (v) {
                    // 清理在源对象上做的标记
                    v = v.input;
                    if (v[CLONE_MARKER]) {
                        try {
                            delete v[CLONE_MARKER];
                        } catch (e) {
                            S.log("delete CLONE_MARKER error : ");
                            v[CLONE_MARKER] = undefined;
                        }
                    }
                });
                memory = null;
                return ret;
            },

            /**
             * Removes the whitespace from the beginning and end of a string.
             * @function
             */
            trim:trim ?
                function (str) {
                    return str == null ? EMPTY : trim.call(str);
                } :
                function (str) {
                    return str == null ? EMPTY : str.toString().replace(RE_TRIM, EMPTY);
                },

            /**
             * Substitutes keywords in a string using an object/array.
             * Removes undefined keywords and ignores escaped keywords.
             * @param {String} str template string
             * @param {Object} o json data
             * @param {RegExp} regexp to match a piece of template string
             */
            substitute:function (str, o, regexp) {
                if (!S.isString(str)
                    || !S.isPlainObject(o)) {
                    return str;
                }

                return str.replace(regexp || /\\?\{([^{}]+)\}/g, function (match, name) {
                    if (match.charAt(0) === '\\') {
                        return match.slice(1);
                    }
                    return (o[name] === undefined) ? EMPTY : o[name];
                });
            },

            /**
             * Executes the supplied function on each item in the array.
             * @param object {Object} the object to iterate
             * @param fn {Function} the function to execute on each item. The function
             *        receives three arguments: the value, the index, the full array.
             * @param {Object} [context]
             */
            each:function (object, fn, context) {
                if (object) {
                    var key,
                        val,
                        i = 0,
                        length = object && object.length,
                        isObj = length === undefined || S.type(object) === 'function';

                    context = context || null;

                    if (isObj) {
                        for (key in object) {
                            // can not use hasOwnProperty
                            if (fn.call(context, object[key], key, object) === FALSE) {
                                break;
                            }
                        }
                    } else {
                        for (val = object[0];
                             i < length && fn.call(context, val, i, object) !== FALSE; val = object[++i]) {
                        }
                    }
                }
                return object;
            },

            /**
             * Search for a specified value within an array.
             * @param item individual item to be searched
             * @function
             * @param {Array} arr the array of items where item will be search
             * @returns {number} item's index in array
             */
            indexOf:indexOf ?
                function (item, arr) {
                    return indexOf.call(arr, item);
                } :
                function (item, arr) {
                    for (var i = 0, len = arr.length; i < len; ++i) {
                        if (arr[i] === item) {
                            return i;
                        }
                    }
                    return -1;
                },

            /**
             * Returns the index of the last item in the array
             * that contains the specified value, -1 if the
             * value isn't found.
             * @function
             * @param item individual item to be searched
             * @param {Array} arr the array of items where item will be search
             * @returns {number} item's last index in array
             */
            lastIndexOf:(lastIndexOf) ?
                function (item, arr) {
                    return lastIndexOf.call(arr, item);
                } :
                function (item, arr) {
                    for (var i = arr.length - 1; i >= 0; i--) {
                        if (arr[i] === item) {
                            break;
                        }
                    }
                    return i;
                },

            /**
             * Returns a copy of the array with the duplicate entries removed
             * @param a {Array} the array to find the subset of unique for
             * @param [override] {Boolean}
             *        if override is true, S.unique([a, b, a]) => [b, a]
             *        if override is false, S.unique([a, b, a]) => [a, b]
             * @return {Array} a copy of the array with duplicate entries removed
             */
            unique:function (a, override) {
                var b = a.slice();
                if (override) {
                    b.reverse();
                }
                var i = 0,
                    n,
                    item;

                while (i < b.length) {
                    item = b[i];
                    while ((n = S.lastIndexOf(item, b)) !== i) {
                        b.splice(n, 1);
                    }
                    i += 1;
                }

                if (override) {
                    b.reverse();
                }
                return b;
            },

            /**
             * Search for a specified value index within an array.
             * @param item individual item to be searched
             * @param {Array} arr the array of items where item will be search
             * @returns {boolean} the item exists in arr
             */
            inArray:function (item, arr) {
                return S.indexOf(item, arr) > -1;
            },

            /**
             * Executes the supplied function on each item in the array.
             * Returns a new array containing the items that the supplied
             * function returned true for.
             * @function
             * @param arr {Array} the array to iterate
             * @param fn {Function} the function to execute on each item
             * @param [context] {Object} optional context object
             * @return {Array} The items on which the supplied function
             *         returned true. If no items matched an empty array is
             *         returned.
             */
            filter:filter ?
                function (arr, fn, context) {
                    return filter.call(arr, fn, context || this);
                } :
                function (arr, fn, context) {
                    var ret = [];
                    S.each(arr, function (item, i, arr) {
                        if (fn.call(context || this, item, i, arr)) {
                            ret.push(item);
                        }
                    });
                    return ret;
                },


            /**
             * Executes the supplied function on each item in the array.
             * Returns a new array containing the items that the supplied
             * function returned for.
             * @function
             * @param arr {Array} the array to iterate
             * @param fn {Function} the function to execute on each item
             * @param [context] {Object} optional context object
             * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/map
             * @return {Array} The items on which the supplied function
             *         returned
             */
            map:map ?
                function (arr, fn, context) {
                    return map.call(arr, fn, context || this);
                } :
                function (arr, fn, context) {
                    var len = arr.length,
                        res = new Array(len);
                    for (var i = 0; i < len; i++) {
                        var el = S.isString(arr) ? arr.charAt(i) : arr[i];
                        if (el
                            ||
                            //ie<9 in invalid when typeof arr == string
                            i in arr) {
                            res[i] = fn.call(context || this, el, i, arr);
                        }
                    }
                    return res;
                },


            /**
             * Executes the supplied function on each item in the array.
             * Returns a value which is accumulation of the value that the supplied
             * function returned.
             *
             * @param arr {Array} the array to iterate
             * @param callback {Function} the function to execute on each item
             * @param initialValue {number} optional context object
             * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/reduce
             * @return {Array} The items on which the supplied function returned
             */
            reduce:/*
             NaN ?
             reduce ? function(arr, callback, initialValue) {
             return arr.reduce(callback, initialValue);
             } : */function (arr, callback, initialValue) {
                var len = arr.length;
                if (typeof callback !== "function") {
                    throw new TypeError("callback is not function!");
                }

                // no value to return if no initial value and an empty array
                if (len === 0 && arguments.length == 2) {
                    throw new TypeError("arguments invalid");
                }

                var k = 0;
                var accumulator;
                if (arguments.length >= 3) {
                    accumulator = arguments[2];
                }
                else {
                    do {
                        if (k in arr) {
                            accumulator = arr[k++];
                            break;
                        }

                        // if array contains no values, no initial value to return
                        k += 1;
                        if (k >= len) {
                            throw new TypeError();
                        }
                    }
                    while (TRUE);
                }

                while (k < len) {
                    if (k in arr) {
                        accumulator = callback.call(undefined, accumulator, arr[k], k, arr);
                    }
                    k++;
                }

                return accumulator;
            },

            /**
             * Tests whether all elements in the array pass the test implemented by the provided function.
             * @function
             * @param arr {Array} the array to iterate
             * @param callback {Function} the function to execute on each item
             * @param [context] {Object} optional context object
             * @returns {boolean} whether all elements in the array pass the test implemented by the provided function.
             */
            every:every ?
                function (arr, fn, context) {
                    return every.call(arr, fn, context || this);
                } :
                function (arr, fn, context) {
                    var len = arr && arr.length || 0;
                    for (var i = 0; i < len; i++) {
                        if (i in arr && !fn.call(context, arr[i], i, arr)) {
                            return FALSE;
                        }
                    }
                    return TRUE;
                },

            /**
             * Tests whether some element in the array passes the test implemented by the provided function.
             * @function
             * @param arr {Array} the array to iterate
             * @param callback {Function} the function to execute on each item
             * @param [context] {Object} optional context object
             * @returns {boolean} whether some element in the array passes the test implemented by the provided function.
             */
            some:some ?
                function (arr, fn, context) {
                    return some.call(arr, fn, context || this);
                } :
                function (arr, fn, context) {
                    var len = arr && arr.length || 0;
                    for (var i = 0; i < len; i++) {
                        if (i in arr && fn.call(context, arr[i], i, arr)) {
                            return TRUE;
                        }
                    }
                    return FALSE;
                },


            /**
             * Creates a new function that, when called, itself calls this function in the context of the provided this value,
             * with a given sequence of arguments preceding any provided when the new function was called.
             * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
             * @param {Function} fn internal called function
             * @param {Object} obj context in which fn runs
             * @param {...} arg1 extra arguments
             * @returns {Function} new function with context and arguments
             */
            bind:function (fn, obj, arg1) {
                var slice = [].slice,
                    args = slice.call(arguments, 2),
                    fNOP = function () {
                    },
                    bound = function () {
                        return fn.apply(this instanceof fNOP ? this : obj,
                            args.concat(slice.call(arguments)));
                    };
                fNOP.prototype = fn.prototype;
                bound.prototype = new fNOP();
                return bound;
            },

            /**
             * Gets current date in milliseconds.
             * @function
             * @see  https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/now
             * http://j-query.blogspot.com/2011/02/timing-ecmascript-5-datenow-function.html
             * http://kangax.github.com/es5-compat-table/
             */
            now:Date.now || function () {
                return +new Date();
            },
            /**
             * frequently used in taobao cookie about nick
             */
            fromUnicode:function (str) {
                return str.replace(/\\u([a-f\d]{4})/ig, function (m, u) {
                    return  String.fromCharCode(parseInt(u, HEX_BASE));
                });
            },
            /**
             * get escaped string from html
             * @see   http://yiminghe.javaeye.com/blog/788929
             *        http://wonko.com/post/html-escaping
             * @param str {string} text2html show
             */
            escapeHTML:function (str) {
                return str.replace(getEscapeReg(), function (m) {
                    return reverseEntities[m];
                });
            },

            /**
             * get escaped regexp string for construct regexp
             * @param str
             */
            escapeRegExp:function (str) {
                return str.replace(escapeRegExp, '\\$&');
            },

            /**
             * un-escape html to string
             * @param str {string} html2text
             */
            unEscapeHTML:function (str) {
                return str.replace(getUnEscapeReg(), function (m, n) {
                    return htmlEntities[m] || String.fromCharCode(+n);
                });
            },
            /**
             * Converts object to a true array.
             * @param o {object|Array} array like object or array
             * @return {Array} native Array
             */
            makeArray:function (o) {
                if (o == null) {
                    return [];
                }
                if (S.isArray(o)) {
                    return o;
                }

                // The strings and functions also have 'length'
                if (typeof o.length !== 'number'
                    // element
                    || o.nodeName
                    // window
                    || o.alert
                    || S.isString(o) || S.isFunction(o)) {
                    return [o];
                }
                var ret = [];
                for (var i = 0, l = o.length; i < l; i++) {
                    ret[i] = o[i];
                }
                return ret;
            },
            /**
             * Creates a serialized string of an array or object.
             * @example
             * <code>
             * {foo: 1, bar: 2}    // -> 'foo=1&bar=2'
             * {foo: 1, bar: [2, 3]}    // -> 'foo=1&bar=2&bar=3'
             * {foo: '', bar: 2}    // -> 'foo=&bar=2'
             * {foo: undefined, bar: 2}    // -> 'foo=undefined&bar=2'
             * {foo: true, bar: 2}    // -> 'foo=true&bar=2'
             * </code>
             * @param {Object} o json data
             * @param {String} [sep='&'] separator between each pair of data
             * @param {String} [eq='='] separator between key and value of data
             * @param {boolean} [arr=true] whether add '[]' to array key of data
             * @return {String}
             */
            param:function (o, sep, eq, arr) {
                if (!S.isPlainObject(o)) {
                    return EMPTY;
                }
                sep = sep || SEP;
                eq = eq || EQ;
                if (S.isUndefined(arr)) {
                    arr = TRUE;
                }
                var buf = [], key, val;
                for (key in o) {
                    if (o.hasOwnProperty(key)) {
                        val = o[key];
                        key = encode(key);

                        // val is valid non-array value
                        if (isValidParamValue(val)) {
                            buf.push(key, eq, encode(val + EMPTY), sep);
                        }
                        // val is not empty array
                        else if (S.isArray(val) && val.length) {
                            for (var i = 0, len = val.length; i < len; ++i) {
                                if (isValidParamValue(val[i])) {
                                    buf.push(key,
                                        (arr ? encode("[]") : EMPTY),
                                        eq, encode(val[i] + EMPTY), sep);
                                }
                            }
                        }
                        // ignore other cases, including empty array, Function, RegExp, Date etc.
                    }
                }
                buf.pop();
                return buf.join(EMPTY);
            },

            /**
             * Parses a URI-like query string and returns an object composed of parameter/value pairs.
             * @example
             * <code>
             * 'section=blog&id=45'        // -> {section: 'blog', id: '45'}
             * 'section=blog&tag=js&tag=doc' // -> {section: 'blog', tag: ['js', 'doc']}
             * 'tag=ruby%20on%20rails'        // -> {tag: 'ruby on rails'}
             * 'id=45&raw'        // -> {id: '45', raw: ''}
             * </code>
             * @param {String} str param string
             * @param {String} [sep='&'] separator between each pair of data
             * @param {String} [eq='='] separator between key and value of data
             * @returns {Object} json data
             */
            unparam:function (str, sep, eq) {
                if (!S.isString(str) || !(str = S.trim(str))) {
                    return {};
                }
                sep = sep || SEP;
                eq = eq || EQ;
                var ret = {},
                    pairs = str.split(sep),
                    pair, key, val,
                    i = 0, len = pairs.length;

                for (; i < len; ++i) {
                    pair = pairs[i].split(eq);
                    key = decode(pair[0]);
                    try {
                        val = decode(pair[1] || EMPTY);
                    } catch (e) {
                        S.log(e + "decodeURIComponent error : " + pair[1], "error");
                        val = pair[1] || EMPTY;
                    }
                    if (S.endsWith(key, "[]")) {
                        key = key.substring(0, key.length - 2);
                    }
                    if (hasOwnProperty.call(ret, key)) {
                        if (S.isArray(ret[key])) {
                            ret[key].push(val);
                        } else {
                            ret[key] = [ret[key], val];
                        }
                    } else {
                        ret[key] = val;
                    }
                }
                return ret;
            },
            /**
             * Executes the supplied function in the context of the supplied
             * object 'when' milliseconds later. Executes the function a
             * single time unless periodic is set to true.
             * @param fn {Function|String} the function to execute or the name of the method in
             *        the 'o' object to execute.
             * @param when {Number} the number of milliseconds to wait until the fn is executed.
             * @param {Boolean} [periodic] if true, executes continuously at supplied interval
             *        until canceled.
             * @param {Object} [context] the context object.
             * @param [data] that is provided to the function. This accepts either a single
             *        item or an array. If an array is provided, the function is executed with
             *        one parameter for each array item. If you need to pass a single array
             *        parameter, it needs to be wrapped in an array [myarray].
             * @return {Object} a timer object. Call the cancel() method on this object to stop
             *         the timer.
             */
            later:function (fn, when, periodic, context, data) {
                when = when || 0;
                var m = fn,
                    d = S.makeArray(data),
                    f,
                    r;

                if (S.isString(fn)) {
                    m = context[fn];
                }

                if (!m) {
                    S.error('method undefined');
                }

                f = function () {
                    m.apply(context, d);
                };

                r = (periodic) ? setInterval(f, when) : setTimeout(f, when);

                return {
                    id:r,
                    interval:periodic,
                    cancel:function () {
                        if (this.interval) {
                            clearInterval(r);
                        } else {
                            clearTimeout(r);
                        }
                    }
                };
            },

            /**
             * test whether a string start with a specified substring
             * @param {String} str the whole string
             * @param {String} prefix a specified substring
             * @returns {boolean} whether str start with prefix
             */
            startsWith:function (str, prefix) {
                return str.lastIndexOf(prefix, 0) === 0;
            },

            /**
             * test whether a string end with a specified substring
             * @param {String} str the whole string
             * @param {String} suffix a specified substring
             * @returns {boolean} whether str end with suffix
             */
            endsWith:function (str, suffix) {
                var ind = str.length - suffix.length;
                return ind >= 0 && str.indexOf(suffix, ind) == ind;
            },

            /**
             * Throttles a call to a method based on the time between calls.
             * @param {function} fn The function call to throttle.
             * @param {object} [context] context fn to run
             * @param {Number} [ms] The number of milliseconds to throttle the method call.
             *              Passing a -1 will disable the throttle. Defaults to 150.
             * @return {function} Returns a wrapped function that calls fn throttled.
             */
            throttle:function (fn, ms, context) {
                ms = ms || 150;

                if (ms === -1) {
                    return (function () {
                        fn.apply(context || this, arguments);
                    });
                }

                var last = S.now();

                return (function () {
                    var now = S.now();
                    if (now - last > ms) {
                        last = now;
                        fn.apply(context || this, arguments);
                    }
                });
            },

            /**
             * buffers a call between a fixed time
             * @param {function} fn
             * @param {object} [context]
             * @param {Number} ms
             * @return {function} Returns a wrapped function that calls fn buffered.
             */
            buffer:function (fn, ms, context) {
                ms = ms || 150;

                if (ms === -1) {
                    return (function () {
                        fn.apply(context || this, arguments);
                    });
                }
                var bufferTimer = null;

                function f() {
                    f.stop();
                    bufferTimer = S.later(fn, ms, FALSE, context || this, arguments);
                }

                f.stop = function () {
                    if (bufferTimer) {
                        bufferTimer.cancel();
                        bufferTimer = 0;
                    }
                };

                return f;
            }

        });

    // for idea ..... auto-hint
    S.mix(S,
        /**
         * @lends KISSY
         */
        {
            /**
             * test whether o is boolean
             * @function
             * @param  o
             * @returns {boolean}
             */
            isBoolean:isValidParamValue,
            /**
             * test whether o is number
             * @function
             * @param  o
             * @returns {boolean}
             */
            isNumber:isValidParamValue,
            /**
             * test whether o is String
             * @function
             * @param  o
             * @returns {boolean}
             */
            isString:isValidParamValue,
            /**
             * test whether o is function
             * @function
             * @param  o
             * @returns {boolean}
             */
            isFunction:isValidParamValue,
            /**
             * test whether o is Array
             * @function
             * @param  o
             * @returns {boolean}
             */
            isArray:isValidParamValue,
            /**
             * test whether o is Date
             * @function
             * @param  o
             * @returns {boolean}
             */
            isDate:isValidParamValue,
            /**
             * test whether o is RegExp
             * @function
             * @param  o
             * @returns {boolean}
             */
            isRegExp:isValidParamValue,
            /**
             * test whether o is Object
             * @function
             * @param  o
             * @returns {boolean}
             */
            isObject:isValidParamValue
        });

    S.each('Boolean Number String Function Array Date RegExp Object'.split(' '),
        function (name, lc) {
            // populate the class2type map
            class2type['[object ' + name + ']'] = (lc = name.toLowerCase());

            // add isBoolean/isNumber/...
            S['is' + name] = function (o) {
                return S.type(o) == lc;
            }
        });

    function cloneInternal(input, f, memory) {
        var destination = input,
            isArray,
            isPlainObject,
            k,
            stamp;
        if (!input) {
            return destination;
        }

        // If input is the source object of a pair of objects in memory,
        // then return the destination object in that pair of objects .
        // and abort these steps.
        if (input[CLONE_MARKER]) {
            // 对应的克隆后对象
            return memory[input[CLONE_MARKER]].destination;
        } else if (typeof input === "object") {
            // 引用类型要先记录
            var constructor = input.constructor;
            if (S.inArray(constructor, [Boolean, String, Number, Date, RegExp])) {
                destination = new constructor(input.valueOf());
            }
            // ImageData , File, Blob , FileList .. etc
            else if (isArray = S.isArray(input)) {
                destination = f ? S.filter(input, f) : input.concat();
            } else if (isPlainObject = S.isPlainObject(input)) {
                destination = {};
            }
            // Add a mapping from input (the source object)
            // to output (the destination object) to memory.
            // 做标记
            input[CLONE_MARKER] = (stamp = S.guid());
            // 存储源对象以及克隆后的对象
            memory[stamp] = {destination:destination, input:input};
        }
        // If input is an Array object or an Object object,
        // then, for each enumerable property in input,
        // add a new property to output having the same name,
        // and having a value created from invoking the internal structured cloning algorithm recursively
        // with the value of the property as the "input" argument and memory as the "memory" argument.
        // The order of the properties in the input and output objects must be the same.

        // clone it
        if (isArray) {
            for (var i = 0; i < destination.length; i++) {
                destination[i] = cloneInternal(destination[i], f, memory);
            }
        } else if (isPlainObject) {
            for (k in input) {
                if (input.hasOwnProperty(k)) {
                    if (k !== CLONE_MARKER &&
                        (!f || (f.call(input, input[k], k, input) !== FALSE))) {
                        destination[k] = cloneInternal(input[k], f, memory);
                    }
                }
            }
        }

        return destination;
    }

    function compareObjects(a, b, mismatchKeys, mismatchValues) {
        // 两个比较过了，无需再比较，防止循环比较
        if (a[COMPARE_MARKER] === b && b[COMPARE_MARKER] === a) {
            return TRUE;
        }
        a[COMPARE_MARKER] = b;
        b[COMPARE_MARKER] = a;
        var hasKey = function (obj, keyName) {
            return (obj !== null && obj !== undefined) && obj[keyName] !== undefined;
        };
        for (var property in b) {
            if (b.hasOwnProperty(property)) {
                if (!hasKey(a, property) && hasKey(b, property)) {
                    mismatchKeys.push("expected has key '" + property + "', but missing from actual.");
                }
            }
        }
        for (property in a) {
            if (a.hasOwnProperty(property)) {
                if (!hasKey(b, property) && hasKey(a, property)) {
                    mismatchKeys.push("expected missing key '" + property + "', but present in actual.");
                }
            }
        }
        for (property in b) {
            if (b.hasOwnProperty(property)) {
                if (property == COMPARE_MARKER) {
                    continue;
                }
                if (!S.equals(a[property], b[property], mismatchKeys, mismatchValues)) {
                    mismatchValues.push("'" + property + "' was '" + (b[property] ? (b[property].toString()) : b[property])
                        + "' in expected, but was '" +
                        (a[property] ? (a[property].toString()) : a[property]) + "' in actual.");
                }
            }
        }
        if (S.isArray(a) && S.isArray(b) && a.length != b.length) {
            mismatchValues.push("arrays were not the same length");
        }
        delete a[COMPARE_MARKER];
        delete b[COMPARE_MARKER];
        return (mismatchKeys.length === 0 && mismatchValues.length === 0);
    }

})(KISSY, undefined);
/**
 * implement Promise specification by KISSY
 * @author yiminghe@gmail.com
 * @description thanks to https://github.com/kriskowal/q
 */
(function (KISSY, undefined) {
    var S = KISSY;

    function nextTick(fn) {
        // for debug
        // fn();
        // make parallel call in production
        setTimeout(fn, 0);
    }

    /**
     * @class
     * @description Defer constructor
     * @memberOf KISSY
     */
    function Defer(promise) {
        var self = this;
        if (!(self instanceof Defer)) {
            return new Defer(promise);
        }
        // http://en.wikipedia.org/wiki/Object-capability_model
        // principal of least authority
        /**
         * @description defer object's promise
         * @type KISSY.Promise
         * @memberOf KISSY.Defer#
         * @name promise
         */
        self.promise = promise || new Promise();
    }

    Defer.prototype =
    /**
     * @lends KISSY.Defer.prototype
     */
    {
        constructor:Defer,
        /**
         * fulfill defer object's promise
         * note: can only be called once
         * @param value defer object's value
         * @returns defer object's promise
         */
        resolve:function (value) {
            var promise = this.promise,
                pendings;
            if (!(pendings = promise._pendings)) {
                return undefined;
            }
            // set current promise's resolved value
            // maybe a promise or instant value
            promise._value = value;
            pendings = [].concat(pendings);
            promise._pendings = undefined;
            for (var i = 0; i < pendings.length; i++) {
                (function (p) {
                    nextTick(function () {
                        promise._when(p[0], p[1]);
                    });
                })(pendings[i]);
            }
            return value;
        },
        /**
         * reject defer object's promise
         * @param reason
         * @returns defer object's promise
         */
        reject:function (reason) {
            return this.resolve(new Reject(reason));
        }
    };

    function isPromise(obj) {
        return  obj && obj instanceof Promise;
    }

    /**
     * Promise constructor.
     * This class should not be instantiated manually.
     * Instances will be created and returned as needed by {@link KISSY.Defer#promise}
     * @constructor
     * @namespace
     * @param v promise's resolved value
     * @memberOf KISSY
     */
    function Promise(v) {
        var self = this;
        // maybe internal value is also a promise
        self._value = v;
        if (!arguments.length) {
            self._pendings = [];
        }
    }

    Promise.prototype =
    /**
     * @lends KISSY.Promise.prototype
     */
    {
        constructor:Promise,
        /**
         * two effects:
         * 1. call fulfilled with immediate value
         * 2. push fulfilled in right promise
         * @private
         * @param fulfilled
         * @param rejected
         */
        _when:function (fulfilled, rejected) {
            var promise = this,
                v = promise._value,
                pendings = promise._pendings;
            // unresolved
            // pushed to pending list
            if (pendings) {
                pendings.push([fulfilled, rejected]);
            }
            // rejected or nested promise
            else if (isPromise(v)) {
                nextTick(function () {
                    v._when(fulfilled, rejected);
                });
            } else {
                // fulfilled value
                // normal value represents ok
                // need return user's return value
                // if return promise then forward
                return fulfilled && fulfilled(v);
            }
            return undefined;
        },
        /**
         * register callbacks when this promise object is resolved
         * @param {Function(*)} fulfilled called when resolved successfully,pass a resolved value to this function and
         *                      return a value (could be promise object) for the new promise's resolved value.
         * @param {Function(*)} [rejected] called when error occurs,pass error reason to this function and
         *                      return a new reason for the new promise's error reason
         * @returns {KISSY.Promise} a new promise object
         */
        then:function (fulfilled, rejected) {
            return when(this, fulfilled, rejected);
        },
        /**
         * call rejected callback when this promise object is rejected
         * @param {Function(*)} rejected called with rejected reason
         * @returns {KISSY.Promise} a new promise object
         */
        fail:function (rejected) {
            return when(this, 0, rejected);
        },
        /**
         * call callback when this promise object is rejected or resolved
         * @param {Function(*,Boolean)} callback the second parameter is
         * true when resolved and false when rejected
         * @@returns {KISSY.Promise} a new promise object
         */
        fin:function (callback) {
            return when(this, function (value) {
                return callback(value, true);
            }, function (reason) {
                return callback(reason, false);
            });
        },
        /**
         * whether the given object is a resolved promise
         * if it is resolved with another promise,
         * then that promise needs to be resolved as well.
         */
        isResolved:function () {
            return isResolved(this);
        },
        /**
         * whether the given object is a rejected promise
         */
        isRejected:function () {
            return isRejected(this);
        }
    };

    function Reject(reason) {
        if (reason instanceof Reject) {
            return reason;
        }
        Promise.apply(this, arguments);
        if (this._value instanceof Promise) {
            S.error('assert.not(this._value instanceof promise) in Reject constructor');
        }
        return undefined;
    }

    S.extend(Reject, Promise, {
        // override,simply call rejected
        _when:function (fulfilled, rejected) {
            // if there is a rejected , should always has! see when()
            if (!rejected) {
                S.error("no rejected callback!");
            }
            return rejected ? rejected(this._value) : new Reject(this._value);
        }
    });

    function resolve(value) {
        if (value instanceof Promise) {
            return value;
        }
        return new Promise(value);
    }

    /**
     * wrap for promise._when
     * @param value
     * @param fulfilled
     * @param [rejected]
     */
    function when(value, fulfilled, rejected) {
        var defer = new Defer(),
            done = 0;

        // wrap user's callback to catch exception
        function _fulfilled(value) {
            try {
                return fulfilled ? fulfilled(value) : value;
            } catch (e) {
                return new Reject(e);
            }
        }

        function _rejected(reason) {
            try {
                return rejected ? rejected(reason) : new Reject(reason);
            } catch (e) {
                return new Reject(e);
            }
        }

        nextTick(function () {
            resolve(value)._when(function (value) {
                if (done) {
                    S.error("already done at fulfilled");
                    return;
                }
                if (value instanceof Promise) {
                    S.error("assert.not(value instanceof Promise) in when")
                }
                done = 1;
                defer.resolve(
                    // may return another promise
                    resolve(value)._when(_fulfilled, _rejected)
                );
            }, function (reason) {
                if (done) {
                    S.error("already done at rejected");
                    return;
                }
                done = 1;
                // _reject may return non-Reject object for error recovery
                defer.resolve(_rejected(reason));
            });
        });

        // chained and leveled
        // wait for value's resolve
        return defer.promise;
    }

    function isResolved(obj) {
        // exclude Reject at first
        return !isRejected(obj) &&
            isPromise(obj) &&
            (obj._pendings === undefined) &&
            (
                // immediate value
                !isPromise(obj._value) ||
                    // resolved with a resolved promise !!! :)
                    // Reject._value is string
                    isResolved(obj._value)
                );
    }

    function isRejected(obj) {
        return isPromise(obj) &&
            (obj._pendings === undefined) &&
            (obj._value instanceof Reject);
    }

    KISSY.Defer = Defer;
    KISSY.Promise = Promise;

    S.mix(Promise,
        /**
         * @lends KISSY.Promise
         */
        {
            /**
             * register callbacks when obj as a promise is resolved
             * or call fulfilled callback directly when obj is not a promise object
             * @param {KISSY.Promise|*} obj a promise object or value of any type
             * @param {Function(*)} fulfilled called when obj resolved successfully,pass a resolved value to this function and
             *                      return a value (could be promise object) for the new promise's resolved value.
             * @param {Function(*)} [rejected] called when error occurs in obj,pass error reason to this function and
             *                      return a new reason for the new promise's error reason
             * @returns {KISSY.Promise} a new promise object
             * @example
             * <code>
             * function check(p){
             *   S.Promise.when(p,function(v){
             *     alert(v===1);
             *   });
             * }
             *
             * var defer=S.Defer();
             * defer.resolve(1);
             *
             * check(1); // => alert(true)
             *
             * check(defer.promise); //=> alert(true);
             * </code>
             * @function
             */
            when:when,
            /**
             * whether the given object is a promise
             * @function
             * @param obj the tested object
             */
            isPromise:isPromise,
            /**
             * whether the given object is a resolved promise
             * @function
             * @param obj the tested object
             */
            isResolved:isResolved,
            /**
             * whether the given object is a rejected promise
             * @function
             * @param obj the tested object
             */
            isRejected:isRejected,
            /**
             * return a new promise
             * which is resolved when all promises is resolved
             * and rejected when any one of promises is rejected
             * @param {KISSY.Promise[]} promises list of promises
             */
            all:function (promises) {
                return when([].concat(promises), function (promises) {
                    var count = promises.length;
                    if (!count) {
                        return promises;
                    }
                    var defer = Defer();
                    for (var i = 0; i < promises.length; i++) {
                        (function (promise, i) {
                            when(promise, function (value) {
                                promises[i] = value;
                                if (--count === 0) {
                                    // if all is resolved
                                    // then resolve final returned promise with all value
                                    defer.resolve(promises);
                                }
                            }, function (r) {
                                // if any one is rejected
                                // then reject final return promise with first reason
                                defer.reject(r);
                            });
                        })(promises[i], i);
                    }
                    return defer.promise;
                });
            }
        });

})(KISSY);

/**
 * refer:
 *  - http://wiki.commonjs.org/wiki/Promises
 *  - http://en.wikipedia.org/wiki/Futures_and_promises#Read-only_views
 *  - http://en.wikipedia.org/wiki/Object-capability_model
 *  - https://github.com/kriskowal/q
 *  - http://www.sitepen.com/blog/2010/05/03/robust-promises-with-dojo-deferred-1-5/
 *  - http://dojotoolkit.org/documentation/tutorials/1.6/deferreds/
 **//**
 * @fileOverview setup data structure for kissy loader
 * @author yiminghe@gmail.com,lifesinger@gmail.com
 */
(function (S) {
    if (typeof require !== 'undefined') {
        return;
    }

    function Loader(SS) {
        this.SS = SS;
    }

    S.Loader = Loader;

    // 脚本(loadQueue)/模块(mod) 公用状态
    Loader.STATUS = {
        "INIT":0,
        "LOADING":1,
        "LOADED":2,
        "ERROR":3,
        // 模块特有
        "ATTACHED":4
    };
})(KISSY);/**
 * @fileOverview utils for kissy loader
 * @author yiminghe@gmail.com
 */
(function (S) {
    if (typeof require !== 'undefined') {
        return;
    }
    var ua = navigator.userAgent,
        data = S.Loader.STATUS,
        utils = {},
        mix = S.mix,
        doc = document,
        // 当前页面所在的目录
        // http://xx.com/y/z.htm#!/f/g
        // ->
        // http://xx.com/y/
        __pagePath = location.href.replace(location.hash, "").replace(/[^/]*$/i, "");

    S.mix(utils, {

        docHead:function () {
            return doc.getElementsByTagName('head')[0] || doc.documentElement;
        },

        isWebKit:!!ua.match(/AppleWebKit/),

        IE:!!ua.match(/MSIE/),

        isCss:function (url) {
            return /\.css(?:\?|$)/i.test(url);
        },

        isLinkNode:function (n) {
            return n.nodeName.toLowerCase() == 'link';
        },

        /**
         * resolve relative part of path
         * x/../y/z -> y/z
         * x/./y/z -> x/y/z
         * @param path uri path
         * @return {string} resolved path
         * @description similar to path.normalize in nodejs
         */
        normalizePath:function (path) {
            var paths = path.split("/"),
                re = [],
                p;
            for (var i = 0; i < paths.length; i++) {
                p = paths[i];
                if (p == ".") {
                } else if (p == "..") {
                    re.pop();
                } else {
                    re.push(p);
                }
            }
            return re.join("/");
        },

        /**
         * 根据当前模块以及依赖模块的相对路径，得到依赖模块的绝对路径
         * @param moduleName 当前模块
         * @param depName 依赖模块
         * @return {string|Array} 依赖模块的绝对路径
         * @description similar to path.resolve in nodejs
         */
        normalDepModuleName:function normalDepModuleName(moduleName, depName) {
            if (!depName) {
                return depName;
            }
            if (S.isArray(depName)) {
                for (var i = 0; i < depName.length; i++) {
                    depName[i] = normalDepModuleName(moduleName, depName[i]);
                }
                return depName;
            }
            if (startsWith(depName, "../") || startsWith(depName, "./")) {
                var anchor = "", index;
                // x/y/z -> x/y/
                if ((index = moduleName.lastIndexOf("/")) != -1) {
                    anchor = moduleName.substring(0, index + 1);
                }
                return normalizePath(anchor + depName);
            } else if (depName.indexOf("./") != -1
                || depName.indexOf("../") != -1) {
                return normalizePath(depName);
            } else {
                return depName;
            }
        },

        //去除后缀名，要考虑时间戳!
        removePostfix:function (path) {
            return path.replace(/(-min)?\.js[^/]*$/i, "");
        },

        /**
         * 路径正则化，不能是相对地址
         * 相对地址则转换成相对页面的绝对地址
         * 用途:
         * package path 相对地址则相对于当前页面获取绝对地址
         */
        normalBasePath:function (path) {
            path = S.trim(path);

            // path 为空时，不能变成 "/"
            if (path && path.charAt(path.length - 1) != '/') {
                path += "/";
            }

            /**
             * 一定要正则化，防止出现 ../ 等相对路径
             * 考虑本地路径
             */
            if (!path.match(/^(http(s)?)|(file):/i)
                && !startsWith(path, "/")) {
                path = __pagePath + path;
            }
            return normalizePath(path);
        },

        /**
         * 相对路径文件名转换为绝对路径
         * @param path
         */
        absoluteFilePath:function (path) {
            path = utils.normalBasePath(path);
            return path.substring(0, path.length - 1);
        },

        //http://wiki.commonjs.org/wiki/Packages/Mappings/A
        //如果模块名以 / 结尾，自动加 index
        indexMapping:function (names) {
            for (var i = 0; i < names.length; i++) {
                if (names[i].match(/\/$/)) {
                    names[i] += "index";
                }
            }
            return names;
        },

        getPackagePath:function (self, mod) {
            //缓存包路径，未申明的包的模块都到核心模块中找
            if (mod.packagePath) {
                return mod.packagePath;
            }

            var //一个模块合并到了另一个模块文件中去
                modName = mod.name,
                packages = self.Config.packages || {},
                pName = "",
                p_def;

            for (var p in packages) {
                if (packages.hasOwnProperty(p)) {
                    if (S.startsWith(modName, p) &&
                        p.length > pName) {
                        pName = p;
                    }
                }
            }

            p_def = packages[pName];

            mod.charset = p_def && p_def.charset || mod.charset;

            if (p_def) {
                mod.tag = p_def.tag;
            } else {
                // kissy 自身组件的事件戳后缀
                mod.tag = encodeURIComponent(self.Config.tag || S.__BUILD_TIME);
            }

            return mod.packagePath = (p_def && p_def.path) || self.Config.base;
        },

        generateModulePath:function (self, modName) {
            var mods = self.Env.mods,
                mod = mods[modName];

            if (mod && mod.path && mod.charset) {
                return;
            }

            // 默认 js/css 名字
            // 不指定 .js 默认为 js
            // 指定为 css 载入 .css
            var componentJsName = self.Config['componentJsName'] ||
                function (m) {
                    var suffix = "js", match;
                    if (match = m.match(/(.+)\.(js|css)$/i)) {
                        suffix = match[2];
                        m = match[1];
                    }
                    return m + (S.Config.debug ? '' : '-min') + "." + suffix;
                },
                path = componentJsName(modName);

            // 用户配置的 path优先
            mod = S.mix({
                path:path,
                charset:'utf-8'
            }, mods[modName]);

            //添加模块定义
            mods[modName] = mod;

            mod.name = modName;
        },

        isAttached:function (self, modNames) {
            return isStatus(self, modNames, data.ATTACHED);
        },

        isLoaded:function (self, modNames) {
            return isStatus(self, modNames, data.LOADED);
        },

        getModules:function (self, modNames) {
            var mods = [self];

            S.each(modNames, function (modName) {
                if (!utils.isCss(modName)) {
                    mods.push(self.require(modName));
                }
            });

            return mods;
        },

        attachMod:function (self, mod) {
            if (mod.status == data.ATTACHED) {
                return;
            }

            var fn = mod.fn, value;

            if (fn) {
                if (S.isFunction(fn)) {
                    // context is mod info
                    value = fn.apply(mod, utils.getModules(self, mod.requires));
                } else {
                    value = fn;
                }
                mod.value = value;
            }

            mod.status = data.ATTACHED;
        },

        normalizeModNamesInUse:function (modNames) {
            if (S.isString(modNames)) {
                modNames = modNames.replace(/\s+/g, "").split(',');
            }
            utils.indexMapping(modNames);
            return modNames;
        },


        //注册模块，将模块和定义 factory 关联起来
        registerModule:function (self, name, def, config) {
            config = config || {};

            var mods = self.Env.mods,
                mod = mods[name] || {};

            // 注意：通过 S.add(name[, fn[, config]]) 注册的代码，无论是页面中的代码，
            // 还是 js 文件里的代码，add 执行时，都意味着该模块已经 LOADED
            S.mix(mod, { name:name, status:data.LOADED });

            if (mod.fn) {
                S.log(name + " is defined more than once");
                return;
            }

            mod.fn = def;

            S.mix((mods[name] = mod), config);
        },

        normAdd:function (self, name, def, config) {
            var mods = self.Env.mods,
                o;

            // S.add(name, config) => S.add( { name: config } )
            if (S.isString(name)
                && !config
                && S.isPlainObject(def)) {
                o = {};
                o[name] = def;
                name = o;
            }

            // S.add( { name: config } )
            if (S.isPlainObject(name)) {
                mix(mods, name, 1, 0, 1);
                return true;
            }
        },

        getMappedPath:function (self, path) {
            var __mappedRules = self.Config.mappedRules || [];
            for (var i = 0; i < __mappedRules.length; i++) {
                var m, rule = __mappedRules[i];
                if (m = path.match(rule[0])) {
                    return path.replace(rule[0], rule[1]);
                }
            }
            return path;
        }

    });

    function isStatus(self, modNames, status) {
        var mods = self.Env.mods,
            ret = true;
        modNames = S.makeArray(modNames);
        S.each(modNames, function (name) {
            var mod = mods[name];
            if (!mod || mod.status !== status) {
                ret = false;
                return ret;
            }
        });
        return ret;
    }

    var startsWith = S.startsWith,
        normalizePath = utils.normalizePath;

    S.Loader.Utils = utils;

})(KISSY);/**
 * @fileOverview script/css load across browser
 * @author  yiminghe@gmail.com
 */
(function (S) {
    if (typeof require !== 'undefined') {
        return;
    }
    var CSS_POLL_INTERVAL = 30,
        utils = S.Loader.Utils,
        /**
         * central poll for link node
         */
            timer = 0,

        monitors = {
            /**
             * node.id:[callback]
             */
        };

    function startCssTimer() {
        if (!timer) {
            S.log("start css polling");
            cssPoll();
        }
    }

    // single thread is ok
    function cssPoll() {
        for (var url in monitors) {
            var callbacks = monitors[url],
                node = callbacks.node,
                loaded = 0;
            if (utils.isWebKit) {
                if (node['sheet']) {
                    S.log("webkit loaded : " + url);
                    loaded = 1;
                }
            } else if (node['sheet']) {
                try {
                    var cssRules;
                    if (cssRules = node['sheet'].cssRules) {
                        S.log('firefox  ' + cssRules + ' loaded : ' + url);
                        loaded = 1;
                    }
                } catch (ex) {
                    // S.log('firefox  ' + ex.name + ' ' + ex.code + ' ' + url);
                    // if (ex.name === 'NS_ERROR_DOM_SECURITY_ERR') {
                    if (ex.code === 1000) {
                        S.log('firefox  ' + ex.name + ' loaded : ' + url);
                        loaded = 1;
                    }
                }
            }

            if (loaded) {
                for (var i = 0; i < callbacks.length; i++) {
                    callbacks[i].call(node);
                }
                delete monitors[url];
            }
        }
        if (S.isEmptyObject(monitors)) {
            timer = 0;
            S.log("end css polling");
        } else {
            timer = setTimeout(cssPoll, CSS_POLL_INTERVAL);
        }
    }

    S.mix(utils, {
        scriptOnload:document.addEventListener ?
            function (node, callback) {
                if (utils.isLinkNode(node)) {
                    return utils.styleOnload(node, callback);
                }
                node.addEventListener('load', callback, false);
            } :
            function (node, callback) {
                if (utils.isLinkNode(node)) {
                    return utils.styleOnload(node, callback);
                }
                var oldCallback = node.onreadystatechange;
                node.onreadystatechange = function () {
                    var rs = node.readyState;
                    if (/loaded|complete/i.test(rs)) {
                        node.onreadystatechange = null;
                        oldCallback && oldCallback();
                        callback.call(this);
                    }
                };
            },

        /**
         * monitor css onload across browsers
         * 暂时不考虑如何判断失败，如 404 等
         * @see <pre>
         *  - firefox 不可行（结论4错误）：
         *    - http://yearofmoo.com/2011/03/cross-browser-stylesheet-preloading/
         *  - 全浏览器兼容
         *    - http://lifesinger.org/lab/2011/load-js-css/css-preload.html
         *  - 其他
         *    - http://www.zachleat.com/web/load-css-dynamically/
         *  </pre>
         */
        styleOnload:window.attachEvent ?
            // ie/opera
            function (node, callback) {
                // whether to detach using function wrapper?
                function t() {
                    node.detachEvent('onload', t);
                    S.log('ie/opera loaded : ' + node.href);
                    callback.call(node);
                }

                node.attachEvent('onload', t);
            } :
            // refer : http://lifesinger.org/lab/2011/load-js-css/css-preload.html
            // 暂时不考虑如何判断失败，如 404 等
            function (node, callback) {
                var href = node.href, arr;
                arr = monitors[href] = monitors[href] || [];
                arr.node = node;
                arr.push(callback);
                startCssTimer();
            }
    });
})(KISSY);/**
 * @fileOverview getScript support for css and js callback after load
 * @author  lifesinger@gmail.com,yiminghe@gmail.com
 */
(function (S, utils) {
    if (typeof require !== 'undefined') {
        return;
    }
    var MILLISECONDS_OF_SECOND = 1000,
        scriptOnload = utils.scriptOnload;

    S.mix(S, {

        /**
         * load  a css file from server using http get ,after css file load ,execute success callback
         * @param url css file url
         * @param success callback
         * @param charset
         * @private
         */
        getStyle:function (url, success, charset) {
            var doc = document,
                head = utils.docHead(),
                node = doc.createElement('link'),
                config = success;

            if (S.isPlainObject(config)) {
                success = config.success;
                charset = config.charset;
            }

            node.href = url;
            node.rel = 'stylesheet';

            if (charset) {
                node.charset = charset;
            }

            if (success) {
                utils.scriptOnload(node, success);
            }
            head.appendChild(node);
            return node;

        },
        /**
         * Load a JavaScript/Css file from the server using a GET HTTP request, then execute it.
         * @example
         * <code>
         *  getScript(url, success, charset);
         *  or
         *  getScript(url, {
         *      charset: string
         *      success: fn,
         *      error: fn,
         *      timeout: number
         *  });
         * </code>
         * @param {String} url resource's url
         * @param {Function|Object} [success] success callback or config
         * @param {Function} [success.success] success callback
         * @param {Function} [success.error] error callback
         * @param {Number} [success.timeout] timeout (s)
         * @param {String} [success.charset] charset of current resource
         * @param {String} [charset] charset of current resource
         * @returns {HTMLElement} script/style node
         * @memberOf KISSY
         */
        getScript:function (url, success, charset) {
            if (utils.isCss(url)) {
                return S.getStyle(url, success, charset);
            }
            var doc = document,
                head = doc.head || doc.getElementsByTagName("head")[0],
                node = doc.createElement('script'),
                config = success,
                error,
                timeout,
                timer;

            if (S.isPlainObject(config)) {
                success = config.success;
                error = config.error;
                timeout = config.timeout;
                charset = config.charset;
            }

            function clearTimer() {
                if (timer) {
                    timer.cancel();
                    timer = undefined;
                }
            }


            node.src = url;
            node.async = true;
            if (charset) {
                node.charset = charset;
            }
            if (success || error) {
                scriptOnload(node, function () {
                    clearTimer();
                    S.isFunction(success) && success.call(node);
                });

                if (S.isFunction(error)) {

                    //标准浏览器
                    if (doc.addEventListener) {
                        node.addEventListener("error", function () {
                            clearTimer();
                            error.call(node);
                        }, false);
                    }

                    timer = S.later(function () {
                        timer = undefined;
                        error();
                    }, (timeout || this.Config.timeout) * MILLISECONDS_OF_SECOND);
                }
            }
            head.insertBefore(node, head.firstChild);
            return node;
        }
    });

})(KISSY, KISSY.Loader.Utils);(function (S) {
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
        S.Config.mappedRules = (S.Config.mappedRules || []).concat(rules);
    };
    /**
     * 包声明
     * biz -> .
     * 表示遇到 biz/x
     * 在当前网页路径找 biz/x.js
     * @private
     */
    S.configs.packages = function (cfgs) {
        var ps = S.Config.packages = S.Config.packages || {};
        S.each(cfgs, function (cfg) {
            ps[cfg.name] = cfg;
            //注意正则化
            cfg.path = cfg.path && utils.normalBasePath(cfg.path);
            cfg.tag = cfg.tag && encodeURIComponent(cfg.tag);
        });
    };

    S.configs.base = function (base) {
        S.Config.base = utils.normalBasePath(base);
    };
})(KISSY);/**
 * simple loader from KISSY<=1.2
 * @author yiminghe@gmail.com
 */
(function (S, undefined) {

    if (typeof require !== 'undefined') {
        return;
    }

    var Loader = S.Loader,
        utils = Loader.Utils;


    S.augment(Loader, {

        //firefox,ie9,chrome 如果add没有模块名，模块定义先暂存这里
        __currentModule:null,

        //ie6,7,8开始载入脚本的时间
        __startLoadTime:0,

        //ie6,7,8开始载入脚本对应的模块名
        __startLoadModuleName:null,

        /**
         * Registers a module.
         * @param {String|Object} [name] module name
         * @param {Function|Object} [def] entry point into the module that is used to bind module to KISSY
         * @param {Object} [config] special config for this add
         * @param {String[]} [config.requires] array of mod's name that current module requires
         * @example
         * <code>
         * KISSY.add('module-name', function(S){ }, {requires: ['mod1']});

         * KISSY.add({
         *     'mod-name': {
         *         fullpath: 'url',
         *         requires: ['mod1','mod2']
         *     }
         * });
         * </code>
         */
        add:function (name, def, config) {
            var self = this,
                SS = self.SS,
                mod,
                requires,
                mods = SS.Env.mods,
                o;

            if (utils.normAdd(SS, name, def, config)) {
                return;
            }

            // S.add(name[, fn[, config]])
            if (S.isString(name)) {

                utils.registerModule(SS, name, def, config);

                //显示指定 add 不 attach
                if (config && config['attach'] === false) {
                    return;
                }

                // 和 1.1.7 以前版本保持兼容，不得已而为之
                mod = mods[name];

                requires = utils.normalDepModuleName(name, mod.requires);

                if (utils.isAttached(SS, requires)) {
                    utils.attachMod(SS, mod);
                }
                return;
            }
            // S.add(fn,config);
            else if (S.isFunction(name)) {
                config = def;
                def = name;
                if (utils.IE) {
                    /*
                     Kris Zyp
                     2010年10月21日, 上午11时34分
                     We actually had some discussions off-list, as it turns out the required
                     technique is a little different than described in this thread. Briefly,
                     to identify anonymous modules from scripts:
                     * In non-IE browsers, the onload event is sufficient, it always fires
                     immediately after the script is executed.
                     * In IE, if the script is in the cache, it actually executes *during*
                     the DOM insertion of the script tag, so you can keep track of which
                     script is being requested in case define() is called during the DOM
                     insertion.
                     * In IE, if the script is not in the cache, when define() is called you
                     can iterate through the script tags and the currently executing one will
                     have a script.readyState == "interactive"
                     See RequireJS source code if you need more hints.
                     Anyway, the bottom line from a spec perspective is that it is
                     implemented, it works, and it is possible. Hope that helps.
                     Kris
                     */
                    // http://groups.google.com/group/commonjs/browse_thread/thread/5a3358ece35e688e/43145ceccfb1dc02#43145ceccfb1dc02
                    // use onload to get module name is not right in ie
                    name = self.__findModuleNameByInteractive();
                    S.log("old_ie get modname by interactive : " + name);
                    utils.registerModule(SS, name, def, config);
                    self.__startLoadModuleName = null;
                    self.__startLoadTime = 0;
                } else {
                    // 其他浏览器 onload 时，关联模块名与模块定义
                    self.__currentModule = {
                        def:def,
                        config:config
                    };
                }
                return undefined;
            }
            S.log("invalid format for KISSY.add !", "error");
            return undefined;
        },


        //ie 特有，找到当前正在交互的脚本，根据脚本名确定模块名
        // 如果找不到，返回发送前那个脚本
        __findModuleNameByInteractive:function () {
            var self = this,
                SS = self.SS,
                base,
                scripts = document.getElementsByTagName("script"),
                re,
                script;

            for (var i = 0; i < scripts.length; i++) {
                script = scripts[i];
                if (script.readyState == "interactive") {
                    re = script;
                    break;
                }
            }
            if (!re) {
                // sometimes when read module file from cache , interactive status is not triggered
                // module code is executed right after inserting into dom
                // i has to preserve module name before insert module script into dom , then get it back here
                S.log("can not find interactive script,time diff : " + (+new Date() - self.__startLoadTime), "error");
                S.log("old_ie get modname from cache : " + self.__startLoadModuleName);
                return self.__startLoadModuleName;
                //S.error("找不到 interactive 状态的 script");
            }

            // src 必定是绝对路径
            // or re.hasAttribute ? re.src :  re.getAttribute('src', 4);
            // http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx
            var src = utils.absoluteFilePath(re.src);
            // 注意：模块名不包含后缀名以及参数，所以去除
            // 系统模块去除系统路径
            // 需要 base norm , 防止 base 被指定为相对路径
            // configs 统一处理
            // SS.Config.base = SS.normalBasePath(self.Config.base);
            if (src.lastIndexOf(base = SS.Config.base, 0) === 0) {
                return utils.removePostfix(src.substring(base.length));
            }
            var packages = SS.Config.packages;
            //外部模块去除包路径，得到模块名
            for (var p in packages) {
                if (packages.hasOwnProperty(p)) {
                    var p_path = packages[p].path;
                    if (packages.hasOwnProperty(p) &&
                        src.lastIndexOf(p_path, 0) === 0) {
                        return utils.removePostfix(src.substring(p_path.length));
                    }
                }
            }
            S.log("interactive script does not have package config ：" + src, "error");
        }
    });

})(KISSY);

/**
 * 2012-02-21 yiminghe@gmail.com refactor:
 *
 * 拆分 ComboLoader 与 Loader
 *
 * 2011-01-04 chengyu<yiminghe@gmail.com> refactor:
 *
 * adopt requirejs :
 *
 * 1. packages(cfg) , cfg :{
 *    name : 包名，用于指定业务模块前缀
 *    path: 前缀包名对应的路径
 *    charset: 该包下所有文件的编码
 *
 * 2. add(moduleName,function(S,depModule){return function(){}},{requires:["depModuleName"]});
 *    moduleName add 时可以不写
 *    depModuleName 可以写相对地址 (./ , ../)，相对于 moduleName
 *
 * 3. S.use(["dom"],function(S,DOM){
 *    });
 *    依赖注入，发生于 add 和 use 时期
 *
 * 4. add,use 不支持 css loader ,getScript 仍然保留支持
 *
 * 5. 部分更新模块文件代码 x/y?t=2011 ，加载过程中注意去除事件戳，仅在载入文件时使用
 *
 * demo : http://lite-ext.googlecode.com/svn/trunk/lite-ext/playground/module_package/index.html
 *
 * 2011-03-01 yiminghe@gmail.com note:
 *
 * compatibility
 *
 * 1. 保持兼容性，不得已而为之
 *      支持 { host : }
 *      如果 requires 都已经 attached，支持 add 后立即 attach
 *      支持 { attach : false } 显示控制 add 时是否 attach
 *      支持 { global : Editor } 指明模块来源
 *
 * 2011-05-04 初步拆分文件，tmd 乱了
 */
/**
 * @fileOverview use and attach mod
 * @author  yiminghe@gmail.com,lifesinger@gmail.com
 */
(function (S) {

    if (typeof require !== 'undefined') {
        return;
    }

    var Loader = S.Loader,
        data = Loader.STATUS,
        utils = Loader.Utils,
        INIT = data.INIT,
        IE = utils.IE,
        LOADING = data.LOADING,
        LOADED = data.LOADED,
        ERROR = data.ERROR,
        ATTACHED = data.ATTACHED;

    S.augment(Loader, {
        /**
         * Start load specific mods, and fire callback when these mods and requires are attached.
         * @example
         * <code>
         * S.use('mod-name', callback, config);
         * S.use('mod1,mod2', callback, config);
         * </code>
         * @param {String|String[]} modNames names of mods to be loaded,if string then separated by space
         * @param {Function} callback callback when modNames are all loaded,
         *                   with KISSY as first argument and mod's value as the following argumwnts
         * @param {Object} cfg special config for this use
         */
        use:function (modNames, callback, cfg) {

            modNames = utils.normalizeModNamesInUse(modNames);

            cfg = cfg || {};

            var self = this,
                SS = self.SS,
                fired;

            // 已经全部 attached, 直接执行回调即可
            if (utils.isAttached(SS, modNames)) {
                var mods = utils.getModules(SS, modNames);
                callback && callback.apply(SS, mods);
                return;
            }

            // 有尚未 attached 的模块
            S.each(modNames, function (modName) {
                // 从 name 开始调用，防止不存在模块
                self.__attachModByName(modName, function () {
                    if (!fired &&
                        utils.isAttached(SS, modNames)) {
                        fired = true;
                        var mods = utils.getModules(SS, modNames);
                        callback && callback.apply(SS, mods);
                    }
                }, cfg);
            });

            return self;
        },
        __buildPath:function (mod, base) {
            var self = this,
                SS = self.SS,
                Config = SS.Config;

            base = base || Config.base;

            build("fullpath", "path");

            if (mod["cssfullpath"] !== data.LOADED) {
                build("cssfullpath", "csspath");
            }

            function build(fullpath, path) {
                var flag = "__" + fullpath + "Ready",
                    t,
                    p = mod[fullpath],
                    sp = mod[path];
                if (mod[flag]) {
                    return;
                }
                if (!p && sp) {
                    //如果是 ./ 或 ../ 则相对当前模块路径
                    sp = mod[path] = utils.normalDepModuleName(mod.name, sp);
                    p = base + sp;
                }
                // debug 模式下，加载非 min 版
                if (p) {
                    mod[fullpath] = utils.getMappedPath(SS, p +
                        ((t = mod.tag) ? ("?t=" + t) : ""));
                    mod[flag] = 1;
                }
            }
        },

        // 加载指定模块名模块，如果不存在定义默认定义为内部模块
        __attachModByName:function (modName, callback, cfg) {
            var self = this,
                SS = self.SS;
            utils.generateModulePath(SS, modName);
            var mod = SS.Env.mods[modName];
            if (mod && mod.status === ATTACHED) {
                callback();
                return;
            }
            self.__attach(mod, callback, cfg);
        },

        /**
         * Attach a module and all required modules.
         */
        __attach:function (mod, callback, cfg) {
            var self = this,
                SS = self.SS,
                r,
                rMod,
                i,
                attached = 0,
                mods = SS.Env.mods,
                //复制一份当前的依赖项出来，防止 add 后修改！
                requires = (mod['requires'] || []).concat();

            mod['requires'] = requires;

            /**
             * check cyclic dependency between mods
             * @private
             */
            function cyclicCheck() {
                // one mod's all requires mods to run its callback
                var __allRequires = mod.__allRequires = mod.__allRequires || {},
                    myName = mod.name,
                    r, r2, rmod,
                    r__allRequires,
                    requires = mod.requires;

                for (var i = 0; i < requires.length; i++) {
                    r = requires[i];
                    rmod = mods[r];
                    __allRequires[r] = 1;
                    if (rmod && (r__allRequires = rmod.__allRequires)) {
                        for (r2 in r__allRequires) {
                            if (r__allRequires.hasOwnProperty(r2)) {
                                __allRequires[r2] = 1;
                            }
                        }
                    }
                }
                if (__allRequires[myName]) {
                    var t = [];
                    for (r in __allRequires) {
                        if (__allRequires.hasOwnProperty(r)) {
                            t.push(r);
                        }
                    }
                    S.error("find cyclic dependency by mod " + myName + " between mods : " + t.join(","));
                }
            }

            if (S.Config.debug) {
                cyclicCheck();
            }

            // attach all required modules
            for (i = 0; i < requires.length; i++) {
                r = requires[i] = utils.normalDepModuleName(mod.name, requires[i]);
                rMod = mods[r];
                if (rMod && rMod.status === ATTACHED) {
                    //no need
                } else {
                    self.__attachModByName(r, fn, cfg);
                }
            }

            // load and attach this module
            self.__buildPath(mod, utils.getPackagePath(SS, mod));

            self.__load(mod, function () {

                // add 可能改了 config，这里重新取下
                mod['requires'] = mod['requires'] || [];

                var newRequires = mod['requires'],
                    needToLoad = [];

                //本模块下载成功后串行下载 require
                for (i = 0; i < newRequires.length; i++) {
                    r = newRequires[i] = utils.normalDepModuleName(mod.name, newRequires[i]);
                    var rMod = mods[r],
                        inA = S.inArray(r, requires);
                    //已经处理过了或将要处理
                    if (rMod &&
                        rMod.status === ATTACHED
                        //已经正在处理了
                        || inA) {
                        //no need
                    } else {
                        //新增的依赖项
                        needToLoad.push(r);
                    }
                }

                if (needToLoad.length) {
                    for (i = 0; i < needToLoad.length; i++) {
                        self.__attachModByName(needToLoad[i], fn, cfg);
                    }
                } else {
                    fn();
                }
            });

            function fn() {
                if (!attached && utils.isAttached(SS, mod['requires'])) {
                    if (mod.status === LOADED) {
                        utils.attachMod(SS, mod);
                    }
                    if (mod.status === ATTACHED) {
                        attached = 1;
                        callback();
                    }
                }
            }
        },

        /**
         * Load a single module.
         */
        __load:function (mod, callback) {

            var self = this,
                SS = self,
                cssfullpath,
                url = mod['fullpath'],
                isCss = utils.isCss(url),
                // 这个是全局的，防止多实例对同一模块的重复下载
                loadQueque = S.Env._loadQueue,
                status = loadQueque[url],
                node = status;

            mod.status = mod.status || INIT;

            // 可能已经由其它模块触发加载
            if (mod.status < LOADING && status) {
                // 该模块是否已经载入到 global ?
                mod.status = status === LOADED ? LOADED : LOADING;
            }

            // 1.20 兼容 1.1x 处理：加载 cssfullpath 配置的 css 文件
            // 仅发出请求，不做任何其它处理
            if (cssfullpath = mod["cssfullpath"]) {
                S.getScript(cssfullpath);
                mod["cssfullpath"] = mod.csspath = LOADED;
            }

            if (mod.status < LOADING && url) {
                mod.status = LOADING;
                if (IE && !isCss) {
                    self.__startLoadModuleName = mod.name;
                    self.__startLoadTime = Number(+new Date());
                }
                node = S.getScript(url, {
                    success:function () {
                        if (isCss) {
                        } else {
                            //载入 css 不需要这步了
                            //标准浏览器下：外部脚本执行后立即触发该脚本的 load 事件,ie9 还是不行
                            if (self.__currentModule) {
                                S.log("standard browser get modname after load : " + mod.name);
                                utils.registerModule(SS,
                                    mod.name, self.__currentModule.def,
                                    self.__currentModule.config);
                                self.__currentModule = null;
                            }
                            if (mod.fn) {
                            } else {
                                _modError();
                            }
                        }
                        if (mod.status != ERROR) {
                            S.log(mod.name + ' is loaded.', 'info');
                        }
                        _scriptOnComplete();
                    },
                    error:function () {
                        _modError();
                        _scriptOnComplete();
                    },
                    charset:mod.charset
                });

                loadQueque[url] = node;
            }
            // 已经在加载中，需要添加回调到 script onload 中
            // 注意：没有考虑 error 情形
            else if (mod.status === LOADING) {
                utils.scriptOnload(node, function () {
                    // 模块载入后，如果需要也要混入对应 global 上模块定义
                    _scriptOnComplete();
                });
            }
            // 是内嵌代码，或者已经 loaded
            else {
                // 也要混入对应 global 上模块定义
                callback();
            }

            function _modError() {
                S.log(mod.name + ' is not loaded! can not find module in path : ' + mod['fullpath'], 'error');
                mod.status = ERROR;
            }

            function _scriptOnComplete() {
                loadQueque[url] = LOADED;

                if (mod.status !== ERROR) {

                    // 注意：当多个模块依赖同一个下载中的模块A下，模块A仅需 attach 一次
                    // 因此要加上下面的 !== 判断，否则会出现重复 attach,
                    // 比如编辑器里动态加载时，被依赖的模块会重复
                    if (mod.status !== ATTACHED) {
                        mod.status = LOADED;
                    }

                    callback();
                }
            }
        }
    });
})(KISSY);/**
 * using combo to load module files
 * @author yiminghe@gmail.com
 */
(function (S, utils) {

    if (typeof require !== 'undefined') {
        return;
    }

    function loadScripts(urls, callback) {
        var count = urls && urls.length;
        if (!count) {
            callback();
            return;
        }
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            S.getScript(url, function () {
                if (!(--count)) {
                    callback();
                }
            });
        }
    }

    var MAX_URL_LENGTH = 1024;

    /**
     * using combo to load module files
     * @class
     * @param SS KISSY
     */
    function ComboLoader(SS) {
        S.mix(this, {
            SS:SS,
            queue:[],
            loading:0
        });
    }

    S.augment(ComboLoader,
        /**
         * @lends ComboLoader#
         */
        {
            next:function () {
                var self = this;
                if (self.queue.length) {
                    var args = self.queue.shift();
                    self._use(args.modNames, args.fn);
                }
            },

            enqueue:function (modNames, fn) {
                var self = this;
                self.queue.push({
                    modNames:modNames,
                    fn:fn
                });
            },

            _use:function (modNames, fn) {
                var self = this;

                self.loading = 1;

                modNames = utils.normalizeModNamesInUse(modNames);

                var allModNames = self.calculate(modNames),
                    comboUrls = self.getComboUrls(allModNames);

                // css first to avoid page blink
                var css = comboUrls.css,
                    countCss = 0;

                for (var p in css) {
                    countCss++;
                }

                if (!countCss) {
                    self._useJs(comboUrls, fn, modNames);
                    return;
                }

                for (p in css) {
                    loadScripts(css[p], function () {
                        if (!(--countCss)) {
                            self._useJs(comboUrls, fn);
                        }
                    });
                }
            },

            use:function (modNames, callback) {
                var self = this,
                    fn = function () {
                        // KISSY.use in callback will be queued
                        if (callback) {
                            callback.apply(this, arguments);
                        }
                        self.loading = 0;
                        self.next();
                    };

                self.enqueue(modNames, fn);

                if (!self.loading) {
                    self.next();
                }
            },

            _useJs:function (comboUrls, fn, modNames) {
                var self = this,
                    jss = comboUrls.js,
                    countJss = 0;

                for (var p in jss) {
                    countJss++;
                }

                if (!countJss) {
                    fn.apply(null, utils.getModules(self.SS, modNames));
                    return;
                }

                for (p in jss) {
                    loadScripts(jss[p], function () {
                        if (!(--countJss)) {
                            self.attachMods(modNames);
                            if (utils.isAttached(self.SS, modNames)) {
                                fn.apply(null, utils.getModules(self.SS, modNames))
                            } else {
                                // new require is introduced by KISSY.add
                                // run again
                                self._use(modNames, fn)
                            }
                        }
                    });
                }
            },

            add:function (name, def, config) {
                var self = this,
                    requires,
                    SS = self.SS;

                if (utils.normAdd(SS, name, def, config)) {
                    return;
                }
                if (config && (requires = config.requires)) {
                    utils.normalDepModuleName(name, requires);
                }
                utils.registerModule(SS, name, def, config);
            },


            attachMods:function (modNames) {
                var self = this;
                S.each(modNames, function (modName) {
                    self.attachMod(modName);
                });
            },

            attachMod:function (modName) {
                var SS = this.SS,
                    mod = this.getModInfo(modName);
                if (
                // new require after add
                // not register yet!
                    !mod ||
                        utils.isAttached(SS, modName)) {
                    return;
                }
                var requires = mod.requires || [];
                for (var i = 0; i < requires.length; i++) {
                    this.attachMod(requires[i]);
                }
                for (i = 0; i < requires.length; i++) {
                    if (!utils.isAttached(SS, requires[i])) {
                        return false;
                    }
                }
                utils.attachMod(SS, mod);
            },

            calculate:function (modNames) {
                var ret = {}, SS = this.SS;
                for (var i = 0; i < modNames.length; i++) {
                    var m = modNames[i];
                    if (!utils.isAttached(SS, m)) {
                        if (!utils.isLoaded(SS, m)) {
                            ret[m] = 1;
                        }
                        S.mix(ret, this.getRequires((m)));
                    }
                }
                var ret2 = [];
                for (var r in ret) {
                    ret2.push(r);
                }
                return ret2;
            },

            getComboUrls:function (modNames) {
                var self = this,
                    i,
                    mod,
                    packagePath,
                    combos = {};

                S.each(modNames, function (modName) {
                    utils.generateModulePath(self.SS, modName);
                    mod = self.getModInfo(modName);
                    packagePath = utils.getPackagePath(self.SS, mod);
                    var type = utils.isCss(mod.path) ? "css" : "js";
                    combos[packagePath] = combos[packagePath] || {};
                    combos[packagePath][type] = combos[packagePath][type] || [];
                    combos[packagePath][type].tag = mod.tag;
                    combos[packagePath][type].push(mod.path);
                });

                var res = {
                    js:{},
                    css:{}
                }, t;

                var comboPrefix = S.Config.comboPrefix,
                    comboSep = S.Config.comboSep,
                    maxUrlLength = S.Config['comboMaxUrlLength'] || MAX_URL_LENGTH;

                for (packagePath in combos) {
                    for (var type in combos[packagePath]) {
                        t = [];
                        var jss = combos[packagePath][type];
                        res[type][packagePath] = [];
                        var prefix = packagePath + comboPrefix,
                            l = prefix.length;
                        for (i = 0; i < jss.length; i++) {
                            t.push(jss[i]);
                            if (l + t.join(comboSep).length > maxUrlLength) {
                                t.pop();
                                res[type][packagePath].push(self.getComboUrl(
                                    t.length > 1 ? prefix : packagePath,
                                    t, comboSep, jss.tag
                                ));
                                t = [];
                                i--;
                            }
                        }
                        if (t.length) {
                            res[type][packagePath].push(self.getComboUrl(
                                t.length > 1 ? prefix : packagePath,
                                t, comboSep, jss.tag
                            ));
                        }
                    }
                }

                return res;
            },

            getComboUrl:function (prefix, t, comboSep, tag) {
                return utils.getMappedPath(
                    this.SS,
                    prefix + t.join(comboSep) + (tag ? ("?t=" + tag) : "")
                );
            },

            getModInfo:function (modName) {
                var SS = this.SS, mods = SS.Env.mods;
                return mods[modName];
            },

            // get requires mods need to be loaded dynamically
            getRequires:function (modName) {
                var self = this,
                    SS = self.SS,
                    mod = self.getModInfo(modName),
                    ret = {};
                // if this mod is attached then its require is attached too!
                if (mod && !utils.isAttached(SS, modName)) {
                    var requires = mod.requires || [],
                        allRequires = mod.__allRequires || (mod.__allRequires = {});
                    for (var i = 0; i < requires.length; i++) {
                        var r = utils.normalDepModuleName(modName, requires[i]);
                        requires[i] = r;
                        if (S.Config.debug && allRequires[r]) {
                            S.error("detect circular dependency among : ");
                            S.error(allRequires);
                        }

                        // if not load into page yet
                        if (!utils.isLoaded(SS, r)
                            // and not attached
                            && !utils.isAttached(SS, r)) {
                            ret[r] = 1;
                        }
                        var ret2 = self.getRequires(r);
                        S.mix(ret, ret2);
                    }
                }
                return ret;
            }
        });

    S.namespace("Loader");
    S.Loader.Combo = ComboLoader;

})(KISSY, KISSY.Loader.Utils);
/**
 * 2012-02-20 yiminghe note:
 *  - three status
 *      0 : initialized
 *      LOADED : load into page
 *      ATTACHED : def executed
 **//**
 *  @fileOverview mix loader into S and infer KISSy baseUrl if not set
 *  @author  lifesinger@gmail.com,yiminghe@gmail.com
 */
(function (S) {

    if (typeof require !== 'undefined') {
        return;
    }

    var Loader = S.Loader,
        utils = Loader.Utils,
        ComboLoader = S.Loader.Combo;

    S.mix(S, {
        add:function (name, def, cfg) {
            var self = this;
            if (self.Config.combine) {
                self.__comboLoader.add(name, def, cfg);
            } else {
                self.__loader.add(name, def, cfg);
            }
        },
        use:function (names, fn) {
            var self = this;
            if (self.Config.combine) {
                self.__comboLoader.use(names, fn);
            } else {
                self.__loader.use(names, fn);
            }
        },
        /**
         * get module's value defined by define function
         * @param {string} moduleName
         * @private
         */
        require:function (moduleName) {
            var self = this,
                mods = self.Env.mods,
                mod = mods[moduleName];
            return mod && mod.value;
        }
    });


    // notice: timestamp
    var baseReg = /^(.*)(seed|kissy)(-aio)?(-min)?\.js[^/]*/i,
        baseTestReg = /(seed|kissy)(-aio)?(-min)?\.js/i;

    /**
     * get base from src
     * @param script script node
     * @return base for kissy
     * @example
     *   http://a.tbcdn.cn/s/kissy/1.1.6/??kissy-min.js,suggest/suggest-pkg-min.js
     *   http://a.tbcdn.cn/??s/kissy/1.1.6/kissy-min.js,s/kissy/1.1.5/suggest/suggest-pkg-min.js
     *   http://a.tbcdn.cn/??s/kissy/1.1.6/suggest/suggest-pkg-min.js,s/kissy/1.1.5/kissy-min.js
     *   http://a.tbcdn.cn/s/kissy/1.1.6/kissy-min.js?t=20101215.js
     * @notice custom combo rules, such as yui3:
     *  <script src="path/to/kissy" data-combo-prefix="combo?" data-combo-sep="&"></script>
     */
    function getBaseUrl(script) {
        var src = utils.absoluteFilePath(script.src),
            prefix = S.Config.comboPrefix = script.getAttribute('data-combo-prefix') || '??',
            sep = S.Config.comboSep = script.getAttribute('data-combo-sep') || ',',
            parts = src.split(sep),
            base,
            part0 = parts[0],
            index = part0.indexOf(prefix);

        // no combo
        if (index == -1) {
            base = src.replace(baseReg, '$1');
        } else {
            base = part0.substring(0, index);
            var part01 = part0.substring(index + 2, part0.length);
            // combo first
            // notice use match better than test
            if (part01.match(baseTestReg)) {
                base += part01.replace(baseReg, '$1');
            }
            // combo after first
            else {
                S.each(parts, function (part) {
                    if (part.match(baseTestReg)) {
                        base += part.replace(baseReg, '$1');
                        return false;
                    }
                });
            }
        }
        return base;
    }

    /**
     * Initializes loader.
     */
    function initLoader() {
        var self = this;
        self.Env.mods = self.Env.mods || {}; // all added mods
        self.__loader = new Loader(self);
        self.__comboLoader = new ComboLoader(self);
    }

    // get base from current script file path
    var scripts = document.getElementsByTagName('script');

    S.config({
        base:getBaseUrl(scripts[scripts.length - 1])
    });

    // the default timeout for getScript
    S.Config.timeout = 10;

    S.Env._loadQueue = {}; // information for loading and loaded mods

    initLoader.call(S);

    // for S.app working properly
    S.__APP_MEMBERS.push("add", "use", "require");

    S.__APP_INIT_METHODS.push(initLoader);

})(KISSY);/**
 * @fileOverview   web.js
 * @author  lifesinger@gmail.com,yiminghe@gmail.com
 * @description this code can only run at browser environment
 */
(function (S, undefined) {

    var win = window,

        doc = win['document'],

        docElem = doc.documentElement,

        EMPTY = '',

        readyDefer = new S.Defer(),

        readyPromise = readyDefer.promise,

        // The number of poll times.
        POLL_RETRYS = 500,

        // The poll interval in milliseconds.
        POLL_INTERVAL = 40,

        // #id or id
        RE_IDSTR = /^#?([\w-]+)$/,

        RE_NOT_WHITE = /\S/;

    S.mix(S,
        /**
         * @lends KISSY
         */
        {


            /**
             * A crude way of determining if an object is a window
             */
            isWindow:function (o) {
                return S.type(o) === 'object'
                    && 'setInterval' in o
                    && 'document' in o
                    && o.document.nodeType == 9;
            },


            /**
             * get xml representation of data
             * @param {String} data
             */
            parseXML:function (data) {
                var xml;
                try {
                    // Standard
                    if (window.DOMParser) {
                        xml = new DOMParser().parseFromString(data, "text/xml");
                    } else { // IE
                        xml = new ActiveXObject("Microsoft.XMLDOM");
                        xml.async = "false";
                        xml.loadXML(data);
                    }
                } catch (e) {
                    S.log("parseXML error : ");
                    S.log(e);
                    xml = undefined;
                }
                if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
                    S.error("Invalid XML: " + data);
                }
                return xml;
            },

            /**
             * Evalulates a script in a global context.
             */
            globalEval:function (data) {
                if (data && RE_NOT_WHITE.test(data)) {
                    // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
                    ( window.execScript || function (data) {
                        window[ "eval" ].call(window, data);
                    } )(data);
                }
            },

            /**
             * Specify a function to execute when the DOM is fully loaded.
             * @param fn {Function} A function to execute after the DOM is ready
             * <code>
             * KISSY.ready(function(S){ });
             * </code>
             * @return {KISSY}
             */
            ready:function (fn) {

                function f() {
                    try {
                        fn(S);
                    } catch (e) {
                        // print stack info for firefox/chrome
                        S.log(e.stack, "error");
                        setTimeout(function () {
                            // lose stack info
                            throw e;
                        }, 0);
                    }
                }

                readyPromise.then(f);

                return this;
            },

            /**
             * Executes the supplied callback when the item with the supplied id is found.
             * @param id <String> The id of the element, or an array of ids to look for.
             * @param fn <Function> What to execute when the element is found.
             */
            available:function (id, fn) {
                id = (id + EMPTY).match(RE_IDSTR)[1];
                if (!id || !S.isFunction(fn)) {
                    return;
                }

                var retryCount = 1,
                    node,
                    timer = S.later(function () {
                        if ((node = doc.getElementById(id)) && (fn(node) || 1) ||
                            ++retryCount > POLL_RETRYS) {
                            timer.cancel();
                        }
                    }, POLL_INTERVAL, true);
            }
        });


    /**
     * Binds ready events.
     */
    function _bindReady() {
        var doScroll = docElem.doScroll,
            eventType = doScroll ? 'onreadystatechange' : 'DOMContentLoaded',
            COMPLETE = 'complete',
            fire = function () {
                readyDefer.resolve(S)
            };

        // Catch cases where ready() is called after the
        // browser event has already occurred.
        if (doc.readyState === COMPLETE) {
            return fire();
        }

        // w3c mode
        if (doc.addEventListener) {
            function domReady() {
                doc.removeEventListener(eventType, domReady, false);
                fire();
            }

            doc.addEventListener(eventType, domReady, false);

            // A fallback to window.onload, that will always work
            win.addEventListener('load', fire, false);
        }
        // IE event model is used
        else {
            function stateChange() {
                if (doc.readyState === COMPLETE) {
                    doc.detachEvent(eventType, stateChange);
                    fire();
                }
            }

            // ensure firing before onload (but completed after all inner iframes is loaded)
            // maybe late but safe also for iframes
            doc.attachEvent(eventType, stateChange);

            // A fallback to window.onload, that will always work.
            win.attachEvent('onload', fire);

            // If IE and not a frame
            // continually check to see if the document is ready
            var notframe;

            try {
                notframe = (win['frameElement'] === null);
            } catch (e) {
                S.log("get frameElement error : ");
                S.log(e);
                notframe = false;
            }

            // can not use in iframe,parent window is dom ready so doScoll is ready too
            if (doScroll && notframe) {
                function readyScroll() {
                    try {
                        // Ref: http://javascript.nwbox.com/IEContentLoaded/
                        doScroll('left');
                        fire();
                    } catch (ex) {
                        //S.log("detect document ready : " + ex);
                        setTimeout(readyScroll, POLL_INTERVAL);
                    }
                }

                readyScroll();
            }
        }
        return 0;
    }

    // If url contains '?ks-debug', debug mode will turn on automatically.
    if (location && (location.search || EMPTY).indexOf('ks-debug') !== -1) {
        S.Config.debug = true;
    }

    /**
     * bind on start
     * in case when you bind but the DOMContentLoaded has triggered
     * then you has to wait onload
     * worst case no callback at all
     */
    _bindReady();

})(KISSY, undefined);
/**
 * module meta info for auto combo
 * @author yiminghe@gmail.com
 */
(function (S) {
    S.add({

        /****************************
         * Core
         ****************************/
        "dom":{
            requires:["ua"]
        },
        "event":{
            requires:["dom"]
        },
        "ajax":{
            requires:["dom", "event"]
        },
        "anim":{
            requires:["dom", "event"]
        },
        "base":{
            requires:["event"]
        },
        "node":{
            requires:["dom", "event", "anim"]
        },

        /******************************
         *  Infrastructure
         ******************************/
        "uibase":{
            requires:['base', 'node']
        },
        "mvc":{
            requires:["base", "ajax"]
        },
        "component":{
            requires:["uibase", "node"]
        },

        /****************************
         *  UI Component
         ****************************/
        "button":{
            requires:["component", "node"]
        },
        "overlay":{
            requires:["component", "node"]
        },
        "resizable":{
            requires:["base", "node"]
        },
        "menu":{
            requires:["component", "node"]
        },
        "menubutton":{
            requires:["menu", "button"]
        },
        "validation":{
            requires:["node", "ajax"]
        },
        "waterfall":{
            requires:["node", "base", "ajax"]
        },
        "tree":{
            requires:["component", "node"]
        },
        "suggest":{
            requires:["dom", "event"]
        },
        "switchable":{
            requires:["dom", "event", "anim","json"]
        },
        "calendar":{
            requires:["node"]
        },
        "datalazyload":{
            requires:["dom", "event"]
        },
        "dd":{
            requires:["node", "base"]
        },
        "flash":{
            requires:["dom", "json"]
        },
        "imagezoom":{
            requires:["node", "uibase"]
        }
    });

})(KISSY);
/**
 * TODO: should be auto generated by module compiler
 **/
