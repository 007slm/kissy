/*
Copyright 2012, KISSY UI Library v1.30dev
MIT Licensed
build time: Jun 11 20:22
*/
KISSY.add("editor/plugin/video/index",function(n,l,i,m){return{init:function(f){function g(b){for(var a=0;a<h.length;a++){var d=h[a];if(d.reg.test(b))return d}}var e=f.htmlDataProcessor,j=e&&e.dataFilter,h=[],c=f.get("pluginConfig");c.video=c.video||{};c=c.video;c.providers&&h.push.apply(h,c.providers);c.getProvider=g;j&&j.addRules({elements:{object:function(b){var a=b.getAttribute("classid"),d=b.childNodes;if(!a){for(a=0;a<d.length;a++)if("embed"==d[a].name){if(!i.isFlashEmbed(d[a]))break;if(g(d[a].getAttribute("src")))return e.createFakeParserElement(b,
"ke_video","video",!0)}return null}for(a=0;a<d.length;a++){var c=d[a];if("param"==c.nodeName&&"movie"==c.getAttribute("name").toLowerCase()&&g(c.getAttribute("value")))return e.createFakeParserElement(b,"ke_video","video",!0)}},embed:function(b){if(!i.isFlashEmbed(b))return null;if(g(b.getAttribute("src")))return e.createFakeParserElement(b,"ke_video","video",!0)}}},4);var k=new m({editor:f,cls:"ke_video",type:"video",bubbleId:"video",contextMenuId:"video",contextMenuHandlers:{"视频属性":function(){var b=
this.get("editorSelectedEl");b&&k.show(b)}}});f.addButton("video",{tooltip:"插入视频",listeners:{click:function(){k.show()}},mode:l.WYSIWYG_MODE})}}},{requires:["editor","../flashCommon/utils","../flashCommon/baseClass"]});
