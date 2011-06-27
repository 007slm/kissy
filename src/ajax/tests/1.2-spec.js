/**
 * 1.2 new testcases
 * @author: yiminghe@gmail.com
 **/
KISSY.use("json,ajax", function(S, JSON, io) {

    describe("ajax@1.2", function() {

        it("should abort for xhr", function() {
            var re = [];
            var xhr = io({
                    url:'ajax.php',
                    cache:false,
                    success:function(data, status) {
                        var args = S.makeArray(arguments);
                        re.push(status);
                    },
                    error:function(data, status) {
                        var args = S.makeArray(arguments);
                        re.push(status);
                    },
                    complete:function(data, status) {
                        var args = S.makeArray(arguments);
                        re.push(status);
                    }
                });

            xhr.abort();

            expect(re.toString()).toBe(["abort","abort"].toString());

        });

        it("timeout should work for xhr", function() {

            var re = [];
            var xhr = io({
                    url:'ajax.php',
                    // ie Ĭ�ϻỺ�棬����ֱ�Ӵ��� success
                    // fiddler �����������Դ����粶��Ϊ 304
                    cache:false,
                    dataType:'json',
                    timeout:100,
                    success:function(d, status, r) {
                        data = d;
                        request = r;
                        var args = S.makeArray(arguments);
                        re.push(status);
                    },
                    error:function(data, status) {
                        var args = S.makeArray(arguments);
                        re.push(status);
                    },
                    complete:function(data, status) {
                        var args = S.makeArray(arguments);
                        re.push(status);
                    }
                });

            waits(500);

            runs(function() {
                expect(re.toString()).toBe(["timeout","timeout"].toString());
            });
        });

    });

});