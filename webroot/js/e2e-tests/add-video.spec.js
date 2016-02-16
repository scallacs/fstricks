var Application = require('./pages.js');

describe('Add video: ', function() {

    var validYoutubeId = "Ofc9hh0NWe8";
    var validYoutubeIdFull = "https://www.youtube.com/watch?v=Ur1Nrz23sSI";
    var form, submitBtn;

    var app = new Application();

    beforeEach(function() {
        app.login().then(function() {
            app.get('/video/add');
            brower.waitForAngular();
            form = element(by.id('FormAddVideo'));
            expect(form.isPresent()).toBe(true);
            submitBtn = form.element(by.css('button[type="submit"]'));
            expect(submitBtn.isPresent()).toBe(true);
        });
    });

    it('should trigger a video error when wrong id', function() {
        form.element(by.model('data.video_url')).sendKeys("wrongvideoid");
        //TODO
    });

    it('should redirect to add tag page for the video', function() {
        form.element(by.model('data.video_url')).sendKeys(validYoutubeId);
        expect(submitBtn.isEnabled()).toBe(true);
        submitBtn.click().then(function() {
            browser.waitForAngular();
            expect(browser.getLocationAbsUrl()).toContain('/tag/add');
        });
    });

//    it('should enable the add button if form is valid', function() {
//        browser.get('localhost:8082/Tricker/#/videos/add');
//        element(by.model('data.video_url')).sendKeys("wrongvideoid");
//        
//    });
});