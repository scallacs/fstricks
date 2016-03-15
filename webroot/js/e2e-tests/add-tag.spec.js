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

    it('Should be possible to create a tag', function() {
        formAddVideoTag.increaseBeginTime();
        formAddVideoTag.decreaseBeginTime();
        
        formAddVideoTag.increaseEndTime();
        formAddVideoTag.decreaseEndTime();
        
        expect(formAddVideoTag.isValid()).toBe(false);
        
        formAddVideoTag.setRider('Torstein');
        expect(formAddVideoTag.isValid()).toBe(false);
        
        formAddVideoTag.setCategory('snowboard kicker');
        expect(formAddVideoTag.isValid()).toBe(false);
        
        formAddVideoTag.setTag('double backflip');
        expect(formAddVideoTag.isValid()).toBe(true);

        formAddVideoTag.submit().then(function(){
            browser.waitForAngular();
        });
        
    });

});