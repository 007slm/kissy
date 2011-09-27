/**
 * HtmlParser for KISSY (Editor)
 * @author yiminghe@gmail.com
 */
KISSY.add(function(S, Lexer, Parser, BasicWriter, BeautifyWriter, Filter) {
    return {
        Lexer:Lexer,
        Parser:Parser,
        BasicWriter:BasicWriter,
        BeautifyWriter:BeautifyWriter,
        Filter:Filter
    };
}, {
    requires:[
        'htmlparser/lexer/Lexer',
        'htmlparser/Parser',
        'htmlparser/writer/basic',
        'htmlparser/writer/beautify',
        'htmlparser/writer/filter'
    ]
});

/**
 * 参考 http://htmlparser.sourceforge.net/
 **/