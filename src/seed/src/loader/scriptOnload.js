/**
 * @fileOverview script/css load across browser
 * @author  yiminghe@gmail.com
 */
(function (S) {
    if (typeof require !== 'undefined') {
        return;
    }
    var CSS_POLL_INTERVAL = 30,
        utils = S.Loader.Utils,
        jsCallbacks = {},
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

    function onreadystatechange() {
        var self = this, rs = self.readyState;
        if (/loaded|complete/i.test(rs)) {
            self.onreadystatechange = null;
            var src = self.src,
                callbacks = jsCallbacks[src];
            delete jsCallbacks[src];
            S.each(callbacks, function (callback) {
                callback.call(self);
            });
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
                var src = node.src,
                    callbacks = jsCallbacks[src] = jsCallbacks[src] || [];
                callbacks.push(callback);
                if (callbacks.length == 1) {
                    node.onreadystatechange = onreadystatechange;
                }
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
})(KISSY);