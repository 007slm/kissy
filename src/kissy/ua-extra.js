/**
 * @module  ua-extra
 * @author  gonghao(gonghao@ghsky.com)
 */
KISSY.add('ua-extra', function(S) {
    var ua = navigator.userAgent, doc = document,
        m, external, ie, o = { },
        numberify = function(s) {
            var c = 0;
            // convert '1.2.3.4' to 1.234
            return parseFloat(s.replace(/\./g, function() {
                return (c++ === 0) ? '.' : '';
            }));
        };
        
    /** 
     * 说明：
     * @子涯总结的各国产浏览器的判断依据：http://spreadsheets0.google.com/ccc?key=tluod2VGe60_ceDrAaMrfMw&hl=zh_CN#gid=0 
     * 根据CNZZ 2009年度浏览器占用率报告，优化了判断顺序：http://www.tanmi360.com/post/230.htm
     * 如果检测出浏览器，但是具体版本号未知用 0.1 作为标识
     * 世界之窗&360浏览器，在3.x以下的版本都无法通过UA或者特性检测进行判断，所以目前只要检测到UA关键字就认为起版本号为 3
     */
     
    // 360Browser
    if (m = ua.match(/360SE/)) {
        o.se360 = 3; // issue: 360Browser 2.x cannot be recognised, so if recognised default set verstion number to 3
    
    // Maxthon
    } else if ((m = ua.match(/Maxthon/)) && (external = window.external)) {
        // issue: Maxthon 3.x in IE-Core cannot be recognised and it doesn't have exact version number
        // but other maxthon versions all have exact version number
        try {
            o.maxthon = numberify(external.max_version);
        } catch(ex) {
            o.maxthon = 0.1;
        }
        
    // TT    
    } else if (m = ua.match(/TencentTraveler\s([\d.]*)/)) {
        o.tt = m[1] ? numberify(m[1]) : 0.1;
    
    // TheWorld
    } else if (m = ua.match(/TheWorld/)) {
        o.theworld = 3; // issue: TheWorld 2.x cannot be recognised, so if recognised default set verstion number to 3
        
    // Sougou
    } else if (m = ua.match(/SE\s([\d.]*)/)) {
        o.sougou = m[1] ? numberify(m[1]) : 0.1;
       
    // Raw IE detection
    } else if (ie = S.UA.ie) {
        // hack: documentMode is only supported in IE 8 so we know if its here its really IE 8
        if (ie < 8 && doc.documentMode) {
            o.rawie = 8;
        } else {
            o.rawie = ie;
        }
    }
    
    S.mix(S.UA, o);
});