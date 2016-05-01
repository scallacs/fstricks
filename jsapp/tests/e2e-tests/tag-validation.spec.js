var Application = require('./includes/pages.js');
var Util = require('./includes/util.js');
var VideoTagItem = require('./includes/video-tag-item.js');
var PlaylistItem = require('./includes/playlist-item.js');
var SearchBar = require('./includes/search-bar.js');

describe('Playlists: ', function () {

    var app = new Application();
    var util = new Util();
    var nav = app.topNav();


    beforeAll(function () {
        app.login();
    });

    // TODO
    describe('Go to validation page.', function () {
        
        beforeAll(function () {
            nav.navigateTo('startvalidation');
        });

        describe('Rate validation tricks', function () {

            it('Should be possible to rate invalid tag', function () {

            });
            it('Should be possible to skip tag', function () {

            });
            it('Should be possible to rate valid tag', function () {

            });
        });
    });



    describe('Go to empty validation page.', function () {
        
        beforeAll(function () {
            nav.navigateTo('startvalidation');
        });


    });

});