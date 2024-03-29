var Application = require('./includes/pages.js');
var Util = require('./includes/util.js');

// TODO REDO LOGIN!

describe('Account login', function() {

    var credentials = [
        {
            data: [
                {model: 'user.email', value: "stef@fstricks.com", clear: true},
                {model: 'user.password', value: "test", clear: true}
            ],
            success: true,
            message: 'Should be possible to log in with a valid account'
        },
        {
            data: [
                {model: 'user.email', value: "invalidemail@mail.com", clear: true},
                {model: 'user.password', value: "test", clear: true}
            ],
            success: false,
            message: 'Should NOT be possible to log in with an invalid mail'
        },
        {
            data: [
                {model: 'user.email', value: "stef@fstricks.com", clear: true},
                {model: 'user.password', value: "test2", clear: true}
            ],
            success: false,
            message: 'Should NOT be possible to log in with wrong password'
        }
    ];
    var form, submitBtn, inputEmail, inputPassword;

    var app = new Application();
    var util = new Util();
    var nav = app.topNav();

    function init() {
        form = new util.form(element(by.id('LoginForm')));
    }

    beforeEach(function() {
        app.get('/login');
        browser.waitForAngular();
    });

//    describe('navigating ', function() {
//
//        it('should be able to click on sigup link inside the form', function() {
//            var signupLink = form.element(by.css('a[ui-sref="signup"]'));
//            expect(signupLink.isPresent()).toBe(true);
//            signupLink.click(function() {
//                app.assertLocation('signup');
//            });
//        });
//
//    });


    describe('Fill in the form... ', function() {

        credentials.forEach(function(test) {
            it(test.message, function() {
                init();
                expect(form.isDisplayed()).toBe(true);
                form.fill(test.data);
                var loginPromise = form.submit();

                if (test.success) {
                    it(test.message, function() {
                        loginPromise.then(function() {
                            app.assertNotLocation('login');
                        });
                    });
                }
                else {
                    it(test.message, function() {
                        loginPromise.then(function() {
                            browser.waitForAngular();
                            expect(nav.isVisitorNav()).toBe(true);
                        });
                    });
                }
            });
        });

    });

    // TODO 
//    it('should be able to login with facebook', function() {
//        element(by.css("button.btn-facebook")).click().then(function() {
//            browser.driver.sleep(4000).then(function() {
//                browser.waitForAngular();
//                expect(browser.getLocationAbsUrl()).not.toContain('/login');
//            });
//        });
//    });

});