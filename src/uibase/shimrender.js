/**
 * shim for ie6 ,require box-ext
 * @author 承玉<yiminghe@gmail.com>
 */
KISSY.add("uibase/shimrender", function(S, Node) {

    function Shim() {
        //S.log("shim init");
    }


    Shim.ATTRS = {
        shim:{
            value:true
        }
    };
    Shim.prototype = {

        _uiSetShim:function(v) {
            var self = this,el = self.get("el");
            if (v && !self.__shimEl) {
                self.__shimEl = new Node("<" + "iframe style='position: absolute;" +
                    "border: none;" +
                    "width: expression(this.parentNode.offsetWidth);" +
                    "top: 0;" +
                    "opacity: 0;" +
                    "filter: alpha(opacity=0);" +
                    "left: 0;" +
                    "z-index: -1;" +
                    "height: expression(this.parentNode.offsetHeight);" + "'/>");
                el.prepend(self.__shimEl);
            } else if (!v && self.__shimEl) {
                self.__shimEl.remove();
                delete self.__shimEl;
            }
        }
    };

    if (1 > 2) {
        Shim._uiSetShim();
    }

    return Shim;
}, {
    requires:['node']
});