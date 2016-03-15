'use strict';
(function() {

    var Util = require('./util.js');
    var util = new Util();

    var Application = function() {
        var app = this;

        app.states = {
            login: '/login',
            sinup: '/signup',
            addvideo: '/video/add',
            'videoplayer.best': '/player/best',
            'videoplayer.video': '/player/video',
            'videoplayer.sport': '/player/sport',
            'editplaylist': '/playlist/edit',
            'videoplayer.tag': '/player/trick',
            'videoplayer.rider': '/player/rider'
        };

        app.webroot = 'http://localhost:8082/Tricker/';

        app.credential = {email: "stef@fstricks.com", password: "test"};

        app.get = function(name) {
//            console.log("Loading location: " + app.webroot + name);
            browser.get(app.webroot + name);
        };
        app.getState = function(name) {
//            console.log("Loading location: " + app.webroot + name);
            browser.get(app.webroot + app.states[name]);
        };

        app.assertUrl = function(url) {
            expect(browser.getLocationAbsUrl()).toContain(url);
        };
        app.assertLocation = function(state) {
            expect(browser.getLocationAbsUrl()).toContain(app.states[state]);
        };
        app.assertNotLocation = function(state) {
            expect(browser.getLocationAbsUrl()).not.toContain(app.states[state]);
        };

        app.login = function(credentials) {
            if (!credentials) {
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

        app.topNav = function() {
            return new Navigation();
        };
        app.footer = function() {
            return new Footer();
        };

        app.searchBar = function(){
            return new util.uiSelect(element(by.id('SearchBar')));
        };
    };

    var Navigation = function() {
        var nav = this;

        nav._brandElement = element(by.id('BrandContainer'));
        nav._topNavElement = element(by.id('TopNav'));

        nav.getLink = function(state, assert) {
            return new ElementHelper(nav._topNavElement).linkByState(state, assert);
        };

        nav.isAuthNav = function() {
            return (!nav.getLink("login").isPresent()) && !nav.getLink("signup").isPresent();
        };

        nav.openUserNav = function() {
            var dropdown = new util.dropdown(element(by.id('UserNav')));
            return dropdown.open();
        };

        nav.getHomeLink = function(assert) {
            var homeLink = nav._brandElement.element(by.id('HomeLink'));
            if (assert) {
                expect(homeLink.isPresent()).toBe(true);
            }
            return homeLink;
        };

        nav.changeSport = function(name) {
            var deferred = protractor.promise.defer();
            var dropdown = new util.dropdown(element(by.id('SportsNav')));

            dropdown.open().then(function() {
                var link = dropdown.menu().getLinkByHref(name);
                expect(link.isPresent()).toBe(true);
                link.click().then(function() {
                    deferred.fulfill();
                });
            });
            return deferred.promise;
        };
        
        nav.navigateTo = function(state){
            return nav.openUserNav().then(function() {
                var link = nav.getLink(state, true);
                return link.click();
            });
        };

    };

    var Footer = function() {
        var footer = this;

        footer.footer = element(by.css('footer'));
    };


    var ElementHelper = function(elem) {
        var self = this;

        self.container = elem;

        expect(elem.isPresent()).toBe(true);

        self.linkByState = function(state, assert) {
            // TODO begin by state
            var link = elem.element(by.css('[ui-sref^="' + state + '"]'));
            if (assert) {
                expect(link.isPresent()).toBe(true);
            }
            return link;
        };
    };

    module.exports = function() {
        return new Application();
    };
}());