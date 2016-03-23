var Application = require('./includes/pages.js');
var FormAddVideo = require('./includes/form-add-video.js');

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
        app.login();
    });
    
    beforeEach(function() {
        app.get('/video/add');
        browser.waitForAngular();
        form = new FormAddVideo(element(by.id('FormAddVideo')));
    });

    tests.forEach(function(test){
        it(test.message, function() {
//            console.log('Testing link: ' + test.url);
            // Selecting the tab:
            form.changeTab(test.provider).click().then(function() {
                form.setUrl(test.url);
                expect(form.isValid()).toBe(true);
                
                form.submit().then(function() {
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