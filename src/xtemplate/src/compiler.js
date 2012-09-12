/**
 * translate ast to js function code
 * @author yiminghe@gmail.com
 */
KISSY.add("xtemplate/compiler", function (S, parser, ast) {

    parser.yy = ast;

    var arrayPush = [].push;

    function escapeString(str) {
        return str.replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t');
    }

    function pushToArray(to, from) {
        arrayPush.apply(to, from);
    }

    function lastOfArray(arr) {
        return arr[arr.length - 1];
    }

    var getProperty = function (parts, from) {
        if (!from) {
            return false;
        }
        parts = parts.split('.');
        var len = parts.length, i, v = from;
        for (i = 0; i < len - 1; i++) {
            if (!(parts[i] in v)) {
                return false;
            }
            v = v[parts[i]];
        }
        return [v];
    };

    var gen = {

        // ------------ helper generation function start

        genFunction: function (statements, global) {
            var source = [];
            if (!global) {
                source.push('function(scopes) {');
            }
            source.push('var buffer = ""' + (global ? ',' : ';'));
            if (global) {
                source.push('S = KISSY,' +
                    'escapeHTML = S.escapeHTML,' +
                    'log = S.log,' +
                    'error = S.error,');
                source.push('commands = option.commands,' +
                    'subTpls=option.subTpls;');
                source.push('var getProperty=' + getProperty.toString() + ';');
            }
            if (statements) {
                for (var i = 0, len = statements.length; i < len; i++) {
                    pushToArray(source, this[statements[i].type](statements[i]));
                }
            }
            source.push('return buffer;');
            if (!global) {
                source.push('}');
                return source;
            } else {
                return {
                    params: ['scopes', 'option'],
                    source: source
                };
            }
        },

        genId: function (idNode, tplNode) {
            var source = [],
                depth = idNode.depth,
                scope = 'scopes[' + depth + ']',
                idString = idNode.string;

            var idName = S.guid('id'),
                self = this,
                tmpNameCommand = S.guid('command');

            source.push('var ' + idName + ';');

            if (tplNode && depth == 0) {
                var optionNameCode = self.genOption(tplNode);
                pushToArray(source, optionNameCode[1]);
                source.push('var ' + tmpNameCommand + ';');
                source.push(tmpNameCommand + ' = commands["' + idString + '"];');
                source.push('if( ' + tmpNameCommand + ' ){');
                source.push('try{');
                source.push(idName + ' = ' + tmpNameCommand +
                    '(' + scope + ',' + optionNameCode[0] + ');');
                source.push('}catch(e){');
                source.push('error(e.message+": \'' +
                    idString + '\' at line ' + idNode.lineNumber + '");');
                source.push('}');
                source.push('}');
            }

            if (tplNode && depth == 0) {
                source.push('else {');
            }

            var tmp = S.guid('tmp');

            source.push('var ' + tmp + '=getProperty("' + idString + '",' + scope + ');');

            source.push('if(' + tmp + '===false){');
            source.push('log("can not find property: \'' +
                idString + '\' at line ' + idNode.lineNumber + '", "warn");');
            source.push(idName + ' = "";');
            source.push('} else {');
            source.push(idName + ' = ' + tmp + '[0];');
            source.push('}');

            if (tplNode && depth == 0) {
                source.push('}');
            }

            return [idName, source];
        },

        genOpExpression: function (e, type) {
            var source = [];
            var name1;
            var name2;
            var code1 = this[e.op1.type](e.op1);
            var code2 = this[e.op2.type](e.op2);
            name1 = code1[0];
            name2 = code2[0];

            if (name1 && name2) {
                pushToArray(source, code1[1]);
                pushToArray(source, code1[2]);
                source.push(name1 + type + name2);
                return ['', source];
            }

            if (!name1 && !name2) {
                pushToArray(source, code1[1].slice(0, -1));
                pushToArray(source, code2[1].slice(0, -1));
                source.push('(' +
                    lastOfArray(code1[1]) +
                    ')' +
                    type +
                    '(' + lastOfArray(code2[1]) + ')');
                return ['', source];
            }

            if (name1 && !name2) {
                pushToArray(source, code1[1]);
                pushToArray(source, code2[1].slice(0, -1));
                source.push(name1 + type +
                    '(' +
                    lastOfArray(code2[1]) +
                    ')');
                return ['', source];
            }

            if (!name1 && name2) {
                pushToArray(source, code1[1].slice(0, -1));
                pushToArray(source, code2[1]);
                source.push('(' +
                    lastOfArray(code1[1]) +
                    ')' +
                    type + name2);
                return ['', source];
            }
        },

        genOption: function (tplNode) {
            var source = [],
                optionName = S.guid('option'),
                self = this;

            source.push('var ' + optionName + ' = {' +
                'commands: commands,' +
                'subTpls: subTpls' +
                '};');

            if (tplNode) {

                var params, hash;
                if (params = tplNode.params) {
                    var paramsName = S.guid('params');
                    source.push('var ' + paramsName + ' = [];');

                    S.each(params, function (param) {
                        var nextIdNameCode = self[param.type](param);
                        if (nextIdNameCode[0]) {
                            pushToArray(source, nextIdNameCode[1]);
                            source.push(paramsName + '.push(' + nextIdNameCode[0] + ');')
                        } else {
                            pushToArray(source, nextIdNameCode[1].slice(0, -1));
                            source.push(paramsName + '.push(' + lastOfArray(nextIdNameCode[1]) + ');')
                        }
                    });

                    source.push(optionName + '.params=' + paramsName + ';');
                }

                if (hash = tplNode.hash) {
                    var hashName = S.guid('hash');
                    source.push('var ' + hashName + ' = {};');

                    S.each(hash.value, function (v, key) {
                        var nextIdNameCode = self[v.type](v);
                        if (nextIdNameCode[0]) {
                            pushToArray(source, nextIdNameCode[1]);
                            source.push(hashName + '["' + key + '"] = ' + nextIdNameCode[0] + ';')
                        } else {
                            pushToArray(source, nextIdNameCode[1].slice(0, -1));
                            source.push(hashName + '["' + key + '"] = ' + lastOfArray(nextIdNameCode[1]) + ';')
                        }
                    });

                    source.push(optionName + '.hash=' + hashName + ';');
                }

            }

            return [optionName, source];
        },

        // ------------ helper generation function end

        conditionalOrExpression: function (e) {
            return this.genOpExpression(e, '||');
        },

        conditionalAndExpression: function (e) {
            return this.genOpExpression(e, '&&');
        },

        relationalExpression: function (e) {
            return this.genOpExpression(e, e.opType);
        },

        equalityExpression: function (e) {
            return this.genOpExpression(e, e.opType);
        },

        additiveExpression: function (e) {
            return this.genOpExpression(e, e.opType);
        },

        multiplicativeExpression: function (e) {
            return this.genOpExpression(e, e.opType);
        },

        unaryExpression: function (e) {
            var source = [];
            var name;
            var code = this[e.value.type](e.value);
            arrayPush.apply(source, code[1]);
            if (name = code[0]) {
                source.push(name + '=!' + name + ';');
            } else {
                source[source.length - 1] = '!' + lastOfArray(source);
            }
            return [name, source];
        },

        string: function (e) {
            return ['', ["'" + e.value.replace(/'/g, "\\'") + "'"]];
        },

        number: function (e) {
            return ['', [e.value]];
        },

        boolean: function (e) {
            return ['', [e.value]];
        },

        id: function (e) {
            return this.genId(e);
        },

        block: function (block) {
            var programNode = block.program,
                source = [],
                tmpNameCommand = S.guid('command'),
                tplNode = block.tpl,
                optionNameCode = this.genOption(tplNode),
                optionName = optionNameCode[0],
                string = tplNode.path.string;

            pushToArray(source, optionNameCode[1]);

            source.push('var ' + tmpNameCommand +
                ' = commands["' + string + '"];');

            source.push(optionName + '.fn=' + this.genFunction(programNode.statements).join('\n') + ';');

            if (programNode.inverse) {
                var inverseFn = this.genFunction(programNode.inverse).join('\n');
                source.push(optionName + '.inverse=' + inverseFn + ';');
            }

            source.push('if( ' + tmpNameCommand + ' ){');
            source.push('try{');
            source.push('buffer += ' + tmpNameCommand + '(scopes,' + optionName + ');');
            source.push('}catch(e){');
            source.push('error(e.message+": \'' +
                string + '\' at line ' + tplNode.path.lineNumber + '");');
            source.push('}');
            source.push('} else {');
            source.push('error("can not find command: \'' +
                string + '\' at line ' + tplNode.path.lineNumber + '");');
            source.push('}');

            return source;
        },

        content: function (contentNode) {
            return ['buffer += "' + escapeString(contentNode.value.replace(/"/g, "\\")) + '";'];
        },

        tpl: function (tplNode) {
            var source = [],
                escaped = tplNode.escaped,
                genIdCode = this.genId(tplNode.path, tplNode);
            pushToArray(source, genIdCode[1]);
            source.push('buffer+=' +
                (escaped ? 'escapeHTML(' : '') +
                genIdCode[0] + '+""' +
                (escaped ? ')' : '') +
                ';');
            return source;
        },

        tplExpression: function (e) {
            var source = [],
                escaped = e.escaped,
                expressionOrVariable,
                code = this[e.expression.type](e.expression);
            if (code[0]) {
                pushToArray(source, code[1]);
                expressionOrVariable = code[0];
            } else {
                pushToArray(source, code[1].slice(0, -1));
                expressionOrVariable = lastOfArray(code[1]);
            }
            source.push('buffer+=' +
                (escaped ? 'escapeHTML(' : '') +
                expressionOrVariable +
                (escaped ? ')' : '') +
                ';');
            return source;
        }

    };

    return {
        parse: function (tpl) {
            return parser.parse(tpl);
        },
        compile: function (tpl) {
            var root = this.parse(tpl);
            return gen.genFunction(root.statements, true);
        }
    };

}, {
    requires: ['./parser', './ast']
});