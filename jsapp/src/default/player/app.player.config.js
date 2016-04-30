angular.module('app.player')
        .config(ConfigRoute)
        .run(Run);

Run.$inject = ['$rootScope', 'VideoTagData', 'PlayerData'];
function Run($rootScope, VideoTagData, PlayerData) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        if (toState.name.startsWith('videoplayer')){
            VideoTagData.reset();
        }
//        console.log(toState);
        if (toState.player){
            PlayerData.stop();
            PlayerData.showViewMode();
            if (toState.player.onStart){
                toState.player.onStart(PlayerData);
            }
        }
    });

}

ConfigRoute.$inject = ['$stateProvider'];
function ConfigRoute($stateProvider) {
    var baseUrl = __PathConfig__.template + '/player/partials/';

    $stateProvider
            .state('addvideo', {
                url: '/video/add',
                views: {
                    viewNavRight: {
                        template: ''//<h2 class="page-title">Add a video</h2>'
                    },
                    '': {
                        templateUrl: baseUrl + 'add-video.html',
                        controller: 'AddVideoController'
                    }
                },
                data: {
                    requireLogin: true,
                    pageLoader: false
                }
            })
            .state('mytricks', {
                url: '/my-tricks',
                controller: 'MyTricksController',
                templateUrl: baseUrl + 'my-tricks.html',
                data: {
                    requireLogin: true,
                    pageLoader: true
                }
            })
            .state('manageplaylist', {
                url: '/playlist/manage',
                controller: 'ManagePlaylistController',
                templateUrl: baseUrl + 'playlist-manage.html',
                data: {
                    requireLogin: true,
                    pageLoader: true
                }
            })
            .state('editplaylist', {
                url: '/playlist/edit/:playlistId',
                controller: 'EditPlaylistController',
                templateUrl: baseUrl + 'playlist-edit.html',
                data: {
                    requireLogin: true,
                    pageLoader: true
                }
            })
            .state('startvalidation', {
                url: '/start-validation',
                templateUrl: baseUrl + 'start-validation.html',
                controller: 'StartValidationController',
                data: {
                    requireLogin: true,
                    pageLoader: true
                }
            })
            .state('videoplayer', {
                url: '/player?order',
                views: {
                    viewNavRight: {
                        'template': '<div player-nav></div>'
                    },
                    '': {
                        templateUrl: baseUrl + 'player.html',
                        controller: 'PlayerController'
                    }
                },
                data: {
                    requireLogin: false,
                    pageLoader: true
                }
            })
            .state('videoplayer.sport', {
                url: '/bestof/:sportSlug?category&q',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewSportController',
                        templateUrl: baseUrl + 'view-sport.html'
                    }
                },
                player: {
                    onStart: function(PlayerData){
                        PlayerData.setPlayMode('tag');
                        PlayerData.showTricksMenu(true);
                    }
                }
            })
            .state('videoplayer.video', {
                url: '/video/:videoId',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewVideoController',
                        templateUrl: baseUrl + 'view-video.html'
                    }
                },
                // TODO
                player: {
                    onStart: function(PlayerData){
                        PlayerData.showTricksMenu(false);
                        PlayerData.setPlayMode('video');
                        PlayerData.stopLooping();
                    }
                }
            })
            .state('videoplayer.tag', {
                url: '/trick/:tagSlug',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewTagController',
                        templateUrl: baseUrl + 'view-tag.html'
                    }
                },
                player: {
                    onStart: function(PlayerData){
                        PlayerData.setPlayMode('tag');
                        PlayerData.showTricksMenu(true);
                    }
                }
            })
            .state('videoplayer.realization', {
                url: '/performance/:videoTagId',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewRealizationController',
                        template: '<view-title>Trick {{videoTag.tag.name}} {{videoTag.category.name}} {{videoTag.category.sport.name}} \n\
                                    by {{videoTag.rider.display_name}}\n\
                                    {{videoTag.tag.category.name}} {{videoTag.tag.category.sport.name}}</view-title>'
                    }
                },
                player: {
                    onStart: function(PlayerData){
                        PlayerData.showTricksMenu(false);
                        PlayerData.setPlayMode('tag');
                    }
                }
            })
            .state('videoplayer.validation', {
                url: '/validate/:sportSlug',
                views: {
                    videoPlayerExtra: {
                        templateUrl: baseUrl + 'view-validation.html',
                        controller: 'ViewValidationController'
                    }
                },
                player: {
                    onStart: function(PlayerData){
                        PlayerData.setPlayMode('tag');
                        PlayerData.showTricksMenu(false);
                        PlayerData.showValidationMode();
                    }
                }
            })
            .state('playlist', {
                url: '/playlist/:playlistId?ids',
                views: {
                    viewNavRight: {
                        'template': '<div player-nav></div>'
                    },
                    '': {
                        controller: 'ViewPlaylistController',
                        templateUrl: baseUrl + 'playlist-view.html',
                    }
                },
                data: {
                    pageLoader: true
                },
                player: {
                    onStart: function(PlayerData){
                        PlayerData.showTricksMenu(false);
                        PlayerData.setPlayMode('playlist');
                    }
                }
            })
            .state('playlist.play', {
                url: '/play',
                controller: 'PlaylistPlayerController',
                templateUrl: baseUrl + 'player.html',
                data: {
                    pageLoader: true
                }
            })
            .state('videoplayer.rider', {
                url: '/rider/:riderId',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewRiderController',
                        templateUrl: baseUrl + 'view-rider.html'
                    }
                },
                player: {
                    onStart: function(PlayerData){
                        PlayerData.setPlayMode('tag');
                        PlayerData.showTricksMenu(false);
                    }
                }
            });

//            .state('rider', {
//                url: '/rider/:riderId',
//                views: {
//                    viewNavRight: {
//                        'template': '<div player-nav></div>'
//                    },
//                    '': {
//                        controller: 'ViewRiderController',
//                        templateUrl: baseUrl + 'view-rider.html'
//                    }
//                },
//                data: {
//                    pageLoader: true
//                }
//            })
//            .state('rider.play', {
//                url: '/play',
//                controller: 'RiderPlayerController',
//                templateUrl: baseUrl + 'player.html',
//                data: {
//                    pageLoader: true
//                }
//            })
}

