angular.module('app.player', [
    'ui.router',
    'ngMessages',
    'app.core',
    'shared.youtube',
    'shared.vimeo',
    'shared',
    'angularUtils.directives.dirPagination',
    'infinite-scroll',
    'ui.bootstrap'
])
        .config(ConfigRoute)
        .controller('AddVideoController', AddVideoController)
        .controller('VideoTagPointsController', VideoTagPointsController)
        .controller('PlayerController', PlayerController)
        .controller('ViewVideoController', ViewVideoController)
        .controller('ViewTagController', ViewTagController)
        .controller('ViewSportController', ViewSportController)
        .controller('ViewRiderController', ViewRiderController)
        .controller('ViewSearchController', ViewSearchController)
        .controller('ViewRealizationController', ViewRealizationController)
        .controller('ViewPlaylistController', ViewPlaylistController);

ConfigRoute.$inject = ['$stateProvider'];
function ConfigRoute($stateProvider) {
    var baseUrl = 'js/src/player/partials/';

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
                url: '/sport/:sportName',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewSportController',
                        templateUrl: baseUrl + 'pick-video.html'
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
                }
            })
            .state('videoplayer.tag', {
                url: '/trick/:tagId',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewTagController',
                        templateUrl: baseUrl + 'pick-video.html'
                    }
                }
            })
            .state('videoplayer.realization', {
                url: '/realization/:videoTagId',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewRealizationController'
                    }
                }
            })
            .state('videoplayer.best', {
                url: '/best',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewSearchController',
                        templateUrl: baseUrl + 'pick-video.html'
                    }
                }
            })
            .state('videoplayer.playlist', {
                url: '/playlist?ids',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewPlaylistController',
                        templateUrl: baseUrl + 'pick-video.html'
                    }
                }
            })
            .state('videoplayer.search', {
                url: '/search?tagName',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewSearchController',
                        templateUrl: baseUrl + 'pick-video.html'
                    }
                }
            })
            .state('videoplayer.rider', {
                url: '/rider/:riderId',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewRiderController',
                        templateUrl: baseUrl + 'view-rider.html'
                    }
                }
            })
            .state('videoplayer.home', {
                url: '/',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewSearchController'
                    }
                }
            });
}

function AddVideoController($scope, ProviderVideoInfo, $state,
        VideoEntity, VideoTagEntity, ServerConfigEntity, SharedData) {

    var videosInCache = {};
    $scope.data = {provider_id: null, video_url: null};
    $scope.playerProviders = [];
    $scope.add = add;
    $scope.isFormLoading = false;
    $scope.videoPerPage = 5;
    $scope.totalVideos = 0; // todo
    $scope.isHistoryLoading = false;

    /**
     * false means we still didnt get respnse from the server
     * [] when received
     */
    $scope.recentVideos = false;

    $scope.pageChanged = function(newPage) {
        loadRecentlyTagged(newPage);
    };

    init();

    ServerConfigEntity.rules().then(function(rules) {
        $scope.playerProviders = rules.videos.provider_id.values;
        $scope.data.provider_id = rules.videos.provider_id.values[0].code;
        console.log("Default provider: " + rules.videos.provider_id.values[0].code);
    });

    function init() {
        SharedData.pageLoader(false);
        loadRecentlyTagged(1);
    }

    function add(data) {
        var providerInfo = ProviderVideoInfo.get(data.provider_id);
        if (providerInfo.extractIdFromUrl(data.video_url)) {
            data.video_url = providerInfo.extractIdFromUrl(data.video_url);
        }

        var promise = $scope.addVideoForm.submit(VideoEntity.addOrGet(data).$promise);
        promise.then(function(response) {
            if (response.success) {
                $state.go('addtag', {videoId: response.data.id});
            }
        });
    }

    function loadRecentlyTagged(page) {
        if (videosInCache[page]) {
            $scope.recentVideos = videosInCache[page];
            return;
        }
        $scope.isHistoryLoading = true;

        VideoTagEntity.recentlyTagged({page: page, total_number: (page <= 1 ? 1 : null)}, function(response) {
            if (angular.isDefined(response.total) && response.total !== null) {
                console.log("Set total video: " + response.total);
                $scope.totalVideos = response.total;
            }
            var items = response.data;
            angular.forEach(items, function(video) {
                var providerFactory = ProviderVideoInfo.get(video.provider_id);
                providerFactory
                        .create()
                        .addPart('snippet')
                        .setVideos([video.video_url])
                        .load()
                        .then(function(data) {
                            video.provider_data = providerFactory.createItem(data);
                        });
            });

            $scope.recentVideos = items;
            videosInCache[page] = items;
        }).$promise.finally(function() {
            $scope.isHistoryLoading = false;
        });
    }

}

function PlayerController($scope, PlayerData, $stateParams, $state) {
    PlayerData.showViewMode();
    PlayerData.showListTricks = true;

    $scope.$on('view-video-tag', function(event, tag) {
        event.stopPropagation();
//        $state.transitionTo($state.$current, {realization: tag.id}, {notify: false, reload: false});
        PlayerData.playVideoTag(tag);
    });

//    if (angular.isDefined($stateParams.realization)) {
//        console.log('Realization for player: ' + $stateParams.realization);
//    }
}

