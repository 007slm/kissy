/*
Copyright 2012, KISSY UI Library v1.30dev
MIT Licensed
build time: May 31 22:01
*/
KISSY.add("editor/plugin/separator/index",function(b){return{init:function(a){var c=(new b.Node('<span class="ks-editor-toolbar-separator">&nbsp;</span>')).appendTo(a.get("toolBarEl"));a.on("destroy",function(){c.remove()})}}},{requires:["editor"]});
