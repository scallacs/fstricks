var Application = require('./pages.js');

describe('Add video: ', function() {

    //var tabIndex = ['Youtube', 'Vimeo'];

    var tests = [
        {
            url: "Ofc9hh0NWe8",
            provider: 'Youtube',
            success: true,
            message: 'Should be ok'
        },
        {
            url: "https://www.youtube.com/watch?v=Ur1Nrz23sSI",
            provider: 'Youtube',
            success: true,
            message: 'Should be ok'
        },
        {
            url: "invalidYoutubeId",
            provider: 'Youtube',
            success: false,
            message: 'Should NOT be ok'
        },
        {
            url: "invalidVimeoId",
            provider: 'Vimeo',
            success: false,
            message: 'Should NOT be ok'
        },
        {
            url: "97762449",
            provider: 'Vimeo',
            success: true,
            message: 'Should be ok'
        }
    ];

    var form, submitBtn;

    var app = new Application();

    beforeAll(function() {
        app.login().then(function() {

        });
    });
    
    beforeEach(function() {
        app.get('/video/add');
        browser.waitForAngular();
        form = element(by.id('FormAddVideo'));
        expect(form.isPresent()).toBe(true);
        submitBtn = form.element(by.css('button[type="submit"]'));
        expect(submitBtn.isPresent()).toBe(true);
    });

    tests.forEach(function(test){
        it(test.message, function() {
//            console.log('Testing link: ' + test.url);
            // Selecting the tab:
            var tabLink = form.element(by.css('li[heading="' + test.provider + '"] a'));
            expect(tabLink.isPresent()).toBe(true);
            tabLink.click().then(function() {
                form.element(by.model('data.video_url')).sendKeys(test.url);

                expect(submitBtn.isEnabled()).toBe(true);
                submitBtn.click().then(function() {
                    if (test.success) {
                        expect(browser.getLocationAbsUrl()).toContain('/tag/add');
                    }
                    else {
                        expect(browser.getLocationAbsUrl()).toContain('/video/add');
                    }
                });
            });

        });
    });

});