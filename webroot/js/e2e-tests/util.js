'use strict';

(function() {

    var hasClass = function(element, cls) {
        return element.getAttribute('class').then(function(classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };
    
    var Util = function() {

        var util = this;

        this.menu = function(elem) {
            var self = this;
            self.container = elem;

            self.getLinkByState = function(name) {
                var link = self.container.element(by.css('[ui-sref^="' + name + '"]'));
                expect(link.isPresent()).toBe(true);
                return link;
            };
            self.getLinkByHref = function(url) {
                var link = self.container.element(by.css('[href*="' + url + '"]'));
                expect(link.isPresent()).toBe(true);
                return link;
            };
        };

        this.dropdown = function(elem) {
            var self = this;
            expect(elem.isPresent()).toBe(true);

            self.container = elem;

            self.menu = function() {
                return new util.menu(self.container.element(by.css('.dropdown-menu')));
            };

            self.open = function() {
                return self._toggle(true);
            };

            self.close = function() {
                return self._toggle(false);
            };

            self._toggle = function(toOpen) {
//                console.log("Try to toggle... ");
                var deferred = protractor.promise.defer();
                var link = self.container.element(by.css('[data-toggle="dropdown"]'));
                var dropdown = self.container.element(by.css('.dropdown-menu'));
                expect(link.isPresent()).toBe(true);
                expect(dropdown.isPresent()).toBe(true);

                hasClass(self.container, 'open').then(function(isOpen) {
//                    console.log("Is open: " + isOpen);
                    if ((!isOpen && toOpen) || (isOpen  && !toOpen)) {
                        link.click().then(function() {
                            expect(dropdown.isDisplayed()).toBe(true);
                            deferred.fulfill();
                        });
                    }
                    else {
                        console.log("Dropdown is already openned");
                        deferred.fulfill();
                    }
                });

                return deferred.promise;
            };
        };

    };

    module.exports = function() {
        return new Util();
    };
}());