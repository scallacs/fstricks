describe('Account signup', function() {

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

    beforeEach(function() {
        browser.get('http://localhost:8082/Tricker/#/signup');
        form = element(by.id('FormSignup'));
        submitBtn = form.element(by.css('button[type="submit"]'));
    });

    it('should have the form', function() {
        expect(form.isPresent()).toBe(true);
    });

    it('should be enabled when form is correctly filled', function() {
        fillForm(validCredential, true);
        expect(submitBtn.isEnabled()).toBe(true);
    });

    it('should not be enable if the password do not match', function() {
        fillForm(validCredential, false);
        expect(submitBtn.isEnabled()).toBe(false);
    });

    it('should be able to signup', function() {
        fillForm(validCredential, true);
        submitBtn.click().then(function() {
            expect(submitBtn.isEnabled()).toBe(true);
            browser.waitForAngular();
            expect(browser.getLocationAbsUrl()).not.toContain('/signup');
        });
    });


    it('should not be able to signup if username is already used', function() {
        fillForm(invalidCredential, true);
        browser.waitForAngular();
        expect(submitBtn.isEnabled()).toBe(false);
    });

});