function ViewRealizationController(VideoTagData, $stateParams, PlayerData, SharedData, $state) {
    PlayerData.stop();
    PlayerData.showListTricks = false;
    VideoTagData.setFilters({video_tag_id: $stateParams.videoTagId});
    VideoTagData.startLoading()
            .then(function(results) {
                if (results.length === 1) {
                    PlayerData.playVideoTag(results[0]).then(function() {
                        SharedData.pageLoader(false);
                    });
                }
                else {
                    $state.go('notfound');
                }
            })
            .catch(function() {
                SharedData.pageLoader(false);
            });
}

function ViewTagController(VideoTagData, $stateParams, PlayerData, SharedData) {
    PlayerData.stop();
    PlayerData.showListTricks = true;
    VideoTagData.setFilters({tag_id: $stateParams.tagId, order: $stateParams.order});
    VideoTagData.startLoading().then(function(results) {
        if (results.length === 1) {
            PlayerData.showListTricks = false;
            PlayerData.playVideoTag(results[0]);
        }
    }).finally(function() {
        SharedData.pageLoader(false);
    });
}

function ViewSportController(VideoTagData, $stateParams, PlayerData, SharedData) {
//    console.log("View sport: " + $stateParams.sportName);
    PlayerData.stop();
    PlayerData.showListTricks = true;
    console.log("Viewing sport: " + $stateParams.sportName);
    VideoTagData.setFilters({sport_name: $stateParams.sportName, order: $stateParams.order});
    VideoTagData.startLoading().finally(function() {
        SharedData.pageLoader(false);
    });
}

function ViewRiderController($scope, VideoTagData, $stateParams, PlayerData, SharedData, RiderEntity) {
    $scope.rider = {id: $stateParams.riderId};

    PlayerData.stop();
    PlayerData.showListTricks = false;
    VideoTagData.setFilters({rider_id: $stateParams.riderId, order: $stateParams.order});
    VideoTagData.startLoading().finally(function() {
        SharedData.pageLoader(false);
    });

    RiderEntity.profile({id: $stateParams.riderId}, function(rider) {
        console.log(rider);
        $scope.rider = rider;
    });
}

function ViewSearchController(VideoTagData, PlayerData, SharedData, $stateParams) {
    PlayerData.stop();
    PlayerData.showListTricks = true;
//    console.log($stateParams);
    VideoTagData.reset();
    VideoTagData.setOrder($stateParams.order);
    VideoTagData.setFilter('tag_name', $stateParams.tagName);
    VideoTagData.startLoading().finally(function() {
        SharedData.pageLoader(false);
    });
}

function ViewPlaylistController(VideoTagData, PlayerData, SharedData, $stateParams) {
    PlayerData.stop();
    PlayerData.showListTricks = true;
    VideoTagData.reset();
    VideoTagData.setFilter('video_tag_ids', $stateParams.ids);
    VideoTagData.startLoading().finally(function() {
        SharedData.pageLoader(false);
    });
}


function ViewVideoController($scope, VideoTagData, PlayerData, $stateParams, SharedData) {

    PlayerData.stop();
    PlayerData.onCurrentTimeUpdate = onCurrentTimeUpdate;
    PlayerData.showListTricks = false;
    $scope.video = {
        id: $stateParams.videoId
    };

    VideoTagData.setFilters({video_id: $stateParams.videoId, order: 'begin_time'});
    VideoTagData.loadPage(1).then(autoPlayVideo).catch(function() {
        SharedData.pageLoader(false);
    });

    // TODO only for first page

    function onCurrentTimeUpdate(newVal) {
        PlayerData.updateCurrentTag(newVal);
    }

    function autoPlayVideo(response) {
        if (response.length > 0) {
            PlayerData.loadVideo({
                provider: response[0].provider_id,
                video_url: response[0].video_url
            }).then(function() {
                SharedData.pageLoader(false);
            });
            $scope.videoDuration = response[0].video_duration;
            $scope.videoTags = VideoTagData.data;
//                YoutubeVideoInfo.snippet(response[0].video_url, function(data) {
//                    //console.log(data);
//                    if (data !== null) {
//                        PlayerData.title = data.title;
//                    }
//                    else {
//                        PlayerData.title = '';
//                    }
//                });
        }
    }
}

function VideoTagPointsController($scope, VideoTagPointEntity) {
    $scope.up = up;
    $scope.down = down;

    function up(data) {
        data.user_rate = 'loading';
        VideoTagPointEntity.up({video_tag_id: data.id}, function(response) {
            if (data.user_rate === 'up') {
                return;
            }
            data.user_rate = 'up';
            if (response.success) {
                data.count_points = data.count_points + 1;
            }
        });
    }
    function down(data) {
        data.user_rate = 'loading';
        VideoTagPointEntity.down({video_tag_id: data.id}, function(response) {
            if (data.user_rate === 'down') {
                return;
            }
            data.user_rate = 'down';
            if (response.success) {
                data.count_points = data.count_points - 1;
            }
        });
    }
}