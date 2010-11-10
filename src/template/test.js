describe('template', function(){
    var T = KISSY.Template, TA = it;

    describe("ģ���﷨", function(){

        describe('��������', function(){
            TA('Ӧ�ð�һ���ַ���ԭ�ⲻ�������', function(){
                expect(
                    T("a").render({})
                ).toBe("a");
            });

            TA('Ӧ�ðѶ���Ĳ���������Ⱦ�����ĵ�ǰ������', function(){
                expect(
                    T("<%=a%><%=b%>")
                        .render({
                            a:"a",
                            b:"b"
                        })
                ).toBe("ab");
            });

            TA('Ӧ���ܹ��ֶ�ָ���ڲ������������ڷ�ֹwith���������ӳ�', function(){
                expect(
                    T("<%=_ks_data.a%><%=_ks_data.b%>", "_ks_data")
                        .render({
                            a:"a",
                            b:"b"
                        })
                ).toBe("ab");
            });

            TA('Ӧ��֧�ֶ���Ķ��ֵ��÷�ʽ', function(){
                expect(
                    T("<%=data['a']%>")
                        .render({
                            a:"a"
                        })
                ).toBe("a");
            });
        });

        describe('ѭ��', function(){

            TA('Ӧ��֧����ͨ��forѭ��', function(){
                var templ = [
                    "<% for ( var i = 0, l = _ks_data.length; i < l; i++ ) { %>",
                    "<%= i %>:<%= _ks_data[i] %>,",
                    "<% } %>",
                ].join('');
                expect(
                    T(templ, "_ks_data")
                        .render(["a", "b"])
                ).toBe("0:a,1:b,");
            });

            TA('Ӧ��֧��for..in', function(){
                var templ = [
                    "<% for ( var i in _ks_data ) { %>",
                    "<%= i %>:<%= _ks_data[i] %>,",
                    "<% } %>",
                ].join('');
                expect(
                    T(templ, "_ks_data")
                        .render({
                            a:"A",
                            b:"B"
                        })
                ).toBe("a:A,b:B,");
            });

            TA('Ӧ��֧��while', function(){
                var templ = [
                    "<% var l = _ks_data.length; %>",
                    "<% while ( l-- ) { %>",
                    "<%= l %>:<%= _ks_data[l] %>,",
                    "<% } %>",
                ].join('');
                expect(
                    T(templ, "_ks_data")
                        .render(["a", "b"])
                ).toBe("1:b,0:a,");
            });

        });

        describe("�����ж�", function(){

            TA("Ӧ��֧��if/else if/else", function(){
                var templ = [
                    "<% if(a.show) { %>",
                    "<%= a.value %>",
                    "<% } %>",
                    "<% if(b.show) { %>",
                    "<%= b.value %>",
                    "<% } %>"
                ].join('');
                expect(
                    T(templ, "_ks_data")
                        .render({
                            a: {
                                show: false,
                                value: "a"
                            },
                            b: {
                                show: true,
                                value: "b"
                            }
                        })
                ).toBe("b");
            });

        });
    });

    describe('debug', function(){

    });

});
