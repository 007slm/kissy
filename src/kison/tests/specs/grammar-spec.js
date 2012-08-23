/**
 * TC for KISSY LALR Grammar Parser
 */
KISSY.use("kison", function (S, Kison) {
    var Production = Kison.Production;
    var Grammar = Kison.Grammar;
    var Lexer = Kison.Lexer;

    describe("grammar", function () {

        // 4-41 文法 GOTO 图
        it("generate goto map ok", function () {

            var grammar = new Grammar({
                productions: [
                    {
                        symbol: "S0",
                        rhs: [
                            "S"
                        ]
                    },
                    {
                        symbol: "S",
                        rhs: [
                            "C", "C"
                        ]
                    },
                    {
                        symbol: "C",
                        rhs: [
                            "c", "C"
                        ]
                    },
                    {
                        symbol: "C",
                        rhs: [
                            "d"
                        ]
                    }
                ],
                terminals: {
                    "c": 1,
                    "d": 1
                }
            });

            var itemSets = grammar.get("itemSets");

            S.each(itemSets, function (itemSet, i) {
                S.log("************************* " + i);
                S.log(itemSet.toString());
            });

            expect(itemSets.length).toBe(8);

            S.log(itemSets);

            var i1gotos = itemSets[1].get("gotos");

            expect(itemSets[0].get("gotos")['c']).toBe(itemSets[1]);

            S.log("!!!!!!!!!!!!!!!");
            // S.log(itemSets[4].get("gotos")['c'].toString());
            S.log("!!!!!!!!!!!!!!!");

            // expect(itemSets[4].get("gotos")['c']).toBe(itemSets[1]);

            var num = 0;

            S.each(i1gotos, function (itemSet, symbol) {
                S.log("************************* " + symbol);
                S.log(itemSet.toString());
                if (symbol == "c") {
                    expect(itemSet).toBe(itemSets[1]);
                }
                num++;
            });

            expect(num).toBe(3);

        });


        it("generate table ok", function () {

            S.log('it("generate table ok", function () {');

            var grammar = new Grammar({
                productions: [
                    {
                        symbol: "S0",
                        rhs: [
                            "S"
                        ]
                    },
                    {
                        symbol: "S",
                        rhs: [
                            "C", "C"
                        ]
                    },
                    {
                        symbol: "C",
                        rhs: [
                            "c", "C"
                        ]
                    },
                    {
                        symbol: "C",
                        rhs: [
                            "d"
                        ]
                    }
                ],
                terminals: {
                    "c": 1,
                    "d": 1
                }
            });

            var table = grammar.visualizeTable();

            S.log(table.join("\n"));

        });

        it("parse ok", function () {

            var grammar = new Grammar({
                productions: [
                    {
                        symbol: "S0",
                        rhs: [
                            "S"
                        ]
                    },
                    {
                        symbol: "S",
                        rhs: [
                            "C", "C"
                        ]
                    },
                    {
                        symbol: "C",
                        rhs: [
                            "c", "C"
                        ]
                    },
                    {
                        symbol: "C",
                        rhs: [
                            "d"
                        ]
                    }
                ],
                lexer: {
                    rules: [
                        {
                            regexp: /^c/,
                            token: 'c'
                        },
                        {
                            regexp: /^d/,
                            token: 'd'
                        }
                    ]
                }
            });

            expect(new Function(grammar.genCode())().parse("ccdd")).not.toBe(false);
        });


        it("can not parse invalid input", function () {

            var grammar = new Grammar({
                productions: [
                    {
                        symbol: "S0",
                        rhs: [
                            "S"
                        ]
                    },
                    {
                        symbol: "S",
                        rhs: [
                            "C", "C"
                        ]
                    },
                    {
                        symbol: "C",
                        rhs: [
                            "c", "C"
                        ]
                    },
                    {
                        symbol: "C",
                        rhs: [
                            "d"
                        ]
                    }
                ],
                lexer: {
                    rules: [
                        {
                            regexp: /^c/,
                            token: 'c'
                        },
                        {
                            regexp: /^d/,
                            token: 'd'
                        }
                    ]
                }
            });

            expect(function () {
                new Function(grammar.genCode())().parse("dc")
            })
                .toThrow('parse error at line 1:\ndc\n-^\nexpect c, d');

        });


        it("parse ok with action", function () {

            S.log("---------------- parse ok with action : ccdd by ");
            S.log(" S0 => S ");
            S.log(" S => CC ");
            S.log(" C => cC ");
            S.log(" C => d ");
            S.log("------------------------------------------------\n");

            // S0 => S
            // S => CC
            // C => cC
            // C => d


            var grammar = new Grammar({
                productions: [
                    {
                        symbol: "S0",
                        rhs: [
                            "S"
                        ],
                        action: function () {
                            var ret = window.TEST_RET || (window.TEST_RET = []);
                            ret.push("S0 => S");
                            ret.push("|_____ " + this.$1 + " -> S0");
                            ret.push("");
                        }
                    },
                    {
                        symbol: "S",
                        rhs: [
                            "C", "C"
                        ],
                        action: function () {
                            var ret = window.TEST_RET || (window.TEST_RET = []);
                            ret.push("S => C C");
                            ret.push("|_____ " + this.$1 + " + " + this.$2 + " -> S");
                            ret.push("");
                            return this.$1 + this.$2;
                        }
                    },
                    {
                        symbol: "C",
                        rhs: [
                            "c", "C"
                        ],
                        action: function () {
                            var ret = window.TEST_RET || (window.TEST_RET = []);
                            ret.push("C => c C");
                            ret.push("|_____ " + this.$1 + " + " + this.$2 + " -> C");
                            ret.push("");
                            return this.$1 + this.$2;
                        }
                    },
                    {
                        symbol: "C",
                        rhs: [
                            "d"
                        ],
                        action: function () {
                            var ret = window.TEST_RET || (window.TEST_RET = []);
                            ret.push("C => d");
                            ret.push("|_____ " + this.$1 + " -> C");
                            ret.push("");
                            return this.$1;
                        }
                    }
                ],
                lexer: {
                    rules: [
                        {
                            regexp: /^c/,
                            token: 'c'
                        },
                        {
                            regexp: /^d/,
                            token: 'd'
                        }
                    ]
                }
            });

            expect(function () {
                new Function(grammar.genCode())().parse("ccdd")
            }).not.toThrow();

            S.log(window.TEST_RET.join("\n"));
        });


    });
});
