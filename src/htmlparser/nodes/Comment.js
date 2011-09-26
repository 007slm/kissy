/**
 * comment node (<!-- content -->)
 * @author yiminghe@gmail.com
 */
KISSY.add(function(S, Tag) {

    function Comment() {
        Comment.superclass.constructor.apply(this, arguments);
        this.nodeType = 8;
        this.nodeName = "#comment";
    }

    S.extend(Comment, Tag, {
        writeHtml:function(writer, filter) {
            var value = this.toHtml();
            if (filter.onComment(this) !== false) {
                writer.comment(value);
            }
        }
    });

    return Comment;
}, {
    requires:['./Tag']
});