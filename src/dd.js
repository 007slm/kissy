/**
 * dd support for kissy
 * @author: 承玉<yiminghe@gmail.com>
 */
KISSY.add("dd", function(S, DDM, Draggable, Droppable, Proxy) {
    var dd = {
        Draggable:Draggable,
        Droppable:Droppable,
        DDM:DDM,
        Proxy:Proxy
    };

    S.mix(S, dd);

    return dd;
}, {
    requires:["dd/ddm","dd/draggable","dd/droppable","dd/proxy"]
});