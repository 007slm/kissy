/*
Copyright 2011, KISSY UI Library v1.1.8dev
MIT Licensed
build time: ${build.time}
*/
KISSY.add("template",function(d){function i(b){if(!h[b]){var e=d.guid(o),f,g,c=[p,e,q,g=r(b),s];try{f=new Function(e,c.join(""))}catch(a){c[3]=j+k+t+","+a.message+j+k;f=new Function(e,c.join(""))}h[b]={name:e,o:g,parser:c.join(""),render:f}}return h[b]}var h={},n={"#":"start","/":"end"},u=RegExp("KS_TEMPL_STAT_PARAM","g"),o="KS_DATA_",j='");',k='KS_TEMPL.push("',t="KISSY.Template: Syntax Error. ",p="var KS_TEMPL=[],KS_TEMPL_STAT_PARAM=false;with(",q='||{}){try{KS_TEMPL.push("',s='");}catch(e){KS_TEMPL=["KISSY.Template: Render Error. " + e.message]}};return KS_TEMPL.join("");',
v=function(b){return b.replace(/"/g,'\\"')},l=d.trim,r=function(b){var e,f;return v(l(b).replace(/[\r\t\n]/g," ").replace(/\\/g,"\\\\")).replace(/\{\{([#/]?)(?!\}\})([^}]*)\}\}/g,function(g,c,a){e="";a=l(a).replace(/\\"/g,'"');if(c){f=a.indexOf(" ");a=f===-1?[a,""]:[a.substring(0,f),a.substring(f)];g=a[0];a=l(a[1]);if((g=m[g])&&n[c]){c=g[n[c]];e=String(d.isFunction(c)?c.apply(this,a.split(/\s+/)):c.replace(u,a))}}else e="KS_TEMPL.push(typeof ("+a+') ==="undefined"?"":'+a+");";return j+e+k})},m={"if":{start:"if(KS_TEMPL_STAT_PARAM){",
end:"}"},"else":{start:"}else{"},elseif:{start:"}else if(KS_TEMPL_STAT_PARAM){"},each:{start:function(b,e,f,g){var c="_ks_value",a="_ks_index";if(e==="as"&&f){c=f||c;a=g||a}return"KISSY.each("+b+", function("+c+", "+a+"){"},end:"});"},"!":{start:"/*KS_TEMPL_STAT_PARAM*/"}};d.mix(i,{log:function(b){if(!(b in h)){i(b);this.log(b)}},addStatement:function(b,e){if(d.isString(b))m[b]=e;else d.mix(m,b)}});return d.Template=i});
KISSY.add("template-node",function(d){d.mix(d,{tmpl:function(i,h){return d.one(d.DOM.create(d.Template(d.one(i).html()).render(h)))}})},{host:"template"});
