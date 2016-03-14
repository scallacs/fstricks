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

        self.setCategory = function(name){
            self._categoryInput.sendKeys(name);
            self._categoryInput.pickResult(0);
        };
        self.setRider = function(name){
            self._riderInput.sendKeys(name);
            self._riderInput.pickResult(0);
        };
        self.setTag = function(name){
            self._tagInput.sendKeys(name);
            self._tagInput.pickResult(0);
        };
        
        self.setEndTimeFromVideo = function(){
            return self._btnTime('ButtonEndTimeFromVideo');
        };
        self.setBeginTimeFromVideo = function(){
            return self._btnTime('ButtonBeginTimeFromVideo');
        };
        self.increaseEndTime = function(){
            return self._btnTime('ButtonEndTimePlus');
        };
        self.increaseBeginTime = function(){
            return self._btnTime('ButtonBeginTimePlus');
        };
        self.decreaseBeginTime = function(){
            return self._btnTime('ButtonBeginTimeMinus');
        };
        self.decreaseEndTime = function(){
            return self._btnTime('ButtonEndTimeMinus');
        };
        self._btnTime = function(id){
            expect(self._form.element(by.id(id)).isPresent()).toBe(true);
            return self._form.element(by.id(id)).click();
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