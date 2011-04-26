/**
 * @module  droppable-spec
 * @author  yiminghe@gmail.com
 */
KISSY.use("ua,node,dd", function(S, UA, Node, DD) {
    var Draggable = DD.Draggable,
        Droppable = DD.Droppable;
    var ie = document['documentMode'] || UA['ie'];


    describe("droppable", function() {

        describe(" mode == point", function() {
            var drag,drop,dragNode,dragXy,dropNode,dropXy;
            runs(function() {
                drag = new Draggable({
                    mode:'point',
                    node:'#drag_mode'
                });

                drag.on("drag", function(ev) {
                    drag.get("dragNode").offset(ev);
                });

                drop = new Droppable({
                    node:"#drop_mode"
                });
                dragNode = drag.get("dragNode");
                dragXy = dragNode.offset();
                dropNode = drop.get("node");
                dropXy = dropNode.offset();
            });

            runs(function() {
                jasmine.simulate(dragNode[0], "mousedown", {
                    clientX:dragXy.left + 10,
                    clientY:dragXy.top + 10
                });
            });
            waits(300);
            it("should fire dragenter properly", function() {

                var dragenterSpy = jasmine.createSpy();
                drag.on("dragenter", dragenterSpy);

                runs(function() {
                    jasmine.simulate(document, "mousemove", {
                        clientX:dropXy.left + 10,
                        clientY:dropXy.top + 10
                    });
                });
                waits(300);
                runs(function() {
                    expect(dragenterSpy.callCount).toBe(1);
                });
                runs(function() {
                    jasmine.simulate(document, "mousemove", {
                        clientX:dropXy.left + 20,
                        clientY:dropXy.top + 20
                    });
                });
                waits(300);
                runs(function() {
                    expect(dragenterSpy.callCount).toBe(1);
                });


            });

            it("should fire dragover properly", function() {
                var dragoverSpy = jasmine.createSpy();
                drag.on("dragover", dragoverSpy);
                runs(function() {
                    jasmine.simulate(document, "mousemove", {
                        clientX:dropXy.left + 21,
                        clientY:dropXy.top + 22
                    });
                });
                waits(300);
                runs(function() {
                    expect(dragoverSpy.callCount).toBe(1);
                });
                runs(function() {
                    jasmine.simulate(document, "mousemove", {
                        clientX:dropXy.left + 20,
                        clientY:dropXy.top + 20
                    });
                });
                waits(300);
                runs(function() {
                    expect(dragoverSpy.callCount).toBe(2);
                });
            });


            it("should fire dragexit properly", function() {
                var dragExit = jasmine.createSpy();
                drag.on("dragexit", dragExit);
                runs(function() {
                    jasmine.simulate(document, "mousemove", {
                        clientX:dropXy.left + 150,
                        clientY:dropXy.top + 150
                    });
                });
                waits(300);
                runs(function() {
                    expect(dragExit.callCount).toBe(1);
                });
            });


            it("should fire dragdrophit properly", function() {
                var dragdropHit = jasmine.createSpy();
                drag.on("dragdrophit", dragdropHit);
                runs(function() {
                    jasmine.simulate(document, "mousemove", {
                        clientX:dropXy.left + 10,
                        clientY:dropXy.top + 10
                    });
                });

                waits(300);

                runs(function() {
                    jasmine.simulate(document, "mouseup");
                });
                waits(300);

                runs(function() {
                    expect(dragdropHit.callCount).toBe(1);
                });
            });

            runs(function() {
                dragXy = dragNode.offset();
                jasmine.simulate(dragNode[0], "mousedown", {
                    clientX:dragXy.left + 10,
                    clientY:dragXy.top + 10
                });
            });
            waits(300);

            it("should fire dragdropmiss properly", function() {
                var dragdropMiss = jasmine.createSpy();
                drag.on("dragdropmiss", dragdropMiss);
                runs(function() {
                    jasmine.simulate(document, "mousemove", {
                        clientX:dropXy.left + 150,
                        clientY:dropXy.top + 150
                    });
                });

                waits(300);

                runs(function() {
                    jasmine.simulate(document, "mouseup");
                });
                waits(300);

                runs(function() {
                    expect(dragdropMiss.callCount).toBe(1);
                });
            });

            runs(function() {
                Node.one("#drag_mode").remove();
                Node.one("#drop_mode").remove();
            });

        });
    });

});
