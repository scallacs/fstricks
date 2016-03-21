var Application = require('./includes/pages.js');
var Util = require('./includes/util.js');
var VideoTagItem = require('./includes/video-tag-item.js');
var PlayerContainer = require('./includes/player-container.js');

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

        it("Should be possible to navigate to sports pages", function() {
            nav.changeSport('snowboard').then(function() {
                app.assertLocation('videoplayer.sport');
            });
        });

        // View full video
        // View all video for this trick 
    });

    describe(' with a video tag item: ', function() {
        var videoTagItem;
        
        beforeEach(function(){
            app.getState('videoplayer.best');
            browser.waitForAngular();
            videoTagItem = new VideoTagItem(element.all(by.css('.item-video-tag')).get(0));
        });
        
        it(' should be possible to view trick', function() {
            videoTagItem.watch().then(function(){
                expect(element(by.css('.table-current-trick')).isPresent()).toBe(true);
            });
        });
        
        it(' should be possible to view the full video', function() {
            videoTagItem.openOptionLinkByState('videoplayer.video').then(function(){
                app.assertLocation('videoplayer.video');
            });
        });
        it(' should be possible to view all video for this', function() {
            videoTagItem.openOptionLinkByState('videoplayer.tag').then(function(){
                app.assertLocation('videoplayer.tag');
            });
        });
        it(' should be possible to view rider', function() {
            videoTagItem.clickRider().then(function(){
                app.assertLocation('videoplayer.rider');
            });
        });
    });

    describe('Watching videos ', function(){
        
        var videoTagItem = null;
        var playerContainer = null;
        beforeAll(function(){
            app.getState('videoplayer.best');
            browser.waitForAngular();
            videoTagItem = new VideoTagItem(element.all(by.css('.item-video-tag')).get(0));
            videoTagItem.watch().then(function(){
                playerContainer = new PlayerContainer(element(by.css('.player-container')));
            });
        });
        
        it('Should NOT be possible to play prev trick when fist element selected', function(){
            expect(playerContainer.hasPrev()).toBe(false);
        });
        it('Should be possible to play next trick', function(){
            playerContainer.next();
        });
        it('Should be possible to play previous trick', function(){
            playerContainer.prev();
        });
//        it('Should NOT be possible to play next trick when last element selected', function(){
//            
//        });
    });

    describe(' as logged in user: ', function() {
        var nav;

        beforeAll(function() {
            app.login();
            browser.waitForAngular();
            nav = app.topNav();
        });

        it("Should be possible to navigate to manage playlist", function() {
            
            nav.navigateTo('manageplaylist').then(function(){
                app.assertUrl('playlist/manage');
            });
        });
    });
});