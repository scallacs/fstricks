var Application = require('./pages.js');

describe('Test navigating', function() {

    var app = new Application();
    var nav = app.topNav();
    
    beforeEach(function() {
        browser.get(app.webroot);
    });

//    it('should have a title', function() {
//        expect(browser.getTitle()).toEqual('Freestyle Tricks');
//    });

    it('should have a container dic', function() {
        var form = element(by.id('container'));
        expect(form.isPresent()).toBe(true);
    });
    
    
    it("Should have a login button when user is not logged in", function(){
        expect(nav.getLink("login").isPresent()).toBe(true);
    });
    it("Should be possible to navigate to the log in page", function(){
        nav.getLink("login").click(function(){
            expect(app.hasLocation("login")).toBe(true);
        });
    });
});