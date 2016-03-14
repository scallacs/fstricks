var Application = require('./includes/pages.js');
var FormAddVideo = require('./includes/form-add-video.js');
var FormAddTag = require('./includes/form-add-tag.js');

describe('Add tag on video: ', function() {
    var app = new Application();
    var nav = app.topNav();

    var validYoutubeId = "GF6Ct6B1yfM";
    var videoId = 45;
    var formAddVideoTag;

    beforeAll(function() {
        app.login().then(function() {
            nav.navigateTo('addvideo');
            browser.waitForAngular();
            var videoForm = new FormAddVideo(element(by.id('FormAddVideo')));
            videoForm.changeTab('Youtube').then(function(){
                videoForm.setUrl(validYoutubeId);
                videoForm.submit().then(function(){
                    formAddVideoTag = new FormAddTag(element(by.id('FormAddVideoTag')));
                });
            });
        });
    });

    it('should controller player time with plus and minus button', function() {
        formAddVideoTag.increaseBeginTime();
        formAddVideoTag.increaseEndTime();
        
        formAddVideoTag.setRider('Torstein');
        browser.driver.sleep(4000);
        
        formAddVideoTag.setCategory('snowboard kicker');
        browser.driver.sleep(4000);
        
        formAddVideoTag.setTag('double backflip');
        browser.driver.sleep(4000);
    });

});