'use strict';

var Util = require('./util.js');

(function() {

    var util = new Util();

    function PlayerContainer(container) {
        expect(container.isPresent()).toBe(true);
        var self = this;
        self._container = container;
        self._next = self._container.element(by.css('.player-next-trick'));
        expect(self._next.isPresent());
        self._prev = self._container.element(by.css('.player-prev-trick'));
        expect(self._prev.isPresent());
        self._iframe = self._container.element(by.css('.iframe-wrapper'));

        self.hasPrev = function(){
            return self._prev.isDisplayed();
        };
        
        self.hasNext = function(){
            return self._next.isDisplayed();
        };

        self.next = function(){
            expect(self._next.isPresent()).toBe(true);
            return self._next.click();
        };
        
        self.prev = function(){
            expect(self._prev.isPresent()).toBe(true);
            return self._prev.click();
        };
        
        self.hasVideo = function(){
            return self._iframe.isPresent();
        };
    };

    module.exports = PlayerContainer;
}());