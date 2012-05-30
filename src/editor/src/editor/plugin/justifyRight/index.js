KISSY.add("editor/plugin/justifyRight/index", function (S, Editor, justifyCenterCmd) {
    function exec() {
        this.get("editor").execCommand("justifyRight");
    }

    return {
        init:function (editor) {
            justifyCenterCmd.init(editor);
            editor.addButton({
                contentCls:"ke-toolbar-justifyRight",
                title:"右对齐",
                mode:Editor.WYSIWYG_MODE
            }, {
                onClick:exec,
                offClick:exec,
                selectionChange:function (e) {
                    var queryCmd = Editor.Utils.getQueryCmd("justifyRight");
                    if (editor.execCommand(queryCmd, e.path)) {
                        this.bon();
                    } else {
                        this.boff();
                    }
                }
            });
        }
    };
}, {
    requires:['editor', './cmd']
});