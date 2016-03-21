var Application = require('./includes/pages.js');

describe('Rider profile: ', function() {

    var app = new Application();
    var searchBar = app.searchBar();

    beforeEach(function() {
        app.getState('home');
//        app.login().then(function() {
//
//        });
    });
    
    
    it('Should be possible to search for a rider and view his tricks', function(){
        searchBar.sendKeys('torstein hor');
        searchBar.pickChoice(1).then(function(){
            app.assertLocation('videoplayer.rider');
        });
    });


});