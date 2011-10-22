﻿/*
Copyright 2011, KISSY UI Library v1.20dev
MIT Licensed
build time: Oct 22 18:37
*/
/**
 * mvc base
 * @author yiminghe@gmail.com
 */
KISSY.add("mvc/base", function(S, sync) {
    return {
        sync:sync
    };
}, {
    requires:['./sync']
});/**
 * collection of models
 * @author yiminghe@gmail.com
 */
KISSY.add("mvc/collection", function(S, Event, Model, mvc, Base) {

    function findModelIndex(mods, mod, comparator) {
        var i = mods.length;
        if (comparator) {
            var k = comparator(mod);
            for (i = 0; i < mods.length; i++) {
                var k2 = comparator(mods[i]);
                if (k < k2) {
                    break;
                }
            }
        }
        return i;
    }

    function Collection() {
        Collection.superclass.constructor.apply(this, arguments);
    }

    Collection.ATTRS = {
        model:{
            value:Model
        },
        models:{
            /**
             * normalize model list
             * @param models
             */
            setter:function(models) {
                var prev = this.get("models");
                this.remove(prev, {silent:1});
                this.add(models, {silent:1});
                return this.get("models");
            },
            value:[]
        },
        url:{value:S.noop()},
        comparator:{}
    };

    S.extend(Collection, Base, {
        sort:function() {
            var comparator = this.get("comparator");
            if (comparator) {
                this.get("models").sort(function(a, b) {
                    return comparator(a) - comparator(b);
                });
            }
        },

        toJSON:function() {
            return S.map(this.get("models"), function(m) {
                return m.toJSON();
            });
        },

        pluck:function(attrName) {
            return S.map(this.get("models"), function(m) {
                return m.get(attrName)
            });
        },

        sync:function() {
            mvc.sync.apply(this, arguments);
        },

        parse:function(resp) {
            return resp;
        },

        /**
         *
         * @param model
         * @param opts
         * @return  boolean flag
         *          true:add success
         *          false:validate error
         */
        add:function(model, opts) {
            var self = this,
                ret = true;
            if (S.isArray(model)) {
                S.each(model, function(m) {
                    ret = ret && self._add(m, opts);
                });
            } else {
                ret = self._add(model, opts);
            }
            return ret;
        },

        remove:function(model, opts) {
            var self = this;
            if (S.isArray(model)) {
                S.each(model, function(m) {
                    self._remove(m, opts);
                });
            } else {
                self._remove(model, opts);
            }
        },

        _normModel:function(model) {
            var ret = true;
            if (!(model instanceof Model)) {
                var data = model,
                    modelConstructor = this.get("model");
                model = new modelConstructor();
                ret = model.set(data, {
                    silent:1
                });
            }
            return ret && model;
        },

        load:function(opts) {
            var self = this;
            opts = opts || {};
            var success = opts.success;
            opts.success = function(resp) {
                if (resp) {
                    self.set("models", self.parse(resp), opts);
                }
                success && success.apply(this, arguments);
            };
            self.sync('read', opts);
            return self;
        },

        create:function(model, opts) {
            var self = this;
            opts = opts || {};
            model = this._normModel(model);
            if (model) {
                model.addToCollection(self);
                var success = opts.success;
                opts.success = function() {
                    self.add(model, opts);
                    success && success();
                };
                model.save(opts);
            }
            return model;
        },

        _add:function(model, opts) {
            model = this._normModel(model);
            if (model) {
                opts = opts || {};
                var index = findModelIndex(this.get("models"), model, this.get("comparator"));
                this.get("models").splice(index, 0, model);
                model.addToCollection(this);
                if (!opts['silent']) {
                    this.fire("add", {
                        model:model
                    });
                }
            }
            return model;
        },

        /**
         * not call model.destroy ,maybe model belongs to multiple collections
         * @private
         * @param model
         * @param opts
         */
        _remove:function(model, opts) {
            opts = opts || {};
            var index = S.indexOf(model, this.get("models"));
            if (index != -1) {
                this.get("models").splice(index, 1);
            }
            model.removeFromCollection(this);
            if (!opts['silent']) {
                this.fire("remove", {
                    model:model
                });
            }
        },

        getById:function(id) {
            for (var i = 0; i < this.get("models").length; i++) {
                var model = this.get("models")[i];
                if (model.getId() === id) {
                    return model;
                }
            }
            return null;
        },

        getByCid:function(cid) {
            for (var i = 0; i < this.get("models").length; i++) {
                var model = this.get("models")[i];
                if (model.get("clientId") === cid) {
                    return model;
                }
            }
            return null;
        }

    });

    return Collection;

}, {
    requires:['event','./model','./base','base']
});/**
 * enhanced base for model with sync
 * @author yiminghe@gmail.com
 */
