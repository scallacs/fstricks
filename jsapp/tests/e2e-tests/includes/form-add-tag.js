'use strict';

var Util = require('./util.js');

(function() {

    var util = new Util();

    function FormAddTag(form) {
        expect(form.isPresent()).toBe(true);
        var self = this;
        self._form = form;
        self._submit = self._form.element(by.css('button[type="submit"]'));
        expect(self._submit.isPresent()).toBe(true);

        self._categoryInput = new util.uiSelect(self._form.element(by.css('.ui-select-category')));
        self._riderInput = new util.uiSelect(self._form.element(by.css('.ui-select-rider')));
        self._tagInput = new util.uiSelect(self._form.element(by.css('.ui-select-tag')));
        self._buttonShowRiderForm = self._form.element(by.id('ButtonShowRiderForm'));
        self._buttonCancelChanged = self._form.element(by.css('[ng-click^="cancel"]'));
        self._buttonRemove = self._form.element(by.css('[ng-click^="deleteTag"]'));

        self.expectHasChanged = function(){
            expect(self._buttonCancelChanged.isDisplayed()).toBe(true);
            expect(self._buttonCancelChanged.isEnabled()).toBe(true);
        };
        
        self.isEditionForm = function(){
//            expect(self._buttonRemove.isPresent()).toBe(true);
            return self._buttonRemove.isDisplayed();
        };

        self.expectFeedbackSuccess =  function(){
            expect(self._form.all(by.css('.has-error')).count()).toBeLessThan(1);
            // TODO improve
        };

        self.setCategory = function(name) {
            self._categoryInput.sendKeys(name);
            browser.waitForAngular();
            return self._categoryInput.pickChoice(0);
        };
        
        self.setRider = function(name) {
            self._riderInput.sendKeys(name);
            browser.waitForAngular();
            return self._riderInput.pickChoice(0);
        };
        
        self.setTag = function(name) {
            self._tagInput.sendKeys(name);
            browser.waitForAngular();
            return self._tagInput.pickChoice(0);
        };

        self.showRiderForm = function() {
            expect(self._buttonShowRiderForm.isPresent()).toBe(true);
            return self._buttonShowRiderForm.click();
        };
        
        self.remove = function(){
            var btn = element(by.css('button[name="button_remove"]'));
            expect(btn.isPresent()).toBe(true);
            return btn.click();
        };

        self.addNewTag = function() {
            return element(by.css('.btn-add-tag')).click();
        };

        self.setEndTimeFromVideo = function() {
            return self._btnTime('ButtonEndTimeFromVideo');
        };
        self.setBeginTimeFromVideo = function() {
            return self._btnTime('ButtonBeginTimeFromVideo');
        };
        self.increaseEndTime = function() {
            return self._btnTime('ButtonEndTimePlus');
        };
        self.increaseBeginTime = function() {
            return self._btnTime('ButtonBeginTimePlus');
        };
        self.decreaseBeginTime = function() {
            return self._btnTime('ButtonBeginTimeMinus');
        };
        self.decreaseEndTime = function() {
            return self._btnTime('ButtonEndTimeMinus');
        };
        self._btnTime = function(id) {
            expect(self._form.element(by.id(id)).isPresent()).toBe(true);
            return self._form.element(by.id(id)).click();
        };

        self.continueEditing = function(){
            var btn = element(by.css('.add-tag-feedback')).element(by.css('.btn[ng-click^="editVideoTag"]'));
            expect(btn.isDisplayed()).toBe(true);
            return btn.click();
        };
        self.continueAddTag = function(){
            var btn = element(by.css('.add-tag-feedback')).element(by.css('.btn[ng-click^="addNewTag"]'));
            expect(btn.isDisplayed()).toBe(true);
            return btn.click();
        };

        self.submit = function() {
            return self._submit.click();
        };

        self.isValid = function() {
            return self._submit.isEnabled();
        };
    }

    module.exports = FormAddTag;
}());