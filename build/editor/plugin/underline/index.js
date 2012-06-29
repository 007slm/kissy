﻿/*
Copyright 2012, KISSY UI Library v1.30rc
MIT Licensed
build time: Jun 29 16:29
*/
/**
 * underline button
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/underline/index", function (S, Editor, ui, cmd) {

    function Underline() {
    }

    S.augment(Underline, {
        renderUI:function (editor) {
            cmd.init(editor);
            editor.addButton("underline", {
                cmdType:"underline",
                tooltip:"下划线 "
            }, ui.Button);
        }
    });

    return Underline;
}, {
    requires:['editor', '../font/ui', './cmd']
});
