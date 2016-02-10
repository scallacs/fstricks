var Application = require('./pages.js');

describe('Add tag on video: ', function() {

    var validYoutubeId = "Ofc9hh0NWe8";
    var videoId = 45;
    var form, submitBtn;

    var application = new Application();
    
    beforeEach(function() {
        application.login().then(function() {
            browser.get('http://localhost:8082/Tricker/#/tag/add/' + videoId);
            expect(browser.getLocationAbsUrl()).toContain('/tag/add');
            form = element(by.id('FormAddVideoTag'));
            submitBtn = form.element(by.css('button[type="submit"]'));
        });
    });

    it('should display the form', function() {
        expect(form.isPresent()).toBe(true);
    });

    it('should controller player time with plus and minus button', function() {
        var plusBeginBtn = element(by.id('ButtonBeginTimePlus'));
        var minuBeginsBtn = element(by.id('ButtonBeginTimeMinus'));
        var beginTime = plusBeginBtn.getText();
        plusBeginBtn.click().then(function(){
            expect(plusBeginBtn.getText()).not.toEqual(beginTime);
        });
    });
    
});