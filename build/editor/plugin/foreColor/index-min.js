/*
Copyright 2012, KISSY UI Library v1.30dev
MIT Licensed
build time: Jun 18 22:02
*/
KISSY.add("editor/plugin/foreColor/index",function(c,f,d,e){function b(a){this.config=a||{}}c.augment(b,{renderUI:function(a){e.init(a);a.addButton("foreColor",{cmdType:"foreColor",tooltip:"文本颜色",pluginConfig:this.config},d)}});return b},{requires:["editor","../color/btn","./cmd"]});
