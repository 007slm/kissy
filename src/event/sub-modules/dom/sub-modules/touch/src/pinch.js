/**
 * @ignore
 * gesture pinch
 * @author yiminghe@gmail.com
 */
KISSY.add('event/dom/touch/pinch', function (S, eventHandleMap, Event, MultiTouch) {

    var PINCH = 'pinch',
        PINCH_START = 'pinchStart',
        PINCH_END = 'pinchEnd';

    function getDistance(p1, p2) {
        var deltaX = p1.pageX - p2.pageX,
            deltaY = p1.pageY - p2.pageY;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    function Pinch() {
    }

    S.extend(Pinch, MultiTouch, {

        onTouchMove: function (e) {

            var self = this;

            if (!self.isTracking) {
                return;
            }

            var touches = e.touches,
                distance = getDistance(touches[0], touches[1]);

            if (!self.isStarted) {
                self.isStarted = true;
                self.startDistance = distance;
                var target = self.target = self.getCommonTarget(e);
                Event.fire(target,
                    PINCH_START, {
                        touches: touches,
                        distance: distance,
                        scale: 1
                    });
            } else {
                Event.fire(self.target,
                    PINCH, {
                        touches: touches,
                        distance: distance,
                        scale: distance / self.startDistance
                    });
            }

            self.lastTouches = touches;
        },

        fireEnd: function () {
            var self = this;
            Event.fire(self.target, PINCH_END, {
                touches: self.lastTouches
            });
        }

    });

    eventHandleMap[PINCH] =
        eventHandleMap[PINCH_END] =
            eventHandleMap[PINCH_END] = new Pinch();

    return Pinch;

}, {
    requires: ['./handle-map', 'event/dom/base', './multi-touch']
});