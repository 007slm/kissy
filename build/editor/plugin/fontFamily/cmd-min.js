/*
Copyright 2012, KISSY UI Library v1.30rc
MIT Licensed
build time: Jul 10 11:16
*/
KISSY.add("editor/plugin/fontFamily/cmd",function(d,e,a){var b={element:"span",styles:{"font-family":"#(value)"},overrides:[{element:"font",attributes:{face:null}}]};return{init:function(c){a.addSelectCmd(c,"fontFamily",b)}}},{requires:["editor","../font/cmd"]});