KISSY.add("mvc/model", function(S, Base, mvc) {

    var blacklist = ["idAttribute","clientId","urlRoot","url"];

    function Model() {
        var self = this;
        Model.superclass.constructor.apply(self, arguments);
        /**
         * should bubble to its collections
         */
        self.publish("beforeChange", {
            bubbles:1
        });
        self.publish("afterChange", {
            bubbles:1
        });
        /**
         * @Array mvc/collection collections this model belonged to
         */
        self.collections = {};
    }

    S.extend(Model, Base, {

        addToCollection:function(c) {
            this.collections[S.stamp(c)] = c;
            this.addTarget(c);
        },

        removeFromCollection:function(c) {
            delete this.collections[S.stamp(c)];
            this.removeTarget(c);
        },

        getId:function() {
            return this.get(this.get("idAttribute"));
        },


        /**
         * @override
         */
        __set:function() {
            this.__isModified = 1;
            return Model.superclass.__set.apply(this, arguments);
        },

        /**
         * @overridden
         */
        __fireAttrChange: function(when, name, prevVal, newVal, subAttrName) {
            this.fire(when + "Change", {
                attrName: name,
                subAttrName:subAttrName,
                prevVal: prevVal,
                newVal: newVal
            });
            return  Model.superclass.__fireAttrChange.apply(this, arguments);
        },

        /**
         *  action,opts,callback
         */
        sync:function() {
            mvc.sync.apply(this, arguments);
        },

        /**
         * whether it is newly created
         */
        isNew:function() {
            return !this.getId();
        },

        /**
         * whether has been modified since last save
         */
        isModified:function() {
            return !!(this.isNew() || this.__isModified);
        },

        /**
         * destroy this model
         * @param opts
         */
        destroy:function(opts) {
            var self = this;
            opts = opts || {};
            var success = opts.success;
            opts.success = function(resp) {
                var lists = self.collections;
                if (resp) {
                    self.set(resp, opts);
                }
                for (var l in lists) {
                    lists[l].remove(self, opts);
                    self.removeFromCollection(lists[l]);
                }
                success && success.apply(this, arguments);
            };
            if (opts['delete']) {
                self.sync('delete', opts);
            } else {
                opts.success();
            }

            return self;
        },

        /**
         * call sycn to load
         * @param opts
         */
        load:function(opts) {
            var self = this;
            opts = opts || {};
            var success = opts.success;
            opts.success = function(resp) {
                if (resp) {
                    self.set(self.parse(resp), opts);
                }
                self.__isModified = 0;
                success && success.apply(this, arguments);
            };
            self.sync('read', opts);
            return self;
        },

        /**
         * parse json from server to get attr/value pairs
         * @param resp
         */
        parse:function(resp) {
            return resp;
        },

        save:function(opts) {
            var self = this;
            var success = opts.success;
            opts.success = function(resp) {
                if (resp) {
                    self.set(self.parse(resp), opts);
                }
                self.__isModified = 0;
                success && success.apply(this, arguments);
            };
            self.sync(self.isNew() ? 'create' : 'update', opts);
            return self;
        },

        toJSON:function() {
            var ret = this.getAttrVals();
            S.each(blacklist, function(b) {
                delete ret[b];
            });
            return ret;
        }

    }, {
        ATTRS:{
            idAttribute:{
                value:'id'
            },
            clientId:{
                valueFn:function() {
                    return S.guid("mvc-client");
                }
            },
            url:{
                value:url
            },
            urlRoot:{
                value:""
            }
        }
    });

    function getUrl(o) {
        var u;
        if (o && (u = o.get("url"))) {
            if (S.isString(u)) {
                return u;
            }
            return u.call(o);
        }
        return u;
    }

    function url() {
        var c,
            cv,
            collections = this.collections;
        for (c in collections) {
            if (collections.hasOwnProperty(c)) {
                cv = collections[c];
                break;
            }
        }
        var base = getUrl(cv) || this.get("urlRoot");
        if (this.isNew()) {
            return base;
        }
        base = base + (base.charAt(base.length - 1) == '/' ? '' : '/');
        return base + encodeURIComponent(this.getId()) + "/";
    }


    return Model;

}, {
    requires:['base','./base']
});/**
 * simple hash router to get path parameter and query parameter
 * @author yiminghe@gmail.com
 */
