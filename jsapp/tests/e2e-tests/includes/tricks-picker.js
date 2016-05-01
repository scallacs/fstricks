'use strict';

var Util = require('./util.js');
var SearchBar = require('./search-bar.js');

(function() {

    var util = new Util();

    function TricksPicker() {
        this._searchBar = new SearchBar();
        this._searchContext = element(by.css('.list-tricks .search-context ul'));
    }
    
    TricksPicker.prototype.setAppendFilter = setAppendFilter;
    TricksPicker.prototype.openMenu = openMenu;
    TricksPicker.prototype.getSearchBar = getSearchBar;
    TricksPicker.prototype.countFilters = countFilters;
    TricksPicker.prototype.removeFilterByIndex = removeFilterByIndex;
    TricksPicker.prototype.getSearchCardFilter = getSearchCardFilter;
    
    function setAppendFilter(){
        this.openMenu();
        var appendFilterBtn = element(by.id("AppendFilterBtn"));
        return appendFilterBtn.click();
    }
    
    function openMenu(){
        this._searchBar.focus();
    }
    
    function getSearchBar(){
        return this._searchBar;
    }
    
    function countFilters(){
        return this._searchContext.all(by.css('.search-card')).count();
    }
    
    function removeFilterByIndex(index){
        return this.getSearchCardFilter(index).click();
    }
    
    function getSearchCardFilter(index){
        return this._searchContext.all(by.css('.search-card')).eq(index);
    }
    
    module.exports = TricksPicker;
}());

