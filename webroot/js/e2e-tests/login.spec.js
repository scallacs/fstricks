describe('Account login', function() {

    var validCredential = {username: "stef@tricker.com", password: "test"};
    var invalidCredential = {username: "invalid@tricker.com", password: "test"};
    var form, submitBtn, inputEmail, inputPassword;

    beforeEach(function() {
        browser.get('http://localhost:8082/Tricker/#/login');
        form = element(by.id('LoginForm'));
        submitBtn = form.element(by.css('button[type="submit"]'));
        inputEmail = form.element(by.model("user.email"));
        inputPassword = form.element(by.model("user.password"));
    });
    
    function tryLogin(crendentials){
        inputEmail.sendKeys(crendentials.username);
        expect(inputEmail.isPresent()).toBe(true);
        inputPassword.sendKeys(crendentials.password);
        expect(inputPassword.isPresent()).toBe(true);
        return submitBtn.click().then(function() {
            browser.waitForAngular();
        });
    }

    it('should have the form', function() {
        expect(form.isPresent()).toBe(true);
    });

    it('btn should be enabled when form is correctly filled', function() {
       
        tryLogin(validCredential).then(function() {
            browser.waitForAngular();
            expect(browser.getLocationAbsUrl()).not.toContain('/login');
        });
    });

    it('user should be informe if its crendential are not valid', function() {
        tryLogin(invalidCredential).then(function() {
            browser.waitForAngular();
            expect(browser.getLocationAbsUrl()).toContain('/login');
        });
        
    });
    
    it('Navigation should not contain login and signup links anymore', function() {
        tryLogin(validCredential).then(function() {
            browser.waitForAngular();
            var loginLink = element(by.id('TopNav')).elment(by.css('a[ui-sref="login"]'));
            expect(loginLink.isPresent()).toBe(false);
            var signupLink = element(by.id('TopNav')).elment(by.css('a[ui-sref="signup"]'));
            expect(signupLink.isPresent()).toBe(false);
            expect(browser.getLocationAbsUrl()).toContain('/login');
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