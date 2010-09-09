/**
 * KISSY Popup
 * @creator     乔花<qiaohua@taobao.com>
 */
KISSY.add('popup', function(S) {

    var defaultConfig = {
        triggerType: 'mouse',
        align: {
            node: 'trigger',
            points: ['cr', 'ct'],
            offset: [10, 0]
        }
    };

    /**
     * Popup Class
     * @constructor
     */
    function Popup(container, config) {
        var self = this;

        if (!(self instanceof Popup)) {
            return new Popup(container, config);
        }

        config.align = S.merge(S.clone(defaultConfig.align), config.align);
        Popup.superclass.constructor.call(self, container, S.merge(defaultConfig, config));
    }

    S.extend(Popup, S.Overlay);
    S.Popup = Popup;

}, { host: 'overlay' });