KISSY.add('mvc/router', function(S, Event, Base) {
    var queryReg = /\?(.*)/;
    var escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;
    var grammar = /(:([\w\d]+))|(\*([\w\d]+))/g;
    var hashPrefix = /^#/;
    var loc = location;

    function getQuery(path) {
        var m,
            ret = {};
        if (m = path.match(queryReg)) {
            var queryStr = S.unEscapeHTML(m[1]);
            return S.unparam(queryStr);
        }
        return ret;
    }


    function matchRoute(self, path, routeRegs) {
        var fullPath = path;
        path = fullPath.replace(queryReg, "");
        S.each(routeRegs, function(desc) {
            //debugger
            var reg = desc.reg,
                paramNames = desc.paramNames,
                m,
                name = desc.name,
                callback = desc.callback;
            if (m = path.match(reg)) {
                //debugger
                // match all result item shift out
                m.shift();
                var params = {};
                S.each(m, function(sm, i) {
                    params[paramNames[i]] = sm;
                });
                var query = getQuery(fullPath);
                callback.apply(self, [params,query]);
                self.fire(name, {
                    params:params,
                    query:query
                });
                return false;
            }
        });
    }

    /**
     * transform route declaration to router reg
     * @param str
     *         /search/:q
     *         /user/*
     */
    function transformRouterReg(str, callback) {
        var name = str,
            paramNames = [];
        // escape keyword from regexp
        str = str.replace(escapeRegExp,
            function(m) {
                return "\\" + m;
            }).replace(grammar, function(m, g1, g2, g3, g4) {
                paramNames.push(g2 || g4);
                // :name
                if (g2) {
                    return "([^/]+)";
                }
                // *name
                else if (g4) {
                    return "(.*)";
                }

            });
        return {
            name:name,
            paramNames:paramNames,
            reg:new RegExp("^" + str + "$"),
            callback:callback
        }
    }

    function normFn(self, callback) {
        if (S.isFunction(callback)) {
            return callback;
        } else {
            return self[callback];
        }
    }

    function Router() {
        Router.superclass.constructor.apply(this, arguments);
        this.__routerMap = {};
        this.on("afterRoutesChange", this._afterRoutesChange, this);
        this._afterRoutesChange({
            newVal:this.get("routes")
        });
    }


    Router.ATTRS = {
        /**
         * {
         * path:callback
         * }
         */
        routes:{

        }
    };

    function hashChange() {
        matchRoute(this, loc.hash.replace(hashPrefix, ""), this.__routerMap);
    }


    S.extend(Router, Base, {

        _afterRoutesChange:function(e) {
            this.__routerMap = {};
            this.addRoutes(e.newVal);
        },
        /**
         *
         * @param routes
         *         {
         *           "/search/:param":"callback"
         *         }
         */
        addRoutes:function(routes) {
            var self = this;
            S.each(routes, function(callback, name) {
                self.__routerMap[name] = transformRouterReg(name, normFn(self, callback));
            });
        },

        navigate:function(path) {
            loc.hash = path;
        },

        start:function() {
            Event.on(window, "hashchange", hashChange, this);
        }
    });

    return Router;

}, {
    requires:['event','base']
});/**
 * default sync for model
 * @author yiminghe@gmail.com
 */
KISSY.add("mvc/sync", function(S, io) {
    var methodMap = {
        'create': 'POST',
        'update': 'POST', //'PUT'
        'delete': 'POST', //'DELETE'
        'read'  : 'GET'
    };

    function sync(method, options) {
        var type = methodMap[method],
            ioParam = S.merge({
                type:type,
                dataType:'json'
            }, options);

        var data = ioParam.data = ioParam.data || {};
        data['_method'] = method;

        if (!ioParam.url) {
            ioParam.url = S.isString(this.get("url")) ? this.get("url") : this.get("url").call(this);
        }

        if (method == 'create' || method == 'update') {
            ioParam.contentType = 'application/x-www-form-urlencoded';
            data.model = this.toJSON();
        }

        return io(ioParam);
    }

    return sync;
}, {
    requires:['ajax']
});/**
 * view for kissy mvc : event delegation,container generator
 * @author yiminghe@gmail.com
 */
KISSY.add("mvc/view", function(S, Node, Base) {

    var $ = Node.all;

    function normFn(self, f) {
        if (S.isString(f)) {
            return self[f];
        }
        return f;
    }

    function View() {
        View.superclass.constructor.apply(this, arguments);
        var events;
        if (events = this.get("events")) {
            this._afterEventsChange({
                newVal:events
            });
        }
    }

    View.ATTRS = {
        container:{
            valueFn:function() {
                return $("<div />");
            },
            setter:function(s) {
                if (S.isString(s)) {
                    s = $(s);
                }
                return s;
            }
        },

        /**
         * events:{
         *   selector:{
         *     eventType:callback
         *   }
         * }
         */
        events:{

        }
    };


    S.extend(View, Base, {

        _afterEventsChange:function(e) {
            var prevVal = e.prevVal;
            if (prevVal) {
                this._removeEvents(prevVal);
            }
            this._addEvents(e.newVal);
        },

        _removeEvents:function(events) {
            var container = this.get("container");
            for (var selector in events) {
                var event = events[selector];
                for (var type in event) {
                    var callback = event[type];
                    container.undelegate(type, selector, callback, this);
                }
            }
        },

        _addEvents:function(events) {
            var container = this.get("container");
            for (var selector in events) {
                var event = events[selector];
                for (var type in event) {
                    var callback = event[type];
                    container.delegate(type, selector, callback, this);
                }
            }
        },
        /**
         * user need to override
         */
        render:function() {
            return this;
        },

        remove:function() {
            this.get("container").remove();
        }

    });

    return View;

}, {
    requires:['node','base']
});/**
 * KISSY's MVC Framework for Page Application (Backbone Style)
 * @author yiminghe@gmail.com
 */
KISSY.add("mvc", function(S, MVC, Model, Collection, View, Router) {
    return S.mix(MVC, {
        Model:Model,
        View:View,
        Collection:Collection,
        Router:Router
    });
}, {
    requires:["mvc/base","mvc/model","mvc/collection","mvc/view","mvc/router"]
});
