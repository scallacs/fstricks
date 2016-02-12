angular.module('app.player', [
    'ui.router',
    'ngMessages',
    'app.core',
    'shared.youtube',
    'shared',
    'angularUtils.directives.dirPagination'
])
        .config(ConfigRoute)
        .controller('AddVideoController', AddVideoController)
        .controller('VideoTagPointsController', VideoTagPointsController)
        .controller('PlayerController', PlayerController)
        .controller('ViewBestController', ViewBestController)
        .controller('ViewVideoController', ViewVideoController)
        .controller('ViewTagController', ViewTagController)
        .controller('ViewSportController', ViewSportController);

ConfigRoute.$inject = ['$stateProvider'];
function ConfigRoute($stateProvider) {
    var baseUrl = 'js/src/player/partials/';

    $stateProvider
            .state('addvideo', {
                url: '/video/add',
                views: {
                    viewNavRight: {
                        template: '<h2 class="page-title">Add a video</h2>'
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
                url: '/player?order&sport_name&tag_id',
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
                        controller: 'ViewSportController'
                    }
                }
            })
            .state('videoplayer.video', {
                url: '/video/:videoId',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewVideoController',
                        template: '<div player-bar video-tags="videoTags" duration="videoDuration" player-bar-top></div>'
                    }
                }
            })
            .state('videoplayer.tag', {
                url: '/trick/:tagId',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewTagController'
                    }
                }
            })
            .state('videoplayer.best', {
                url: '/best',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewBestController'
                    }
                }
            });
}



function AddVideoController($scope, YoutubeVideoInfo, $state,
        VideoEntity, VideoTagEntity, ServerConfigEntity, messageCenterService, SharedData, AuthenticationService, PlayerData) {

    var videosInCache = {};
    $scope.data = {provider_id: null, video_url: null};
    $scope.playerProviders = [];
    $scope.add = add;
    $scope.isFormLoading = false;

    $scope.videoPerPage = 5;
    $scope.totalVideos = 0; // todo

    $scope.pageChanged = function(newPage) {
        loadRecentlyTagged(newPage);
    };

    init();

    ServerConfigEntity.rules().then(function(rules) {
        $scope.data.provider_id = rules.videos.provider_id.values[0];
        $scope.playerProviders = rules.videos.provider_id.values;
    });

    function init() {
        $scope.feedback = null;
        SharedData.pageLoader(false);
        loadRecentlyTagged(1);
    }

    function add(data) {
        messageCenterService.removeShown();
        $scope.isFormLoading = true;
        if (YoutubeVideoInfo.extractVideoIdFromUrl(data.video_url)) {
            data.video_url = YoutubeVideoInfo.extractVideoIdFromUrl(data.video_url);
        }
        var promise = $scope.addVideoForm.submit(VideoEntity.addOrGet(data).$promise);
        promise.then(function(response) {
            if (response.success) {
                $state.go('addtag', {videoId: response.data.id});
            }
            else {
                messageCenterService.add('warning', response.message, {status: messageCenterService.status.shown});
            }
        });
    }


    function loadRecentlyTagged(page) {
        if (videosInCache[page]) {
            $scope.recentVideos = videosInCache[page];
            return;
        }
        VideoTagEntity.recentlyTagged({page: page, total_number: (page <= 1 ? 1 : null)}, function(response) {
            if (response.total != null) {
                $scope.totalVideos = response.total;
            }
            var items = response.data;
            angular.forEach(items, function(video) {
                YoutubeVideoInfo.data(video.video_url, function(data) {
                    if (data && data.items.length > 0) {
                        video.provider_data = data.items[0];
                    }
                    else {
                        video.provider_data = null;
                    }
                });
            });
//            console.log(response);
            $scope.recentVideos = items;
            videosInCache[page] = items;
        });
    }

}

function PlayerController($scope, PlayerData) {
    PlayerData.showViewMode();
    PlayerData.showListTricks = true;
    
    $scope.$on('view-video-tag', function(event, tag){
        PlayerData.view(tag);
    });
}
function ViewTagController(VideoTagData, $stateParams, PlayerData, SharedData) {
    PlayerData.showListTricks = true;
    VideoTagData.setFilters({tag_id: $stateParams.tagId, order: 'best'});
    VideoTagData.loadNextPage().finally(function() {
        SharedData.pageLoader(false);
    });
}
function ViewSportController(VideoTagData, $stateParams, PlayerData, SharedData) {
//    console.log("View sport: " + $stateParams.sportName);
    PlayerData.showListTricks = true;
    VideoTagData.setFilters({sport_name: $stateParams.sportName, order: 'best'});
    VideoTagData.loadNextPage().finally(function() {
        SharedData.pageLoader(false);
    });
}
function ViewBestController(VideoTagData, PlayerData, SharedData) {
    PlayerData.showListTricks = true;
    VideoTagData.setFilters({order: 'best'});
    VideoTagData.loadNextPage().finally(function() {
        SharedData.pageLoader(false);
    });
}

function ViewVideoController($scope, VideoTagData, PlayerData, $stateParams, SharedData) {

    PlayerData.onCurrentTimeUpdate = onCurrentTimeUpdate;
    PlayerData.showListTricks = false;

    VideoTagData.setFilters({video_id: $stateParams.videoId, order: 'begin_time'});
    VideoTagData.loadPage(1).then(autoPlayVideo).finally(function() {
        SharedData.pageLoader(false);
    });

    // TODO only for first page

    function onCurrentTimeUpdate(newVal) {
        PlayerData.updateCurrentTag();
    }

    function autoPlayVideo(response) {
        if (response.length > 0) {
            PlayerData.play(response[0].video_url);
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


// TODO set as directive
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