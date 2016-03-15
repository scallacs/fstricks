'use strict';

var Util = require('./util.js');

(function() {

    var util = new Util();

    function PlaylistItem(container, mode) {
        expect(container.isPresent()).toBe(true);
        var self = this;
        self.container = container;

        if (mode === 'edition') {
            self._edit = self.container.element(by.css('[ui-sref^="editplaylist"]'));
            expect(self._edit.isPresent()).toBe(true);
            
            self._remove = self.container.element(by.css('.btn-remove-item'));
            expect(self._remove.isPresent()).toBe(true);

            self.remove = function() {
                return self._remove.click();
            };

            self.edit = function() {
                return self._edit.click();
            };
        }
        else {
            
        }

        self._title = self.container.element(by.css('.playlist-heading'));
        expect(self._title.isPresent()).toBe(true);


        self.watch = function() {
            return self._title.click();
        };

        self.exists = function() {
            return container.isPresent();
        };

    }
    ;

    module.exports = PlaylistItem;
}());