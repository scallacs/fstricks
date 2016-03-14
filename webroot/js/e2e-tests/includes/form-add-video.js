'use strict';

var Util = require('./util.js');

(function() {

    var util = new Util();

    function FormAddVideo(form) {
        expect(form.isPresent()).toBe(true);
        var self = this;
        self._form = form;
        self._submit = self._form.element(by.css('button[type="submit"]'));
        expect(self._submit.isPresent()).toBe(true);


        self.changeTab = function(name) {
            var tabLink = self._form.element(by.css('li[heading="' + name + '"] a'));
            expect(tabLink.isPresent()).toBe(true);
            return tabLink.click();
        };

        self.setUrl = function(url) {
            var input = self._form.element(by.model('data.video_url'));
            expect(input.isPresent()).toBe(true);
            input.clear();
            input.sendKeys(url);
        };

        self.submit = function() {
            return self._submit.click();
        };
        
        self.isValid = function() {
            return self._submit.isEnabled();
        };
    }

    module.exports = FormAddVideo;
}());