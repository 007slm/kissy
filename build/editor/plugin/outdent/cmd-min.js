/*
Copyright 2012, KISSY UI Library v1.30dev
MIT Licensed
build time: Jun 10 21:07
*/
KISSY.add("editor/plugin/outdent/cmd",function(f,c,a){var d=a.addCommand,e=a.checkOutdentActive;return{init:function(b){d(b,"outdent");var a=c.Utils.getQueryCmd("outdent");b.hasCommand(a)||b.addCommand(a,{exec:function(a,b){return e(b)}})}}},{requires:["editor","../dentUtils/cmd"]});
