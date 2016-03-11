var Application = require('./pages.js');

describe('Navigation', function() {

    var app = new Application();
    var nav = app.topNav();


//    it('should have a title', function() {
//        expect(browser.getTitle()).toEqual('Freestyle Tricks');
//    });
    describe(' as visitor: ', function() {
        beforeAll(function() {
            app.get('/');
            browser.waitForAngular();
        });

        it('should have a container div', function() {
            var container = element(by.id('container'));
            expect(container.isPresent()).toBe(true);
        });


        it("Should have a login button when user is not logged in", function() {
            expect(nav.getLink("login").isPresent()).toBe(true);
        });

        it("Should be possible to navigate to the log in page", function() {
            nav.getLink("login").click(function() {
                expect(app.hasLocation("login")).toBe(true);
            });
        });

        it("Should be possible to navigate to the home page", function() {
            var homeLink = nav.getHomeLink(true);
            homeLink.click().then(function() {

            });
        });

        // View full video
        // View all video for this trick 
    });

    describe(' as logged in user: ', function() {
        beforeAll(function() {
            app.login();
        });

        var nav = app.topNav();
        var managePlaylistLink = nav.getLink('manageplaylist', true);
        // Manage playlist
        managePlaylistLink.click().then(function() {

        });
    });
});