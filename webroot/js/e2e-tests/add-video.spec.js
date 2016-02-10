var Application = require('./pages.js');

describe('Add video: ', function() {

    var validYoutubeId = "Ofc9hh0NWe8";
    var form, submitBtn;

    var application = new Application();

    beforeEach(function() {
        application.login().then(function() {
            browser.get('http://localhost:8082/Tricker/#/video/add');
            expect(browser.getLocationAbsUrl()).toContain('/video/add');
            form = element(by.id('FormAddVideo'));
            submitBtn = form.element(by.css('button[type="submit"]'));
        });
    });

//    it('should have a title', function() {
//        expect(browser.getTitle()).toEqual('Freestyle Tricks');
//    });

    it('should display the form', function() {
        expect(form.isPresent()).toBe(true);
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