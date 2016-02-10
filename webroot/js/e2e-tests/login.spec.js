describe('Account login', function() {

    var validCredential = {username: "stef@tricker.com", password: "test"};
    var invalidCredential = {username: "invalid@tricker.com", password: "test"};
    var form, submitBtn;

    beforeEach(function() {
        browser.get('http://localhost:8082/Tricker/#/login');
        form = element(by.id('LoginForm'));
        submitBtn = form.element(by.css('button[type="submit"]'));
    });

    it('should have the form', function() {
        expect(form.isPresent()).toBe(true);
    });

    it('btn should be enabled when form is correctly filled', function() {
       
        form.element(by.model("user.email")).sendKeys(validCredential.username);
        form.element(by.model("user.password")).sendKeys(validCredential.password);
        expect(submitBtn.isEnabled()).toBe(true);
        submitBtn.click().then(function() {
            browser.waitForAngular();
            expect(browser.getLocationAbsUrl()).not.toContain('/login');
        });
    });

    it('user should be informe if its crendential are not valid', function() {
   
        form.element(by.model("user.email")).sendKeys(invalidCredential.username);
        form.element(by.model("user.password")).sendKeys(invalidCredential.password);
        submitBtn.click().then(function() {
            browser.waitForAngular();
            expect(browser.getLocationAbsUrl()).toContain('/login');
        });
        
    });
    
    it('should be able to login with facebook', function() {
        element(by.css("button.btn-facebook")).click().then(function() {
            browser.waitForAngular();
            expect(browser.getLocationAbsUrl()).not.toContain('/login');
        });
    });

});