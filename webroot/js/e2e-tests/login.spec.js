var Application = require('./pages.js');

describe('Account login', function() {

    var validCredential = {username: "stef@tricker.com", password: "test"};
    var invalidCredential = {username: "invalid@tricker.com", password: "test"};
    var form, submitBtn, inputEmail, inputPassword;

    var app = new Application();
    var nav = app.topNav();

    function initInputs() {
        form = element(by.id('LoginForm'));
        submitBtn = form.element(by.css('button[type="submit"]'));
        inputEmail = form.element(by.model("user.email"));
        inputPassword = form.element(by.model("user.password"));
    }

    function tryLogin(crendentials) {
        expect(form.isPresent()).toBe(true);
        inputEmail.sendKeys(crendentials.username);
        expect(inputEmail.isPresent()).toBe(true);
        inputPassword.sendKeys(crendentials.password);
        expect(inputPassword.isPresent()).toBe(true);
        expect(submitBtn.isEnabled()).toBe(true);
        return submitBtn.click();
    }

    beforeEach(function() {

    });


    describe('modal login: ', function() {
        it('should work', function() {
            app.getState('addvideo');
            browser.waitForAngular();
            initInputs();
            tryLogin(invalidCredential).then(function() {
                browser.waitForAngular();
                app.assertLocation('addvideo');
                expect(nav.isAuthNav()).toBe(false);
            });
        });
    });

    describe('with wrong credential', function() {
        beforeEach(function() {
            app.getState('login');
            browser.waitForAngular();
            initInputs();
            tryLogin(invalidCredential);
        });

        it('user cannot login with wrong credential', function() {
            app.assertLocation('login');
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

    describe('with good credential: ', function() {
        var loginPromise;
        beforeAll(function() {
            app.getState('login');
            initInputs();
            loginPromise = tryLogin(validCredential);
        });

        it('login should work and be redirected to another page', function() {
            loginPromise.then(function() {
                app.assertNotLocation('login');
            });
        });
        it('Navigation should not contain login and signup links anymore', function() {
            loginPromise.then(function() {
                browser.waitForAngular();
                expect(nav.isAuthNav()).toBe(false);
            });
        });
    });


    // TODO
//    it('should be able to login with facebook', function() {
//        element(by.css("button.btn-facebook")).click().then(function() {
//            browser.waitForAngular();
//            expect(browser.getLocationAbsUrl()).not.toContain('/login');
//        });
//    });   

});