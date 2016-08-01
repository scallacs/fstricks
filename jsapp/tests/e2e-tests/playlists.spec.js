var Application = require('./includes/pages.js');
var Util = require('./includes/util.js');
var VideoTagItem = require('./includes/video-tag-item.js');
var PlaylistItem = require('./includes/playlist-item.js');
var SearchBar = require('./includes/search-bar.js');

describe('Playlists: ', function() {

    var playlists = [
//        {
//            data: [
//                {model: 'playlist.title', value: "AAA"},
//                {model: 'playlist.description', value: "Invalid status"},
//                {model: 'playlist.status', value: 'b'}
//            ],
//            isValid: false,
//            success: false,
//            message: 'Should not be possible to create a playlist with an invalid status'
//        },
        {
            data: [
                {model: 'playlist.title', value: "A", clear: true},
                {model: 'playlist.description', value: "Too short", clear: true},
                {model: 'playlist.status', value: 'public'}
            ],
            isValid: false,
            success: false,
            message: 'Should not be possible to create a playlist with a title too short'
        },
        {
            data: [
                {model: 'playlist.title', value: "This title is damn too long for a playlist,that's why it's not possible to create this one otherwise it would not be very smart!!! Oh yep!", clear: true},
                {model: 'playlist.description', value: "Too long", clear: true},
                {model: 'playlist.status', value: 'public'}
            ],
            isValid: false,
            success: false,
            message: 'Should not be possible to create a playlist with a title too long'
        },
        {
            data: [
                {model: 'playlist.title', value: "My new playlist", clear: true},
                {model: 'playlist.description', value: "The description of my new playlist", clear: true},
                {model: 'playlist.status', value: 'private'}
            ],
            isValid: true,
            success: true,
            message: 'Should be possible create this playlist'
        }
    ];

    var app = new Application();
    var util = new Util();
    var nav = app.topNav();


    beforeAll(function() {
        app.login();
    });

    describe('Create a playlist ', function() {
        var form = null;

        beforeAll(function() {
            nav.changeSport('snowboard');
            var container = element.all(by.css('.card-video-tag')).get(0);
            var videoTagItem = new VideoTagItem(container);
            videoTagItem.openOptionLinkByCss('[ng-click^="addToPlaylist"]').then(function() {
                element(by.id('ButtonNewPlaylist')).click().then(function() {
                });
            });
            browser.waitForAngular();
            form = new util.form(element(by.id('FormAddPlaylist')));
        });

        // Add a new playlist
        playlists.forEach(function(playlist) {
            it(playlist.message, function() {
//                console.log('TESTING: ' + playlist.message);
//                console.log(playlist);
                form.fill(playlist.data);
                expect(form.isValid()).toBe(playlist.isValid);

                if (playlist.isValid) {
                    form.submit();
                }
            });
        });

    });

    describe('Edit playlist', function() {
        var btnEditInfo;

        beforeAll(function() {
            nav.navigateTo('manageplaylist');
            browser.waitForAngular();
            btnEditInfo = element(by.id('ButtonEditPlaylistInformation'));
        });

        it('Should be possible navigate to edit the playlist', function() {
            var playlistItem = new PlaylistItem(element.all(by.css('.playlist-edition-item')).get(0), 'edition');
            playlistItem.edit().then(function() {
                app.assertLocation('editplaylist');
            });
        });

        describe('when editing playlist: ', function() {

            it('Should be possible to edit informations', function() {
                expect(btnEditInfo.isDisplayed()).toBe(true);
                btnEditInfo.click().then(function() {
                    var formEditPlaylist = new util.form(element(by.id('FormAddPlaylist')));
                    formEditPlaylist.fill([
                        {model: 'playlist.title', value: 'New title', clear: true}
                    ]);

                    // Should be possible to save edition and go back to previous page
                    formEditPlaylist.submit().then(function() {
                        expect(btnEditInfo.isDisplayed()).toBe(true);
                    });
                });
            });

            it('Should be possible to cancel edition', function() {
                expect(btnEditInfo.isDisplayed()).toBe(true);
                btnEditInfo.click().then(function() {
                    var btnCancelEdit = element(by.id('FormAddPlaylist')).element(by.css('[ng-click="cancel()"]'));
                    btnCancelEdit.click().then(function() {
                        expect(btnEditInfo.isDisplayed()).toBe(true);
                    });
                });
            });

            it('Should be possible to remove a tricks', function() {
                var container = element.all(by.css('li[removable-item]')).get(0);
                var btnRemove = container.element(by.css('button.btn-remove-item'));
//                var promiseCountItems = element.all(by.css('li[removable-item]')).count();
//                promiseCountItems.then(function(nbInitial){
                btnRemove.click().then(function() {
//                        expect(element.all(by.css('li[removable-item]')).count()).toBe(nbInitial - 1);
                });
//                });
            });

            // TODO 
//            it('Should be possible to change order', function() {
//                browser.actions().
//                        mouseMove(startPoint.getWebElement(), {x: 0, y: 0}).
//                        mouseDown().
//                        mouseMove(endPoint.getWebElement()).
//                        mouseUp().
//                        perform();
//            });

        });
    });
    //    
    describe('Manage playlist', function() {

        beforeAll(function() {
            nav.navigateTo('manageplaylist');
            browser.waitForAngular();
        });

//        it('The playlist created should be displayed', function() {
//            var nbPlaylist = element.all(by.css('.playlist-edition-item')).count();
//            expect(nbPlaylist).toBe(5);
//        });

        it('Should be possible to delete a playlist', function() {
            var playlistItem = new PlaylistItem(element.all(by.css('.playlist-edition-item')).get(0), 'edition');
            playlistItem.remove().then(function() {
                browser.sleep(1000);
                browser.waitForAngular();
                var dialog = new util.modalDialog();
                dialog.ok().then(function() {
                    // TODO check that item has been removed
                });
            });
        });

        // Number of tags should be 1 for the new playlist => TODO
        // Should have the up/down button !

    });



    describe('View playlist', function() {
        // Search a playlist in the search bar
        var searchBar = SearchBar();

        it('Should be possible to search for a playlist in the search bar', function() {

            searchBar.sendKeys("amazing").then(function() {
                // TODO expect result number
                searchBar.pickChoice(1).then(function() {
                    
                });
            });
            
        });
    });





});