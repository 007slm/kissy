/*
Copyright 2012, KISSY UI Library v1.30dev
MIT Licensed
build time: May 30 12:21
*/
KISSY.add("editor/plugin/progressbar/index",function(b){function a(){a.superclass.constructor.apply(this,arguments);this._init()}var d=b.Node;a.ATTRS={container:{},width:{},height:{},progress:{value:0}};b.extend(a,b.Base,{destroy:function(){this.detach();this.el.remove()},_init:function(){var c=this.get("height"),a=new d("<div class='ke-progressbar'  style='width:"+this.get("width")+";height:"+c+";'></div>"),b=this.get("container"),c=(new d("<div style='overflow:hidden;'><div class='ke-progressbar-inner' style='height:"+
(parseInt(c)-4)+"px'><div class='ke-progressbar-inner-bg'></div></div></div>")).appendTo(a),e=(new d("<span class='ke-progressbar-title'></span>")).appendTo(a);b&&a.appendTo(b);this.el=a;this._title=e;this._p=c;this.on("afterProgressChange",this._progressChange,this);this._progressChange({newVal:this.get("progress")})},_progressChange:function(a){a=a.newVal;this._p.css("width",a+"%");this._title.html(a+"%")}});return a});
