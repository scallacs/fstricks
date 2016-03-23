'use strict';

var Util = require('./util.js');

(function() {

    var util = new Util();

    function VideoTagItem(container) {
        expect(container.isPresent()).toBe(true);

        var self = this;
        self.container = container;

        self._dropdownOptions = new util.dropdown(self.container.element(by.css('.item-video-tag-options')));
        self._dropdownSharing = new util.dropdown(self.container.element(by.css('.item-video-tag-sharing')));
        self._title = self.container.element(by.css('.item-title'));
        expect(self._title.isPresent()).toBe(true);
        self._rider = self.container.element(by.css('.item-user-name'));
        
        
        self.openOptionLinkByState = function(state) {
            return self._dropdownOptions.open().then(function() {
                return self._dropdownOptions.menu().getLinkByState(state).click();
            });
        };
        self.openOptionLinkByCss = function(selector) {
            return self._dropdownOptions.open().then(function() {
                return self._dropdownOptions.menu().getLinkByCss(selector).click();
            });
        };
        
        self.openSharingLink = function(state) {
            return self._dropdownSharing.open().then(function() {
                return self._dropdownSharing.menu().getLinkByState(state).click();
            });
        };

        self.watch = function(){
            return self._title.click();
        };

        self.clickRider = function(){
            return self._rider.click();
        };
        
        self.upPoint = function(){
            return self._btnPoint('up');
            
        };
        self.downPoint = function(){
            return self._btnPoint('down');
        };
        self._btnPoint = function(action){
            var btn = self.container.element(by.css('div[up-down-points] .btn[ng-click^="'+action+'"]'));  
            expect(btn.isDisplayed()).toBe(true);
            return btn.click();
        };
        
        self.isPointBtnDisabled = function(){
            var btn = self.container.element(by.css('div[up-down-points] .btn[ng-click^="down"]'));  
            return btn.isDisabled();
        };
        
        self.getTimeRemaining = function(){
            var timeRemaining = self.container.element(by.css('.item-video-tag-remaining'));
            expect(timeRemaining.isDisplayed()).toBe(true);
            return timeRemaining.getText();
        };

    };

    module.exports = VideoTagItem;
}());