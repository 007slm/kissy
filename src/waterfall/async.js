/**
 * load content from remote async
 * @author yiminghe@gmail.com
 */
KISSY.add("waterfall/async", function(S, undefined) {

    var SCROLL_TIMER = 50;

    function Async() {
        Async.superclass.constructor.apply(this, arguments);
    }


    function doScroll() {
        var self = this;
        S.log("waterfall:doScroll");
        if (self.__loading) {
            return;
        }
        // 如果正在调整中，等会再看
        // 调整中的高度不确定，现在不适合判断是否到了加载新数据的条件
        if (self.isAdjusting()) {
            // 恰好 __onScroll 是 buffered . :)
            self.__onScroll();
            return;
        }
        var container = self.get("container"),
            colHeight = container.offset().top,
            diff = self.get("diff"),
            curColHeights = self.get("curColHeights");
        // 找到最小列高度
        if (curColHeights.length) {
            colHeight += Math.min.apply(Math, curColHeights);
        }
        // 动态载
        // 最小高度(或被用户看到了)低于预加载线
        if (diff + S.DOM.scrollTop() + S.DOM.viewportHeight()/*S.one(window).scrollTop() + S.one(window).height()*/ > colHeight) {
            S.log("waterfall:loading");
            loadData.call(self);
        }
    }

    function loadData() {
        var self = this,
            container = this.get("container");

        self.__loading = true;
        var remote = self.get("remote");
        if (S.isFunction(remote)) {
            remote = remote();
        }
        self.fire("loadStart");
        S.ajax(S.mix({
            success:function(d) {
                if (d.end) {
                    S.Event.remove(window, "scroll", self.__onScroll);
                }
                self.__loading = false;
                var data = d.data,
                    template = S.Template(self.get("itemTpl")),
                    items = [];

                S.each(data, function(d) {
                    var html = template.render(d);
                    items.push(new S.Node(html));
                });
                self.addItems(items);
            },
            complete:function() {
                self.fire("loadEnd");
            }
        }, remote));
    }

    Async.ATTRS = {
        remote:{},
        diff:{
            getter:function(v) {
                return v || 0;
            }
        },
        itemTpl:{}
    };

    S.extend(Async, S.Waterfall, {
        _init:function() {
            var self = this;
            Async.superclass._init.apply(self, arguments);
            self.__onScroll = S.buffer(doScroll, SCROLL_TIMER, self);
            S.Event.on(window, "scroll", self.__onScroll);
            doScroll.call(self);
        },

        destroy:function() {
            var self = this;
            Async.superclass.destroy.apply(self, arguments);
            S.Event.remove(window, "scroll", self.__onScroll);
        }
    });

    S.Waterfall.Async = Async;
}, {
    host:'waterfall'
});