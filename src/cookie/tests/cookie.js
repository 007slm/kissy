describe('cookie', function() {

    var Cookie = KISSY.Cookie,
        get = Cookie.get,
        set = Cookie.set;

    describe('get', function() {
        document.cookie = '_ks_test_1=1';
        document.cookie = '_ks_test_2';
        document.cookie = '_ks_test_3=';

        it('should return the cookie value for the given name', function() {
            expect(get('_ks_test_1')).toBe('1');
            expect(get('_ks_test_2')).toBe('');
            expect(get('_ks_test_3')).toBe('');
        });

        it('should return undefined for non-existing name', function() {
            expect(get('_ks_test_none')).toBe(undefined);
            expect(get(true)).toBe(undefined);
            expect(get({})).toBe(undefined);
            expect(get(null)).toBe(undefined);
        });
    });

    describe('set', function() {

        it('should set a cookie with a given name and value', function() {
            set('_ks_test_11', 'xx');
            expect(get('_ks_test_11')).toBe('xx');

            set('_ks_test_12', 'xx', 0);
            expect(get('_ks_test_12')).toBe(undefined);

            set('_ks_test_13', '1', new Date(2099, 1, 1), '', '/');
            set('_ks_test_13', '2', new Date(2099, 1, 1), '', '/');
            expect(get('_ks_test_13')).toBe('2');
        });
    });

    describe('remove', function() {

        it('should remove a cookie from the machine', function() {
            set('_ks_test_21', 'xx');
            Cookie.remove('_ks_test_21');
            expect(get('_ks_test_21')).toBe(undefined);

            set('_ks_test_22', 'xx', new Date(2099, 1, 1), '', '/');
            Cookie.remove('_ks_test_22', '', '/');
            expect(get('_ks_test_22')).toBe(undefined);
        });
    });
});
