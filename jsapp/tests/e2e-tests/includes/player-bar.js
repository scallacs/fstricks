'use strict';

var Util = require('./util.js');

(function() {

    var util = new Util();

    function PlayerBar(container) {
        if (!container){
            container = element(by.css('.player-bar'));
        }
        expect(container.isPresent()).toBe(true);
        expect(container.isDisplayed()).toBe(true);
        var self = this;
        self._container = container;

        self.watchByIndex = function(index){
            var items = self._container.all(by.css('.player-bar-tag'));
            return items.count().then(function(val){
                expect(val > index).toBe(true);
                var item = items.get(index);
                browser.actions().mouseMove(item, {x: 0, y: 0}).perform();
                browser.sleep(1000);
                
                expect(item.isDisplayed()).toBe(true);
                return item.click();
            });
        };

    }

    module.exports = PlayerBar;
}());