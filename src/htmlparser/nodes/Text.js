/**
 * dom text node
 * @author yiminghe@gmail.com
 */
KISSY.add(function(S, Node) {

    function Text() {
        Text.superclass.constructor.apply(this, arguments);
        this.nodeType = 3;
        this.nodeName = "#text";
    }

    S.extend(Text, Node, {
        writeHtml:function(writer, filter) {
            var value = this.toHtml();
            if (filter.onText(this) !== false) {
                writer.text(value);
            }
        }
    });

    return Text;
}, {
    requires:['./Node']
});