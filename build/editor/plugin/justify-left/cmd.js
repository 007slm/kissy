﻿/*
Copyright 2013, KISSY UI Library v1.40dev
MIT Licensed
build time: Apr 8 22:15
*/
/*
Copyright 2013, KISSY UI Library v1.40dev
MIT Licensed
build time: Apr 8 21:58
*/
/**
 * Add justifyCenter command identifier for Editor.
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/justify-left/cmd", function (S, justifyUtils) {

    return {
        init:function (editor) {
            justifyUtils.addCommand(editor, "justifyLeft", "left");
        }
    };

}, {
    requires:['../justify-cmd']
});
