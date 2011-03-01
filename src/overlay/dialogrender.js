KISSY.add("overlay/dialogrender", function(S, UIBase, OverlayRender) {
    function require(s) {
        return S.require("uibase/" + s);
    }

    return UIBase.create(OverlayRender, [
        require("stdmodrender"),
        require("closerender")
    ]);
}, {
    requires:['uibase','./overlayrender']
});