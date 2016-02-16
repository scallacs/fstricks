var Application = require('./pages.js');

describe('Account signup', function() {

    var app = new Application();
    var nav = app.topNav();

    var validCredential = {
        username: "newuservalid",
        email: "stef@tricker34.com",
        password: "testtest"
    };
    
    var invalidCredential = {
        username: "scallacs",
        email: "stef@tricker.com",
        password: "testtest"
    };
    var form, submitBtn;

    function fillForm(data, samePassword) {
        form.element(by.model("user.username")).sendKeys(data.username);
        form.element(by.model("user.email")).sendKeys(data.email);
        form.element(by.model("user.password")).sendKeys(data.password);
        form.element(by.model("confirmPassword")).sendKeys(samePassword ? data.password : data.password + "A");
    }

    function init() {
        app.get('/signup');
        form = element(by.id('FormSignup'));
        submitBtn = form.element(by.css('button[type="submit"]'));
    }

    describe('Elements', function() {
        beforeEach(function() {
            init();
        });

        it('should have the form', function() {
            expect(form.isPresent()).toBe(true);
        });
    });



    describe('with invalid credential', function() {

        beforeEach(function() {
            init();
        });

        it('submit button should not be enable if the password do not match', function() {
            fillForm(validCredential, false);
            expect(submitBtn.isEnabled()).toBe(false);
        });

        it('should not be able to signup if username is already used', function() {
            fillForm(invalidCredential, true);
            browser.waitForAngular();
            expect(submitBtn.isEnabled()).toBe(false);
        });

    });

    describe('with valid credential', function() {

        beforeAll(function() {
            init();
            fillForm(validCredential, true);
        });

        // @warning validCredential user must not be set otherwise it will fail
        it('submit button should be enabled', function() {
            expect(submitBtn.isEnabled()).toBe(true);
        });

        it('click on submit button should signup and redirect to another page', function() {
            submitBtn.click().then(function() {
                expect(browser.getLocationAbsUrl()).not.toContain('/signup');
            });
        });
    });



});