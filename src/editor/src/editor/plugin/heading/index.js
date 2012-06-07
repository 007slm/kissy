/**
 * Heading plugin for KISSY.
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/heading/index", function (S, Editor, headingCmd) {
    return {
        init:function (editor) {

            headingCmd.init(editor);

            var FORMAT_SELECTION_ITEMS = [],
                FORMATS = {
                    "普通文本":"p",
                    "标题1":"h1",
                    "标题2":"h2",
                    "标题3":"h3",
                    "标题4":"h4",
                    "标题5":"h5",
                    "标题6":"h6"
                },
                FORMAT_SIZES = {
                    p:"1em",
                    h1:"2em",
                    h2:"1.5em",
                    h3:"1.17em",
                    h4:"1em",
                    h5:"0.83em",
                    h6:"0.67em"
                };

            for (var p in FORMATS) {
                if (FORMATS.hasOwnProperty(p)) {
                    FORMAT_SELECTION_ITEMS.push({
                        content:p,
                        value:FORMATS[p],
                        elAttrs:{
                            style:"font-size:" + FORMAT_SIZES[FORMATS[p]]
                        }
                    });
                }
            }

            editor.addSelect("heading", {
                defaultCaption:"标题",
                width:"120px",
                menu:{
                    width:"120px",
                    children:FORMAT_SELECTION_ITEMS
                },
                mode:Editor.WYSIWYG_MODE
            }, {
                click:function (ev) {
                    var self = this,
                        v = ev.target.get("value"),
                        pre = ev.prevTarget && ev.prevTarget.get("value");
                    if (v != pre) {
                        editor.execCommand("heading", v);
                    } else {
                        editor.execCommand("heading", "p");
                        self.set("value", "p");
                    }
                },
                selectionChange:function (ev) {
                    var self = this,
                        elementPath = ev.path;
                    // For each element into the elements path.
                    // Check if the element is removable by any of
                    // the styles.
                    var queryCmd = Editor.Utils.getQueryCmd("heading");
                    for (var value in FORMAT_SIZES) {
                        if (FORMAT_SIZES.hasOwnProperty(value) &&
                            editor.execCommand(queryCmd, elementPath, value)) {
                            self.set("value", value);
                            return;
                        }
                    }
                }
            });
        }
    };
}, {
    requires:['editor', './cmd']
});