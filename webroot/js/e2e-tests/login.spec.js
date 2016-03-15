var Application = require('./includes/pages.js');

// TODO REDO LOGIN!

describe('Account login', function() {

    var credentials = [
        {
            data: {email: "stef@fstricks.com", password: "test"},
            success: true,
            message: 'Should be possible to log in with a valid account'
        },
        {
            data: {email: "invalidemail@mail.com", password: "test"},
            success: false,
            message: 'Should NOT be possible to log in with an invalid mail'
        },
        {
            data: {email: "stef@fstricks.com", password: "test2"},
            success: false,
            message: 'Should NOT be possible to log in with wrong password'
        }
    ];
    var form, submitBtn, inputEmail, inputPassword;

    var app = new Application();
    var nav = app.topNav();

    function init() {
        form = element(by.id('LoginForm'));
        submitBtn = form.element(by.css('button[type="submit"]'));
        inputEmail = form.element(by.model("user.email"));
        inputPassword = form.element(by.model("user.password"));
    }

    function tryLogin(crendentials) {
        expect(form.isPresent()).toBe(true);
        inputEmail.sendKeys(crendentials.email);
        expect(inputEmail.isPresent()).toBe(true);
        inputPassword.sendKeys(crendentials.password);
        expect(inputPassword.isPresent()).toBe(true);
        expect(submitBtn.isEnabled()).toBe(true);
        return submitBtn.click();
    }

    beforeEach(function() {
        app.get('/login');
        browser.waitForAngular();
        init();
    });
    describe('Elements', function() {

        it('should have the form', function() {
            expect(form.isPresent()).toBe(true);
        });
    });

    describe('navigating ', function() {

        it('should be able to click on sigup link inside the form', function() {
            var signupLink = form.element(by.css('a[ui-sref="signup"]'));
            expect(signupLink.isPresent()).toBe(true);
            signupLink.click(function() {
                app.assertLocation('signup');
            });
        });

    });


    describe('Fill in the form... ', function() {

        credentials.forEach(function(test) {
            it(test.message, function() {
                tryLogin(test.data);

                expect(submitBtn.isEnabled()).toBe(true);
                var loginPromise = submitBtn.click();

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
                            expect(nav.isAuthNav()).toBe(false);
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