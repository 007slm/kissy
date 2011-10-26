/**
 * enhanced base for model with sync
 * @author yiminghe@gmail.com
 */
KISSY.add("mvc/model", function(S, Base, mvc) {

    var blacklist = ["idAttribute",
        "clientId",
        "urlRoot",
        "url",
        "sync"];

    function Model() {
        var self = this;
        Model.superclass.constructor.apply(self, arguments);
        /**
         * should bubble to its collections
         */
        self.publish("*Change", {
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

        setId:function(id) {
            return this.set(this.get("idAttribute"), id);
        },

        /**
         * @override
         */
        __set:function() {
            this.__isModified = 1;
            return Model.superclass.__set.apply(this, arguments);
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
                self.fire("destroy");
                success && success.apply(this, arguments);
            };
            if (!self.isNew() && opts['delete']) {
                self.get("sync").call(self, 'delete', opts);
            } else {
                opts.success();
                if (opts.complete) {
                    opts.complete();
                }
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
            self.get("sync").call(self, 'read', opts);
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
            opts = opts || {};
            var success = opts.success;
            opts.success = function(resp) {
                if (resp) {
                    self.set(self.parse(resp), opts);
                }
                self.__isModified = 0;
                success && success.apply(this, arguments);
            };
            self.get("sync").call(self, self.isNew() ? 'create' : 'update', opts);
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
            },
            sync:{
                value:sync
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


    function sync() {
        mvc.sync.apply(this, arguments);
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
});