describe('Protractor Demo App', function() {

    beforeEach(function() {
        browser.get('http://localhost:8082/Tricker/#');
    });

//    it('should have a title', function() {
//        expect(browser.getTitle()).toEqual('Freestyle Tricks');
//    });

    it('should have a container dic', function() {
        var form = element(by.id('container'));
        expect(form.isPresent()).toBe(true);
    });
    
});