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
        .controller('ViewValidationController', ViewValidationController)
        .controller('ViewPlaylistController', ViewPlaylistController)
        .controller('DashboardController', DashboardController);

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
            .state('dashboard', {
                url: '/dashboard',
                controller: 'DashboardController',
                templateUrl: baseUrl + 'dashboard.html',
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
            .state('videoplayer.validation', {
                url: '/validation',
                views: {
                    videoPlayerExtra: {
                        templateUrl: baseUrl + 'view-validation.html',
                        controller: 'ViewValidationController'
                    },
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

function DashboardController($scope, VideoTagLoader, SharedData, $state, AuthenticationService) {

    $scope.workspaces = [
        {id: 'pending', name: "Pendings", active: true, filters: {status: 'pending', order: 'modified'}},
        {id: 'rejected', name: "Rejected", active: false, filters: {status: 'rejected,duplicate', order: 'modified'}},
        {id: 'official', name: "Officials", active: false, filters: {status: 'validated', order: 'modified'}},
    ];

    $scope.onWorkspace = onWorkspaceChanged;

    init();

    $scope.$on('view-video-tag', function(event, data) {
        $state.go('videoplayer.realization', {
            videoTagId: data.id
        });
    });

    function init() {
        //var totalTags = currentUser.count_tags_validated + currentUser.count_tags_rejected;
        //$scope.currentUser = currentUser;
        //$scope.performance = totalTags > 0 
        //    ? (currentUser.count_tags_validated / totalTags) 
        //    : "Not yet";

        for (var i = 0; i < $scope.workspaces.length; i++) {
            var workspace = $scope.workspaces[i];
            workspace.loader = VideoTagLoader
                    .instance(workspace.id)
                    .setFilters(workspace.filters)
                    .setMode('replace')
                    .setLimit(10);
        }
        $scope.workspaces[0]
                .loader
                .startLoading()
                .then(function() {
                    SharedData.pageLoader(false);
                })
                .catch(function() {
                    // TODO 
                });
    }

    function onWorkspaceChanged(workspace) {
        workspace.loader.startLoading();
    }
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

        VideoTagEntity.recentlyTagged({page: page}, function(response) {
            console.log("Set total video: " + response.total);
            $scope.totalVideos = response.total;
            $scope.videoPerPage = response.perPage;
            var items = response.items;
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
    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.showListTricks = false;
    VideoTagData.getLoader().setFilters({video_tag_id: $stateParams.videoTagId});
    VideoTagData.getLoader().startLoading()
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
    PlayerData.showViewMode();
    PlayerData.stop();
    VideoTagData.getLoader().setFilters({tag_id: $stateParams.tagId, order: $stateParams.order});
    VideoTagData.getLoader().startLoading().then(function(results) {
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
    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.showListTricks = true;
    console.log("Viewing sport: " + $stateParams.sportName);
    VideoTagData.getLoader().setFilters({sport_name: $stateParams.sportName, order: $stateParams.order});
    VideoTagData.getLoader().startLoading().finally(function() {
        SharedData.pageLoader(false);
    });
}

function ViewRiderController($scope, VideoTagData, $stateParams, PlayerData, SharedData, RiderEntity) {
    $scope.rider = {id: $stateParams.riderId};

    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.showListTricks = false;
    VideoTagData.getLoader().setFilters({rider_id: $stateParams.riderId, order: $stateParams.order});
    VideoTagData.getLoader().startLoading().finally(function() {
        SharedData.pageLoader(false);
    });

    RiderEntity.profile({id: $stateParams.riderId}, function(rider) {
        console.log(rider);
        $scope.rider = rider;
    });
}

function ViewSearchController(VideoTagData, PlayerData, SharedData, $stateParams) {
    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.showListTricks = true;
//    console.log($stateParams);
    VideoTagData.reset();
    VideoTagData.getLoader().setOrder($stateParams.order);
    VideoTagData.getLoader().setFilter('tag_name', $stateParams.tagName);
    VideoTagData.getLoader().startLoading().finally(function() {
        SharedData.pageLoader(false);
    });
}

function ViewPlaylistController(VideoTagData, PlayerData, SharedData, $stateParams) {
    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.showListTricks = true;
    VideoTagData.reset();
    VideoTagData.getLoader().setFilter('video_tag_ids', $stateParams.ids);
    VideoTagData.getLoader().startLoading().finally(function() {
        SharedData.pageLoader(false);
    });
}


function ViewVideoController($scope, VideoTagData, PlayerData, $stateParams, SharedData, $state) {

    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.onCurrentTimeUpdate = onCurrentTimeUpdate;
    PlayerData.showListTricks = false;
    $scope.video = {
        id: $stateParams.videoId
    };

    VideoTagData.getLoader()
            .setFilters({video_id: $stateParams.videoId, order: 'begin_time'})
            .startLoading()
            .then(autoPlayVideo)
            .catch(function() {
                SharedData.pageLoader(false);
            });

    // TODO only for first page

    function onCurrentTimeUpdate(newVal) {
        PlayerData.updateCurrentTag(newVal);
    }

    function autoPlayVideo(response) {
        console.log("Autho play video");
        if (response.items.length > 0) {
            var first = response.items[0];
            PlayerData.loadVideo({
                provider: first.provider_id,
                video_url: first.video_url
            }).finally(function() {
                SharedData.pageLoader(false);
            });
            $scope.videoDuration = first.video_duration;
            $scope.videoTags = response.items;
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
        else {
            console.log("This video has no trick");
            $state.go('notfound');
        }
    }
}

// TODO add current sport ...
function ViewValidationController($scope, VideoTagData, PlayerData, SharedData, $state, VideoTagEntity, 
    VideoTagAccuracyRateEntity, $rootScope) {
    var skipped = [];

    PlayerData.stop();
    PlayerData.showValidationMode();
    PlayerData.showListTricks = false;
    VideoTagData.reset();
    VideoTagData.mode = 'validation';
    loadNext();
    
    $scope.rateAccurate = rateAccurate;
    $scope.rateFake = rateFake;
    $scope.skip = skip;

    function rateAccurate() {
        $scope.isButtonsLoading = true;
        VideoTagAccuracyRateEntity.accurate({
            video_tag_id: VideoTagData.currentTag.id
        });
        skipped.push(VideoTagData.currentTag.id);
        toNextTag();
    }

    function rateFake() {
        VideoTagAccuracyRateEntity.fake({
            video_tag_id: VideoTagData.currentTag.id
        });
        skipped.push($scope.videoTag.id);
        toNextTag()
    }

    function skip() {
        skipped.push(VideoTagData.currentTag.id);
        PlayerData.pause();
        toNextTag();
    }

    function toNextTag() {
        PlayerData.pause();
        SharedData.pageLoader(true);
        loadNext();
    }

    function loadNext() {
        SharedData.pageLoader(true);
        return VideoTagEntity
                .validation({skipped: skipped.join(',')})
                .$promise
                .then(successLoadCallback)
                .catch(function() {
                    $state.go('videoplayer.home');
                });
    }

    function successLoadCallback(tags) {
        VideoTagData.getLoader().data.items = tags;
        if (tags.length === 1) {
            PlayerData
                    .playVideoTag(tags[0])
                    .finally(function() {
                        SharedData.pageLoader(false);
                    });
        }
        else {
            VideoTagData.currentTag = null;
            SharedData.pageLoader(false);
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