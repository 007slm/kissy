/**
 * @ignore
 * @fileOverview dom
 * @author yiminghe@gmail.com
 */
KISSY.add('dom', function (S, DOM) {

   S.mix(S,{
        DOM:DOM,
        get:DOM.get,
        query:DOM.query
    });

    return DOM;
}, {
    requires:['dom/attr',
        'dom/class',
        'dom/create',
        'dom/data',
        'dom/insertion',
        'dom/offset',
        'dom/style',
        'dom/selector',
        'dom/style-ie',
        'dom/traversal']
});