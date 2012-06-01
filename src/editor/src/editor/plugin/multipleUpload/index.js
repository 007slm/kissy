KISSY.add("editor/plugin/multipleUpload/index", function (S, Editor, DialogLoader) {

    return {
        init:function (editor) {
            editor.addButton({
                contentCls:"ks-editor-toolbar-mul-image",
                title:"批量插图",
                mode:Editor.WYSIWYG_MODE
            }, {
                offClick:function () {
                    DialogLoader.useDialog(editor,"multipleUpload/dialog");
                }
            });
        }
    };

}, {
    requires:['editor', '../dialogLoader/']
});