/*
Copyright 2012, KISSY UI Library v1.30dev
MIT Licensed
build time: Jun 7 00:48
*/
KISSY.add("editor/plugin/indent/index",function(d,b,c){return{init:function(a){c.init(a);a.addButton("indent",{tooltip:"增加缩进量 ",mode:b.WYSIWYG_MODE},{offClick:function(){a.execCommand("indent");a.focus()}})}}},{requires:["editor","./cmd"]});
