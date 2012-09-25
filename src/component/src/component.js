/**
 * @ignore
 * @fileOverview mvc based component framework for kissy
 * @author yiminghe@gmail.com
 */
KISSY.add("component", function (S, Component, Controller, Render, Container, DelegateChildren, DecorateChildren, DecorateChild) {

    S.mix(Component, {
        Controller:Controller,
        "Render":Render,
        "Container":Container,
        "DelegateChildren":DelegateChildren,
        "DecorateChild":DecorateChild,
        "DecorateChildren":DecorateChildren
    });

    return Component;
}, {
    requires:[
        'component/base',
        'component/controller',
        'component/render',
        'component/container',
        'component/delegate-children',
        'component/decorate-children',
        'component/decorate-child']
});