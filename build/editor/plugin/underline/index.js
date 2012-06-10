﻿/*
Copyright 2012, KISSY UI Library v1.30dev
MIT Licensed
build time: Jun 10 21:07
*/
/**
 * underline button
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/underline/index", function (S, Editor, ui, cmd) {
    return {
        init:function (editor) {
            cmd.init(editor);
            editor.addButton("underline",{
                cmdType:"underline",
                tooltip:"下划线 "
            }, ui.Button);
        }
    };
}, {
    requires:['editor', '../font/ui', './cmd']
});
