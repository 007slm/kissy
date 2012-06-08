/**
 * Add flash plugin.
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/flash/index", function (S, Editor, FlashBaseClass, flashUtils) {

    var CLS_FLASH = 'ke_flash',
        TYPE_FLASH = 'flash';

    return {
        init:function (editor) {
            var dataProcessor = editor.htmlDataProcessor,
                dataFilter = dataProcessor.dataFilter;

            dataFilter.addRules({
                    tags:{
                        'object':function (element) {
                            var classId = element.getAttribute("classid"), i;
                            if (!classId) {
                                var childNodes = element.childNodes;
                                // Look for the inner <embed>
                                for (i = 0; i < childNodes.length; i++) {
                                    if (childNodes[i].nodeName == 'embed') {
                                        if (!flashUtils.isFlashEmbed(childNodes[i][ i ])) {
                                            return dataProcessor
                                                .createFakeParserElement(element,
                                                CLS_FLASH, TYPE_FLASH, true);
                                        } else {
                                            return null;
                                        }
                                    }
                                }
                                return null;
                            }
                            return dataProcessor.createFakeParserElement(element,
                                CLS_FLASH, TYPE_FLASH, true);
                        },
                        'embed':function (element) {
                            if (flashUtils.isFlashEmbed(element)) {
                                return dataProcessor
                                    .createFakeParserElement(element, CLS_FLASH, TYPE_FLASH, true);
                            } else {
                                return null;
                            }
                        }
                    }},
                5);


            var pluginConfig = editor.get("pluginConfig").flash || {},
                flashControl = new FlashBaseClass({
                    editor:editor,
                    cls:CLS_FLASH,
                    type:TYPE_FLASH,
                    bubbleId:"flash-bubble",
                    contextMenuId:'flash-contextmenu',
                    contextMenuHandlers:{
                        "Flash属性":function () {
                            var selectedEl = this.get("editorSelectedEl");
                            if (selectedEl) {
                                flashControl.show(selectedEl);
                            }
                        }
                    }
                });

            if (pluginConfig.btn !== false) {
                editor.addButton("flash", {
                    tooltip:"插入Flash",
                    listeners:{
                        click:{
                            fn:function () {
                                flashControl.show();
                            }
                        }
                    },
                    mode:Editor.WYSIWYG_MODE
                });
            }
        }
    };

}, {
    requires:['editor', '../flashCommon/baseClass', '../flashCommon/utils']
});