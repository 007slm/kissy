﻿/*
Copyright 2012, KISSY UI Library v1.30rc
MIT Licensed
build time: Aug 15 22:02
*/
/**
 * Add ul/ol button.
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/ordered-list/index", function (S, Editor, ListButton, ListCmd) {

    function orderedList() {

    }

    S.augment(orderedList, {
        renderUI:function (editor) {
            ListCmd.init(editor);

            editor.addButton("orderedList", {
                cmdType:"insertOrderedList",
                mode:Editor.WYSIWYG_MODE
            }, ListButton);
        }
    });

    return orderedList;
}, {
    requires:['editor', '../list-utils/btn', './cmd']
});
