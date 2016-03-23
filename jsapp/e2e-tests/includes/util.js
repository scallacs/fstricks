'use strict';

(function() {

    var hasClass = function(element, cls) {
        return element.getAttribute('class').then(function(classes) {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };

    var Util = function() {

        var util = this;

        this.uiSelect = function(elem) {
            var self = this;

            self._input = elem;
            self._selectInput = self._input.element(by.css('.ui-select-search'));
            self._choices = self._input.all(by.css('.ui-select-choices .ui-select-choices-row-inner'));

            self.sendKeys = function(val) {
                self._input.click();
                self._selectInput.clear();
                return self._selectInput.sendKeys(val);
            };
            
            self.pickChoice = function(index){
                browser.waitForAngular();
                expect(self._choices.count()).not.toBeLessThan(index + 1);
                return self._choices.get(index).click();
            };
        };

        this.modalDialog = function() {
            var self = this;
            self._container = element(by.css('.modal-dialog'));
            expect(self._container.isPresent()).toBe(true);
            self._ok = element(by.css('[ng-click="ok()"]'));
            self._cancel = element(by.css('[ng-click="cancel()"]'));

            self.cancel = function() {
                return self._cancel.click();
            };
            
            self.ok = function() {
                return self._ok.click();
            };
        };

        this.menu = function(elem) {
            expect(elem.isPresent()).toBe(true);
            var self = this;
            self.container = elem;

            self.getLinkByState = function(name) {
                return self._getLink('[ui-sref^="' + name + '"]');
            };
            self.getLinkByHref = function(url) {
                return self._getLink('[href*="' + url + '"]');
            };
            self.getLinkByCss = function(selector) {
                return self._getLink(selector);
            };
            self._getLink = function(selector) {
                var link = self.container.element(by.css(selector));
                expect(link.isPresent()).toBe(true);
                return link;
            };
        };

        this.dropdown = function(elem) {
            var self = this;
            expect(elem.isPresent()).toBe(true);

            self.container = elem;
            self._link = self.container.element(by.css('[data-toggle="dropdown"]'));
            self._dropdown = self.container.element(by.css('.dropdown-menu'));
            expect(self._link.isPresent()).toBe(true);
            expect(self._dropdown.isPresent()).toBe(true);

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

                hasClass(self.container, 'open').then(function(isOpen) {
//                    console.log("Is open: " + isOpen);
                    if ((!isOpen && toOpen) || (isOpen && !toOpen)) {
                        self._link.click().then(function() {
                            expect(self._dropdown.isDisplayed()).toBe(true);
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

        this.form = function(form) {
            expect(form.isPresent()).toBe(true);
            var self = this;

            self._submitBtn = form.element(by.css('[type="submit"]'));
            expect(self._submitBtn.isPresent()).toBe(true);

            self.fill = function(data) {
                data.forEach(function(options) {
                    var elem = form.element(by.model(options.model));
                    expect(elem.isPresent()).toBe(true);
                    if (options.clear) {
                        elem.clear();
                    }
                    elem.sendKeys(options.value);
                });
            };

            self.read = function(model){
                return form.element(by.model(model)).getAttribute('value');
            };

            self.isValid = function() {
                return self._submitBtn.isEnabled();
            };
            
            self.isDisplayed = function(){
                return form.isDisplayed();
            };

            self.submit = function() {
                expect(self._submitBtn.isEnabled()).toBe(true);
                return self._submitBtn.click();
            };
        };
        
        this.tabs = function(elem){
            var self = this;
            expect(elem.isPresent()).toBe(true);
            self._elem = elem;
            
            self.change = function(heading){
                var tabLink = self._elem.element(by.css('li[heading="' + heading + '"] a'));
                expect(tabLink.isPresent()).toBe(true);
                return tabLink.click();
            };
        };
    };

    module.exports = function() {
        return new Util();
    };
}());