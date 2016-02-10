'use strict';

(function() {
    var Application = function() {
        var app = this;

        app.credential = {username: "stef@tricker.com", password: "test"};

        app.login = function() {
            browser.get('http://localhost:8082/Tricker/#/login');
            var loginForm = element(by.id('LoginForm'));
            var loginBtn = loginForm.element(by.css('button[type="submit"]'));
            loginForm.element(by.model("user.email")).sendKeys(app.credential.username);
            loginForm.element(by.model("user.password")).sendKeys(app.credential.password);
            var promise = loginBtn.click().then(function() {
                browser.waitForAngular();
                expect(browser.getLocationAbsUrl()).not.toContain('/login');
//                console.log("User logged in with email " + app.credential.username);
            });
            return promise;
        };

    };

    module.exports = function() {
        return new Application();
    };
}());