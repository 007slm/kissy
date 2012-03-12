/**
 * @fileOverview UIBase.Box
 * @author yiminghe@gmail.com
 */
KISSY.add('uibase/box', function (S) {

    /**
     * Box Implementation
     * @class
     * @memberOf UIBase
     * @namespace
     */
    function Box() {
    }

    Box.ATTRS =
    /**
     * @lends UIBase.Box.prototype
     */
    {
        /**
         * component's html content
         * @type String
         */
        html:{
            view:true
        },
        /**
         * component's width
         * @type Number|String
         */
        width:{
            // 没有 _uiSetWidth，所以不需要设置 sync:false
            view:true
        },
        /**
         * component's height
         * @type Number|String
         */
        height:{
            view:true
        },
        /**
         * css class of component's root element
         * @type String
         */
        elCls:{
            view:true
        },
        /**
         * name-value pair css style of component's root element
         * @type Object
         */
        elStyle:{
            view:true
        },
        /**
         * name-value pair attribute of component's root element
         * @type Object
         */
        elAttrs:{
            view:true
        },
        /**
         * archor element where component insert before
         * @type NodeList
         */
        elBefore:{
            view:true
        },
        /**
         * readonly. root element of current component
         * @type NodeList
         */
        el:{
            view:true
        },

        /**
         * archor element where component append to
         * @type NodeList
         */
        render:{
            view:true
        },

        /**
         * component's visibleMode,use css "display" or "visibility" to show this component
         * @type String
         */
        visibleMode:{
            value:"display",
            view:true
        },

        /**
         * whether this component is visible
         * @type Boolean
         */
        visible:{
            view:true
        },

        /**
         * the node to parse for configuration values,passed to component's HTML_PARSER definition
         * @type NodeList
         */
        srcNode:{
            view:true
        }
    };


    Box.HTML_PARSER =
    /**
     * @private
     */
    {
        el:function (srcNode) {
            /**
             * 如果需要特殊的对现有元素的装饰行为
             */
            var self = this;
            if (self.decorateInternal) {
                self.decorateInternal(S.one(srcNode));
            }
            return srcNode;
        }
    };

    Box.prototype =
    /**
     * @lends UIBase.Box#
     */
    {
        /**
         * @private
         */
        _uiSetVisible:function (isVisible) {
            this.fire(isVisible ? "show" : "hide");
        },

        /**
         * show component
         */
        show:function () {
            var self = this;
            self.render();
            self.set("visible", true);
        },

        /**
         * hide component
         */
        hide:function () {
            this.set("visible", false);
        }
    };

    return Box;
});
