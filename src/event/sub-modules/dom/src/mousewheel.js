/**
 * @ignore
 * @fileOverview normalize mousewheel in gecko
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/mousewheel', function (S, special,UA) {

    var MOUSE_WHEEL = UA.gecko ? 'DOMMouseScroll' : 'mousewheel';

    special['mousewheel'] = {
        onFix: MOUSE_WHEEL,
        delegateFix: MOUSE_WHEEL
    };

}, {
    requires: ['./special','ua']
});