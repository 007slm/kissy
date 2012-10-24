/*
Copyright 2012, KISSY UI Library v1.40dev
MIT Licensed
build time: Oct 25 00:37
*/
KISSY.add("event/base",function(e,d,c,a,b){return e.Event={_Utils:d,_Object:c,_Subscriber:a,_BaseCustomEvent:b}},{requires:["./base/utils","./base/object","./base/subscriber","./base/custom-event"]});
KISSY.add("event/base/custom-event",function(e){function d(c){e.mix(this,c);this.reset()}d.prototype={constructor:d,hasSubscriber:function(){return!!this.subscribers.length},reset:function(){this.subscribers=[]},removeSubscriber:function(c){for(var a=this.subscribers,b=a.length,d=0;d<b;d++)if(a[d]==c){a.splice(d,1);break}},findSubscriber:function(c){var a=this.subscribers,b;for(b=a.length-1;0<=b;--b)if(c.equals(a[b]))return b;return-1}};return d});
KISSY.add("event/base/object",function(){function e(){}var d=function(){return!1},c=function(){return!0};e.prototype={constructor:e,isDefaultPrevented:d,isPropagationStopped:d,isImmediatePropagationStopped:d,preventDefault:function(){this.isDefaultPrevented=c},stopPropagation:function(){this.isPropagationStopped=c},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=c;this.stopPropagation()},halt:function(a){a?this.stopImmediatePropagation():this.stopPropagation();this.preventDefault()}};
return e});
KISSY.add("event/base/subscriber",function(e){function d(c){e.mix(this,c)}d.prototype={constructor:d,equals:function(c){var a=this;return!!e.reduce(a.keys,function(b,d){return b&&a[d]===c[d]},1)},simpleNotify:function(c,a){var b;b=this.fn.call(this.context||a.currentTarget,c,this.data);this.once&&a.removeSubscriber(this);return b},notifyInternal:function(c,a){this.simpleNotify(c,a)},notify:function(c,a){var b=c._ks_groups;(!b||this.groups&&this.groups.match(b))&&!1===this.notifyInternal(c,a)&&c.halt()}};
return d});
KISSY.add("event/base/utils",function(e){var d,c;return{splitAndRun:c=function(a,b){a=e.trim(a);-1==a.indexOf(" ")?b(a):e.each(a.split(/\s+/),b)},normalizeParam:function(a,b,c){var f=b||{};e.isFunction(b)&&(f={fn:b,context:c});b=d(a);a=b[0];f.groups=b[1];f.type=a;return f},batchForType:function(a,b){var d=e.makeArray(arguments);c(d[2+b],function(c){var e=[].concat(d);e.splice(0,2);e[b]=c;a.apply(null,e)})},getTypedGroups:d=function(a){if(0>a.indexOf("."))return[a,""];var b=a.match(/([^.]+)?(\..+)?$/),a=
[b[1]];(b=b[2])?(b=b.split(".").sort(),a.push(b.join("."))):a.push("");return a},getGroupsRe:function(a){return RegExp(a.split(".").join(".*\\.")+"(?:\\.|$)")}}});
