var Application = require('./pages.js');
var Util = require('./util.js');

describe('Navigation', function() {

    var app = new Application();
    var util = new Util();
    var nav = app.topNav();


//    it('should have a title', function() {
//        expect(browser.getTitle()).toEqual('Freestyle Tricks');
////    });
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

        it("Should be possible to navigate to sports pages", function() {
            nav.changeSport('snowboard').then(function() {
                app.assertLocation('videoplayer.sport');
            });
        });

        // View full video
        // View all video for this trick 
    });

    describe(' with a video tag item: ', function() {
        beforeAll(function(){
            app.getState('videoplayer.best');
            browser.waitForAngular();
        });
        
        // TODO 
        it(' should be possible to view the full video', function() {
            var videoTagItem = element.all(by.css('.item-video-tag')).get(0);
            expect(videoTagItem.isPresent()).toBe(true);
            var dropdown = new util.dropdown(videoTagItem.element(by.css('.item-video-tag-options')));
//                        console.log('feozk');
            dropdown.open().then(function() {
//                        console.log('Opening dropdown');
                dropdown.menu().getLinkByState('videoplayer.video').click().then(function() {
//                        console.log('OK OOOOOOK');
                    app.assertLocation('videoplayer.video');
                });
            });
            
                // videoplayer.tag

                // addToPlaylist
        });
    });

    describe(' as logged in user: ', function() {
        var nav;

        beforeAll(function() {
            app.login();
            browser.waitForAngular();
            nav = app.topNav();
        });

        it("Should be possible to navigate to manage playlist", function() {
            nav.openUserNav().then(function() {
                var managePlaylistLink = nav.getLink('manageplaylist', true);
                managePlaylistLink.click().then(function() {
                    app.assertUrl('playlist/manage');
                });
            });
        });
    });
});