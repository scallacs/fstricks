var Application = require('./includes/pages.js');
var Util = require('./includes/util.js');
var VideoTagItem = require('./includes/video-tag-item.js');
var PlaylistItem = require('./includes/playlist-item.js');
var SearchBar = require('./includes/search-bar.js');
var TricksPicker = require('./includes/tricks-picker.js');

describe('Search filters: ', function () {

    var app = new Application();
    var util = new Util();
    var nav = app.topNav();
    var tricksPicker = new TricksPicker();


    beforeAll(function () {
        nav.changeSport('snowboard');
    });

    // TODO
    it('Append a key word filter:', function () {
        tricksPicker.setAppendFilter();
        tricksPicker
                .getSearchBar()
                .sendKeys('double')
                .pickChoice(0);
        expect(tricksPicker.countFilters()).equals(2);
    });
    
    it('Remove the new filter:', function () {
        tricksPicker
                .removeFilterByIndex(1);
        expect(tricksPicker.countFilters()).equals(1);
    });

    // TODO 
    it('Should not be possible to append two times the same filter:', function () {
        
    });
    // TODO 
    it('Should be possible to select two different rider/tags:', function () {
        
    });
    // TODO 
    it('Should not be possible remove the primary filter for the page', function () {
        
    });
    // TODO 
    it('Should not be possible to change the trick category when sport is selected', function () {
        
    });
});