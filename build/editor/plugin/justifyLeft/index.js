﻿/*
Copyright 2012, KISSY UI Library v1.30dev
MIT Licensed
build time: Jun 15 17:22
*/
/**
 * justifyLeft button.
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/justifyLeft/index", function (S, Editor, justifyCenterCmd) {
    function exec() {
        var editor = this.get("editor");
        editor.execCommand("justifyLeft");
        editor.focus();
    }

    function justifyLeft() {
    }

    S.augment(justifyLeft, {
        renderUI:function (editor) {
            justifyCenterCmd.init(editor);
            editor.addButton("justifyLeft", {
                tooltip:"左对齐",
                checkable:true,
                listeners:{
                    click:exec,
                    afterSyncUI:function () {
                        var self = this;
                        editor.on("selectionChange", function (e) {
                            if (editor.get("mode") == Editor.SOURCE_MODE) {
                                return;
                            }
                            var queryCmd = Editor.Utils.getQueryCmd("justifyLeft");
                            if (editor.execCommand(queryCmd, e.path)) {
                                self.set("checked", true);
                            } else {
                                self.set("checked", false);
                            }
                        });
                    }
                },
                mode:Editor.WYSIWYG_MODE
            });
        }
    });

    return justifyLeft;
}, {
    requires:['editor', './cmd']
});
