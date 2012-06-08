/**
 * backColor button.
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/backColor/index", function (S, Editor, Button, cmd) {

    return {
        init:function (editor) {
            cmd.init(editor);
            editor.addButton("backColor",{
                cmdType:'backColor',
                tooltip:"背景颜色"
            }, Button);
        }
    };
}, {
    requires:['editor', '../color/btn', './cmd']
});