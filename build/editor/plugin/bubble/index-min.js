/*
Copyright 2012, KISSY UI Library v1.30dev
MIT Licensed
build time: Jun 10 21:07
*/
KISSY.add("editor/plugin/bubble/index",function(d,p,g){function q(i){var h=null,b=i.get("editor").getControls();d.each(b,function(c){var a;if(a=-1!=(c.get("elCls")||"").indexOf("bubble"))if(a=c!==i)if(a=c.get("visible")){a=i.get("y");var b=a+i.get("el").outerHeight(),d=c.get("y"),e=d+c.get("el").outerHeight();a=a<=e&&b>=e||a<=d&&b>=d}a&&(h?h.get("y")<c.get("y")&&(h=c):h=c);return h})}var m=d.Event,l={}.a,n=d.DOM,s={zIndex:g.baseZIndex(g.zIndexManager.BUBBLE_VIEW),elCls:"ks-editor-bubble",prefixCls:"ks-editor-",
effect:{effect:"fade",duration:0.3}};g.prototype.addBubble=function(i,h,b){function c(){e.hide();m.remove(o,"scroll",g)}function a(){var f;var a=e,c=a.get("editorSelectedEl");if(c){var a=a.get("editor"),d=a.get("window")[0],b=a.get("iframe").offset(),a=b.top,b=b.left,h=b+n.width(d),d=a+n.height(d),j=c.offset(l,window),g=j.top,j=j.left,i=j+c.width(),c=g+c.height(),k;c>d&&g<d?k=d-30:c>a&&c<d&&(k=c);i>b&&j<b?f=b:j>b&&j<h&&(f=j);f=f!==l&&k!==l?[f,k]:l}else f=l;if(f){e.set("xy",f);if(k=q(e))f[1]=k.get("y")+
k.get("el").outerHeight(),e.set("xy",f);e.get("visible")||e.show()}}function g(){e.get("editorSelectedEl")&&(e.get("el"),e.hide(),t())}function r(){m.on(o,"scroll",g);a()}var e,b=b||{};b.editor=this;d.mix(b,s);e=new p(b);this.addControl(i+"/bubble",e);this.on("selectionChange",function(a){var a=a.path,b=a.elements;if(a&&b&&(a=a.lastElement))(a=h(a))?(e.set("editorSelectedEl",a),e.hide(),d.later(r,10)):c()});this.on("sourceMode",c);var o=this.get("window")[0],t=d.buffer(a,350)}},{requires:["overlay",
"editor"]});
