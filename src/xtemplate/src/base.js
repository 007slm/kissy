/**
 * setup xtemplate constructor
 * @author yiminghe@gmail.com
 */
KISSY.add('xtemplate/base', function (S, compiler) {

    var guid = 0;

    var cache = {};

    function XTemplate(tpl, option) {
        var self = this;
        // prevent messing up with velocity
        if (S.isString(tpl)) {
            tpl = tpl.replace(/\{\{@/g, '{{#');
        }
        self.tpl = tpl;
        option = option || {};
        self.subTpls = S.merge(option.subTpls, XTemplate.subTpls);
        self.commands = S.merge(option.commands, XTemplate.commands);
        this.option = option;
    }

    XTemplate.prototype = {
        constructor: XTemplate,
        removeSubTpl: function (subTplName) {
            delete this.subTpls[subTplName];
        },
        removeCommand: function (commandName) {
            delete this.commands[commandName];
        },
        addSubTpl: function (subTplName, def) {
            this.subTpls[subTplName] = def;
        },
        addCommand: function (commandName, fn) {
            this.commands[commandName] = fn;
        },
        compile: function () {
            var self = this, tpl = self.tpl, option = this.option;
            if (!self.compiled) {
                if (S.isFunction(tpl)) {
                } else {
                    var code = compiler.compile(tpl);
                    // eval is not ok for eval("(function(){})") ie
                    self.tpl = cache[tpl] ||
                        (cache[tpl] = Function.apply(null, []
                            .concat(code.params)
                            .concat(code.source.join('\n') + '//@ sourceURL=' +
                            (option.name ? option.name : ('xtemplate' + (guid++))) + '.js')));
                }
                self.compiled = 1;
            }
            return self.tpl;
        },
        render: function (data) {
            var self = this;
            self.compile();
            if (!S.isArray(data)) {
                data = [data];
            }
            return self.tpl(data, {
                commands: self.commands,
                subTpls: self.subTpls
            });
        }
    };

    XTemplate.compiler = compiler;

    return XTemplate;
}, {
    requires: ['./compiler']
});