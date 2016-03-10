'use strict';

(function() {
    var Application = function() {
        var app = this;
        
        app.states = {
            login: '/login',
            sinup: '/signup',
            addvideo: '/video/add'
        };
        
        app.webroot = 'http://localhost:8082/Tricker/#';

        app.credential = {email: "stef@fstricks.com", password: "test"};

        app.get = function(name){
//            console.log("Loading location: " + app.webroot + name);
            browser.get(app.webroot + name);
        };
        app.getState = function(name){
//            console.log("Loading location: " + app.webroot + name);
            browser.get(app.webroot + app.states[name]);
        };
        
        app.assertLocation = function(state){
            expect(browser.getLocationAbsUrl()).toContain(app.states[state]);
        };
        app.assertNotLocation = function(state){
            expect(browser.getLocationAbsUrl()).not.toContain(app.states[state]);
        };

        app.login = function(credentials) {
            if (!credentials){
                credentials = app.credential;
            }
            app.get('/login');
            var loginForm = element(by.id('LoginForm'));
            var loginBtn = loginForm.element(by.css('button[type="submit"]'));
            loginForm.element(by.model("user.email")).sendKeys(credentials.email);
            loginForm.element(by.model("user.password")).sendKeys(credentials.password);
            var promise = loginBtn.click().then(function() {
                app.assertNotLocation('login');
            });
            return promise;
        };

        app.topNav = function(){
            return new Navigation();
        };
        app.footer = function(){
            return new Footer();
        };
    };

    var Navigation = function(){
        var nav = this;
        nav.topNav = element(by.id('TopNav'));
        
        nav.getLink = function(state, assert){
            var link = nav.topNav.element(by.css('a[ui-sref="' + state + '"]'));
            if (assert){
                expect(link.isPresent()).toBe(true);
            }
            return link;
        };
        
        nav.isAuthNav = function(){
            return (!nav.getLink("login").isPresent()) && !nav.getLink("signup").isPresent();
        };
        
    };
    
    var Footer = function(){
        var footer = this;
        
        footer.footer = element(by.css('footer'));
    }

    module.exports = function() {
        return new Application();
    };
}());