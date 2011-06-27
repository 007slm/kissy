/**
 * script transport for kissy io
 * @description: modified version of S.getScript , add abort ability
 * @author: yiminghe@gmail.com
 */
KISSY.add("ajax/script", function(S, io) {

    var transports = io.__transports,
        defaultConfig = io.__defaultConfig;

    defaultConfig.accepts.script = "text/javascript, " +
        "application/javascript, " +
        "application/ecmascript, " +
        "application/x-ecmascript";

    defaultConfig.contents.script = /javascript|ecmascript/;
    // 如果以 xhr+eval 需要下面的，否则直接 script node 不需要，引擎自己执行了，不需要手动 eval
    defaultConfig.converters.text.script = function(text) {
        S.globalEval(text);
        return text;
    };


    function ScriptTransport(xhrObj) {
        // 优先使用 xhr+eval 来执行脚本, ie 下可以探测到（更多）失败状态
        if (!xhrObj.config.crossDomain &&
            !xhrObj.config['forceScript']) {
            return new transports["*"](xhrObj);
        }
        this.xhrObj = xhrObj;
        return 0;
    }

    S.augment(ScriptTransport, {
            send:function() {
                var self = this,
                    script,
                    xhrObj = this.xhrObj,
                    c = xhrObj.config,
                    head = document['head'] ||
                        document.getElementsByTagName("head")[0] ||
                        document.documentElement;
                self.head = head;
                script = document.createElement("script");
                self.script = script;
                script.async = "async";

                if (c['scriptCharset']) {
                    script.charset = c['scriptCharset'];
                }

                script.src = c.url;

                script.onerror =
                    script.onload =
                        script.onreadystatechange = function(e) {
                            e = e || window.event;
                            // firefox onerror 没有 type ?!
                            self._callback((e.type || "error").toLowerCase());
                        };

                head.insertBefore(script, head.firstChild);
            },

            _callback:function(event, abort) {
                var script = this.script,
                    xhrObj = this.xhrObj,
                    head = this.head;

                if (abort ||
                    !script.readyState ||
                    /loaded|complete/.test(script.readyState)
                    || event == "error"
                    ) {

                    script['onerror'] = script.onload = script.onreadystatechange = null;

                    // Remove the script
                    if (head && script.parentNode) {
                        head.removeChild(script);
                    }

                    this.script = undefined;
                    this.head = undefined;

                    // Callback if not abort
                    if (!abort && event != "error") {
                        xhrObj.callback(200, "success");
                    }
                    // 非 ie<9 可以判断出来
                    else if (event == "error") {
                        xhrObj.callback(500, "scripterror");
                    }
                }
            },

            abort:function() {
                this._callback(0, 1);
            }
        });

    transports["script"] = ScriptTransport;

    return io;

}, {
        requires:['./base','./xhr']
    });