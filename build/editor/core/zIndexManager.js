﻿/*
Copyright 2012, KISSY UI Library v1.30dev
MIT Licensed
build time: Jun 7 15:13
*/
/**
 * 集中管理各个z-index
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/core/zIndexManager", function (S) {
    var Editor = S.Editor;

    /**
     * z-index manager
     *@enum {number}
     */
    Editor.zIndexManager = {
        BUBBLE_VIEW:(1100),
        POPUP_MENU:(1200),
        // flash 存储设置最高
        STORE_FLASH_SHOW:(99999),
        MAXIMIZE:(900),
        OVERLAY:(9999),
        LOADING:(11000),
        LOADING_CANCEL:12000,
        SELECT:(1200)
    };

    /**
     * 获得全局最大值
     */
    Editor.baseZIndex = function (z) {
        return (Editor['Config'].baseZIndex || 10000) + z;
    };
}, {
    requires:['./base']
});
