KISSY.add(function(S, CdataScanner) {
    return {
        scan:function(tag, lexer, stack) {
            return CdataScanner.scan(tag, lexer, false);
        }
    };
}, {
    requires:["./CdataScanner"]
});