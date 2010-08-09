/**
 * @module  ua-extra
 * @author  gonghao<gonghao@ghsky.com>
 */
KISSY.add('ua-extra', function(S) {
    var UA = S.UA,
        ua = navigator.userAgent,
        m, external, ie, shell,
        o = { },
        numberify = UA._numberify;

    /**
     * 说明：
     * @子涯总结的各国产浏览器的判断依据: http://spreadsheets0.google.com/ccc?key=tluod2VGe60_ceDrAaMrfMw&hl=zh_CN#gid=0
     * 根据 CNZZ 2009 年度浏览器占用率报告，优化了判断顺序：http://www.tanmi360.com/post/230.htm
     * 如果检测出浏览器，但是具体版本号未知用 0.1 作为标识
     * 世界之窗 & 360 浏览器，在 3.x 以下的版本都无法通过 UA 或者特性检测进行判断，所以目前只要检测到 UA 关键字就认为起版本号为 3
     */

    // 360Browser
    if (m = ua.match(/360SE/)) {
        o.se360 = 3; // issue: 360Browser 2.x cannot be recognised, so if recognised default set verstion number to 3
        shell = 'se360';
    }
    // Maxthon
    else if ((m = ua.match(/Maxthon/)) && (external = window.external)) {
        // issue: Maxthon 3.x in IE-Core cannot be recognised and it doesn't have exact version number
        // but other maxthon versions all have exact version number
        try {
            o.maxthon = numberify(external['max_version']);
        } catch(ex) {
            o.maxthon = 0.1;
        } finally {
            shell = 'maxthon';
        }
    }
    // TT
    else if (m = ua.match(/TencentTraveler\s([\d.]*)/)) {
        o.tt = m[1] ? numberify(m[1]) : 0.1;
        shell = 'tt';
    }
    // TheWorld
    else if (m = ua.match(/TheWorld/)) {
        o.theworld = 3; // issue: TheWorld 2.x cannot be recognised, so if recognised default set verstion number to 3
        shell = 'theworld';
    }
    // Sougou
    else if (m = ua.match(/SE\s([\d.]*)/)) {
        o.sougou = m[1] ? numberify(m[1]) : 0.1;
        shell = 'sougou';
    }
    // Raw IE detection
    else if ((ie = UA.ie)) {
        // hack: documentMode is only supported in IE 8 so we know if its here its really IE 8
        if (ie < 8 && document['documentMode']) {
            o.rawie = 8;
        } else {
            o.rawie = ie;
        }
    }

    // If the browser has shell(no matter IE-core or Webkit-core or others), set the shell key
    shell && (o.shell = shell);

    S.mix(UA, o);
});
