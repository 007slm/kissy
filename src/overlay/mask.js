/**
 * Mask 
 *
 * @creator     �ǻ�<qiaohua@taobao.com>
 * @date        2010.08.25
 * @version     1.0
 */

KISSY.add('mask', function(S, undefined) {
    var DOM = S.DOM,
        Event = S.Event,
        CLS_PREFIX = 'ks-overlay-',
        KS_OVERLAY_MASK_CLS = CLS_PREFIX+'mask',
        
        /**
         * Ĭ������
         */
        defaultConfig = {
            // ��ʽ
            containerCls: KS_OVERLAY_MASK_CLS,
            mask: false
        };
    
    /*
     * DOM �ṹ
     * <body>
     *  <div class="{{KS_OVERLAY_MASK_CLS}}">...</div>
     *  <div class="{{KS_OVERLAY_MASK_IFM_CLS}}"></div>
     * </body>
     */
    
    /**
     * Mask 
     * ֻ��ҳ������Ҫ���ǲ�ʱ������
     */
    function Mask(cfg){
        var self = this;
        
        if (!(self instanceof Mask)) {
            return new Mask(cfg);
        }
        self.on('afterInit', function(){
            //this.config.width = DOM.docWidth();
            this.config.height = DOM.docHeight(); //docHeight
        });
        Mask.superclass.constructor.call(self, null, S.merge(defaultConfig, cfg));
    }

    S.extend(Mask, S.Overlay);
    S.Mask = Mask;
    
    S.augment(Mask, S.EventTarget, {
        setPosition: function() {
            Mask.superclass.setPosition.call(this, {left:0, top:0});
        }
    });
    
}, { host: 'overlay' } );
