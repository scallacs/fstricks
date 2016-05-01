'use strict';

var Util = require('./util.js');

(function() {

    var util = new Util();

    function SearchBar() {
        return new util.uiSelect(element(by.id('SearchBar')));
    }
    
    module.exports = SearchBar;
}());