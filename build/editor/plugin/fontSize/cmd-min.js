/*
Copyright 2012, KISSY UI Library v1.30dev
MIT Licensed
build time: Jun 19 16:41
*/
KISSY.add("editor/plugin/fontSize/cmd",function(d,e,a){var b={element:"span",styles:{"font-size":"#(value)"},overrides:[{element:"font",attributes:{size:null}}]};return{init:function(c){a.addSelectCmd(c,"fontSize",b)}}},{requires:["editor","../font/cmd"]});
