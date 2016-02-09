angular.module('app.player', [
    'ngRoute',
    'ngMessages',
    'app.core',
    'shared.youtube',
    'shared',
    'angularUtils.directives.dirPagination'
])
        .config(ConfigRoute)
        .controller('ModalReportErrorController', ModalReportErrorController)
        .controller('AddVideoController', AddVideoController)
        .controller('AddVideoTagController', AddVideoTagController)
        .controller('VideoTagPointsController', VideoTagPointsController)
        .controller('ViewVideoController', ViewVideoController)
        .controller('ExploreController', ExploreController)
        .controller('ViewTagController', ViewTagController)
        .controller('ViewSportController', ViewSportController);

ConfigRoute.$inject = ['$routeProvider'];
function ConfigRoute($routeProvider) {
    var baseUrl = 'js/src/player/partials/';
    $routeProvider
            // route for the home page
            .when('/', {
                templateUrl: baseUrl + 'empty.html',
                controller: 'ExploreController'
            })
//            .when('/home', {
//                templateUrl: baseUrl +  'view.html',
//                controller: 'ExploreController'
//            })
            .when('/video/add', {
                templateUrl: baseUrl + 'add_video.html',
                controller: 'AddVideoController'
            })
            /* --------------------------------------------------------------- */
            .when('/view/:id', {
                templateUrl: baseUrl + 'empty.html',
                controller: 'ViewVideoController'
            })
            .when('/video/view/:id', {
                templateUrl: baseUrl + 'empty.html',
                controller: 'ViewVideoController'
            })
            .when('/sports/:sport', {
                templateUrl: baseUrl + 'empty.html',
                controller: 'ViewSportController'
            })
            .when('/view/:sport/:category/:trick', {
                templateUrl: baseUrl + 'empty.html',
                controller: 'ViewTagController'
            });
};

function ModalReportErrorController($scope, $uibModalInstance, ErrorReportEntity,
        videoTag, AuthenticationService, messageCenterService) {
    if (!AuthenticationService.isAuthed()) {
        AuthenticationService.requireLogin();
        return;
    }

    $scope.videoTag = videoTag;
    $scope.feedback = null;
    $scope.isFormLoading = false;
    $scope.errorReport = {};

    $scope.ok = function() {
        messageCenterService.removeShown();
        $uibModalInstance.close($scope.videoTag);
    };

    $scope.cancel = function() {
        messageCenterService.removeShown();
        $uibModalInstance.dismiss('cancel');
    };

    $scope.sendReport = function(errorReport) {
        messageCenterService.removeShown();
        $scope.isFormLoading = true;
        errorReport.video_tag_id = videoTag.id;
        ErrorReportEntity.post(errorReport, function(response) {
            console.log(response);
            if (response.success) {
                $uibModalInstance.close($scope.videoTag);
            }
            else {
                messageCenterService.add(response.success ? 'success' : 'warning', response.message, {
                    status: messageCenterService.status.shown
                });
            }

            $scope.isFormLoading = false;
        }, function() {
            $scope.isFormLoading = false;
        });
    };
}

function AddVideoController($scope, YoutubeVideoInfo, $location,
        VideoEntity, VideoTagEntity, ServerConfigEntity, messageCenterService, SharedData, AuthenticationService, PlayerData) {

    AuthenticationService.requireLogin();

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
    
    ServerConfigEntity.rules().then(function(rules){
        $scope.data.provider_id = rules.videos.provider_id.values[0];
        $scope.playerProviders = rules.videos.provider_id.values;
    });

    function init() {
        $scope.feedback = null;
        PlayerData.hide();
        SharedData.loadingState = 0;

        loadRecentlyTagged(1);

    }

    function add(data) {
        messageCenterService.removeShown();
        $scope.isFormLoading = true;
        if (YoutubeVideoInfo.extractVideoIdFromUrl(data.video_url)) {
            data.video_url = YoutubeVideoInfo.extractVideoIdFromUrl(data.video_url);
        }
        VideoEntity.addOrGet(data, function(response) {
            if (response.success) {
                $location.path('/tag/add/' + response.data.id);
            }
            else {
                messageCenterService.add('warning', response.message, {status: messageCenterService.status.shown});
            }
            $scope.isFormLoading = false;
        }, function() {
            $scope.isFormLoading = false;
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

/*
 
 VideoTag
 - begin: 245.5
 - category_name: "jib"
 - count_points: 0
 - end: 248.5
 - id: 96
 - provider_id: "youtube"
 - rider_name: "sebastien toutant"
 - rider_picture: null
 - sport_name: "snowboard"
 - tag_name: "backside 360 in"
 - tag_slug: "backside-360-in"
 - video_id: 113
 - video_url: "hDnGPpHEM6U"
 
 PostData
 - begin
 - end
 - sport_id
 - category_id
 - rider_id [optional]
 */
function AddVideoTagController($scope, $filter,
        $routeParams, VideoEntity, VideoTagEntity, TagEntity, SharedData, PlayerData,
        messageCenterService, AuthenticationService, RiderEntity, VideoTagData, VideoTagEntity) {

    AuthenticationService.requireLogin();
    PlayerData.showEditionMode();

    // -------------------------------------------------------------------------
    // Properties: TODO match with server side
    var MIN_TAG_DURATION = 2;
    var MAX_TAG_DURATION = 40;

    $scope.slider = {
        step: 0.5
    };
    $scope.showCreateRiderForm = false;

    $scope.editionTag = {
        mode: 'edition',
        id: null,
        begin: 0,
        end: MIN_TAG_DURATION,
        video_url: null,
        tag_name: null,
        tag_slug: null,
        tag_id: null,
        tag: {},
        sport_name: null,
        category_name: null,
        sport_id: null,
        category_id: null,
        rider_name: null,
        rider_picture: null,
        rider_id: null,
        provider_id: "youtube",
        count_points: 0,
        // ---
        range: [0, 0]
    };
    $scope.similarTags = [];
    $scope.isFormLoading = false;
    $scope.sports = SharedData.sports;
    $scope.suggestedTags = [];
    $scope.suggestedCategories = [];
    $scope.suggestedRiders = [];

    // -------------------------------------------------------------------------
    // Functions
    $scope.playEditionTag = playEditionTag;
    $scope.addVideoTag = addVideoTag;
    $scope.editVideoTag = editVideoTag;
    $scope.refreshSuggestedTags = refreshSuggestedTags;
    $scope.onSelectTrick = onSelectTrick;
    $scope.onRemoveTrick = onRemoveTrick;

    $scope.refreshSuggestedCategories = refreshSuggestedCategories;
    $scope.onSelectCategory = onSelectCategory;
    $scope.onRemoveCategory = onRemoveCategory;

    $scope.refreshSuggestedRiders = refreshSuggestedRiders;
    $scope.onSelectRider = onSelectRider;
    $scope.onRemoveRider = onRemoveRider;

    $scope.playEditionTag = playEditionTag;
    $scope.addStartRange = addStartRange;
    $scope.addEndRange = addEndRange;
    $scope.setStartRangeNow = setStartRangeNow;
    $scope.setEndRangeNow = setEndRangeNow;

    init();

    function init() {
        PlayerData.view = function(tag){
//            console.log("Edition view video tag");
            $scope.editVideoTag(tag);
            this._view(tag);
        };
        
        PlayerData.showListTricks = false;
        PlayerData.currentTag = $scope.editionTag;
        VideoTagData.setFilter('video_id', $routeParams.videoId);

        // When data loaded when set in the editor the tag id
        if ($routeParams.tagId) {
            VideoTagData.callbackSuccess = function(data) {
//                console.log("Video duration: "  + PlayerData.data.duration);
                // Find tag id 
                for (var i = 0; i < data.length; i++) {
                    if (data[i].id == $routeParams.tagId) {
                        PlayerData.view(data[i]);
//                        console.log("Edition video tag id: " + data[i].id);
                        return;
                    }
                }
            };
        }
        
        $scope.$watch('editionTag.range', function(newValue, oldValue) {
            if (newValue == undefined) {
                return;
            }
            if (oldValue == undefined || newValue[0] !== oldValue[0]) {
//                PlayerData.seekTo(newValue[0]);
                adaptRange(newValue[0], 0);
                $scope.editionTag.begin = $scope.editionTag.range[0];
                playEditionTag();
            }
            else if (newValue[1] !== oldValue[1]) {
                PlayerData.seekTo(newValue[1]);
                PlayerData.pause();
                adaptRange(newValue[1], 1);
                $scope.editionTag.end = $scope.editionTag.range[1];
            }
            // If we want to create a new tag
            if ($scope.edtionTag && !$scope.edtionTag.id){
                $scope.similarTags = findSimilarTags($scope.editionTag.range);
            }
        });

        $scope.$on('rider-selected', function(event, rider) {
//            console.log(rider);
            $scope.showCreateRiderForm = false;
            if (rider !== null) {
                $scope.editionTag.rider = rider;
                $scope.editionTag.rider_name = rider.display_name;
                $scope.editionTag.rider_picture = rider.rider_picture;
                $scope.editionTag.rider_id = rider.id;
            }
            else {
                $scope.editionTag.rider = null;
                $scope.editionTag.rider_name = null;
                $scope.editionTag.rider_id = null;
                $scope.editionTag.rider_picture = null;
            }
        });
        
        VideoTagData.add($scope.editionTag);
//        if ($routeParams.videoId) {
        VideoEntity.view({id: $routeParams.videoId}, function(video) {
            $scope.editionTag.range[1] = MIN_TAG_DURATION;
            $scope.editionTag.video_url = video.video_url;
            PlayerData.data.duration = video.duration;
            PlayerData.url(video.video_url);
            PlayerData.play();
            SharedData.loadingState = 0;
            VideoTagData.loadNextPage();
        });

        if (!$routeParams.tagId) {
            VideoTagData.loadNextPage();

        }
//        }

    }

    function refreshSuggestedCategories(term) {
        $scope.suggestedCategories = $filter('searchCategory')(SharedData.categories, term);
    }

    function refreshSuggestedTags(trick) {
        var tag = $scope.editionTag;
        if (trick.length >= 2) {
            TagEntity.suggest({
                id: trick,
                category_id: tag.category_id,
                sport_id: tag.sport_id
            }, function(results) {
                $scope.suggestedTags = [{
                        is_new: true,
                        name: trick,
                        sport_name: tag.sport_name,
                        category_name: tag.category_name,
                        sport_id: tag.sport_id,
                        category_id: tag.category_id
                    }];
                for (var i = 0; i < results.length; i++) {
                    $scope.suggestedTags.push(results[i]);
                }
            });
        }
    }

    function refreshSuggestedRiders(name) {
        if (name.length >= 2) {
            RiderEntity.search({
                q: name
            }, function(results) {
//                console.log(results);
                $scope.suggestedRiders = results.data;
            });
        }
    }

    function addVideoTag(data) {
        messageCenterService.removeShown();
        $scope.isFormLoading = true;

        var postData = toPostData(data);

        if (data.id){
            VideoTagEntity.edit(postData, function(response) {
                $scope.isFormLoading = false;
                if (response.success) {
                    messageCenterService.add('success', response.message, {
                        timeout: 3000,
                        status: messageCenterService.status.shown
                    });
                    resetEditionTag($scope.editionTag);
                }
            });
        } 
        else {
            VideoTagEntity.add(postData, function(response) {
                $scope.isFormLoading = false;
                if (response.success) {
                    messageCenterService.add('success', response.message, {
                        timeout: 3000,
                        status: messageCenterService.status.shown
                    });
                    var newTag = angular.copy($scope.editionTag);
                    newTag.id = response.data.id;
                    VideoTagData.add(newTag);
                    resetEditionTag($scope.editionTag);
                }
                else {
                    messageCenterService.add('warning', response.message, {
                        status: messageCenterService.status.shown
                    });
                }
            });
        }
    }

    function playEditionTag() {
        PlayerData.view($scope.editionTag);
    }

    function addStartRange(value) {
        $scope.editionTag.range = [$scope.editionTag.range[0] + value, $scope.editionTag.range[1]];
    }
    function addEndRange(value) {
        $scope.editionTag.range = [$scope.editionTag.range[0], $scope.editionTag.range[1] + value];
    }
    function setStartRangeNow() {
        adaptRange($scope.$parent.getCurrentPlayerTime(), 0);
    }
    function setEndRangeNow() {
        adaptRange($scope.$parent.getCurrentPlayerTime(), 1);
    }

    /**
     * 
     * @param int newValue
     * @param {0,1} i the time to change (0 => begin, 1 => end)
     */
    function adaptRange(newValue, i) {
        if (i === 1 && newValue <= MIN_TAG_DURATION) {
            $scope.editionTag.range[1] = MIN_TAG_DURATION;
            $scope.editionTag.range[0] = 0;
            return;
        }
        else if (i === 0 && (PlayerData.data.duration - newValue) <= MIN_TAG_DURATION) {
            $scope.editionTag.range[0] = PlayerData.data.duration - MIN_TAG_DURATION;
            $scope.editionTag.range[1] = PlayerData.data.duration;
            return;
        }

        $scope.editionTag.range[i] = newValue;
        if (($scope.editionTag.range[1] - $scope.editionTag.range[0]) < MIN_TAG_DURATION) {
            $scope.editionTag.range[1 - i] = $scope.editionTag.range[i] + (i === 1 ? -MIN_TAG_DURATION : MIN_TAG_DURATION);
        } else if (($scope.editionTag.range[1] - $scope.editionTag.range[0]) >= MAX_TAG_DURATION) {
            $scope.editionTag.range[1 - i] = $scope.editionTag.range[i] + (i === 1 ? -MAX_TAG_DURATION : MAX_TAG_DURATION);
        }
    }

    function findSimilarTags(range) {
        var SIMILAR_TAG_LIMIT_RATION = 0.6;                // TODO global variable
        var similarTags = [];
        angular.forEach(VideoTagData.data, function(tag) {
            // Contain
            var commonSeconds = Math.min(tag.end, range[1]) - Math.max(tag.begin, range[0]);
            // Check percentage in common with other tag
            if (commonSeconds > 0) {
                var commonPercents = commonSeconds / (range[1] - range[0]);
//                console.log("Similar at " + (commonPercents * 100) + "%");
                if (commonPercents >= SIMILAR_TAG_LIMIT_RATION) { // More than 60% in common
                    similarTags.push(tag);
                }
            }
        });
        console.log('Similar count: ' + similarTags.length);
        return similarTags;
    }

    function onSelectRider($item) {
        $scope.editionTag.rider_name = $item.display_name;
        $scope.editionTag.rider_id = $item.id;
    }
    function onRemoveRider() {
        $scope.editionTag.rider_name = 'Unknown rider';
        $scope.editionTag.rider_id = null;
    }
    function onSelectTrick($item) {
//        console.log($item);
        $scope.editionTag.tag_name = $item.name;
        $scope.editionTag.tag_id = $item.id;
        // TODO check that tag has all wanted fields
        console.log($item);
        $scope.editionTag.tag = $item;
    }
    function onRemoveTrick() {
        $scope.editionTag.tag_name = 'Define the trick';
        $scope.editionTag.tag_id = null;
    }
    function onSelectCategory($item) {
        $scope.editionTag.sport_name = $item.sport_name;
        $scope.editionTag.sport_id = $item.sport_id;
        $scope.editionTag.category_name = $item.category_name;
        $scope.editionTag.category_id = $item.category_id;
    }
    function onRemoveCategory() {
        $scope.editionTag.category_name = '';
        $scope.editionTag.sport_name = '';
        $scope.editionTag.sport_id = null;
        $scope.editionTag.category_id = null;
    }

    function editVideoTag(videoTag) {
        videoTag.range = [videoTag.begin, videoTag.end];
        videoTag.category = {
            id: videoTag.category_id,
            category_name: videoTag.category_name,
            sport_name: videoTag.sport_name
        };
        videoTag.tag = {
            id: videoTag.tag_id,
            name: videoTag.tag_name,
            sport_name: videoTag.sport_name,
            category_name: videoTag.category_name,
        };
        if (videoTag.rider_id) {
            videoTag.rider = {
                id: videoTag.rider_id,
                display_name: videoTag.rider_name,
                nationality: videoTag.rider_nationality
            };
        }
        //console.log(videoTag);
        $scope.editionTag = videoTag;
    }


    /**
     * Convert the EditionTag to a PostData
     * @param EditionTag data
     * @returns 
     */
    function toPostData(editionTag) {
        var postData = {
            video_id: $routeParams.videoId,
            begin: editionTag.begin,
            end: editionTag.end,
            rider_id: editionTag.rider_id,
            tag_id: editionTag.tag_id,
            id: editionTag.id
        };
        if (editionTag.tag.is_new) {
            postData.tag = editionTag.tag;
        }
        return postData;
    }
    function resetEditionTag(){
        $scope.editionTag.id = null;
        $scope.editionTag.tag = {};
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

function ViewVideoController(VideoTagData, $routeParams, YoutubeVideoInfo, PlayerData) {

    init();


    function init() {
        PlayerData.showViewMode();
        PlayerData.title = 'Loading video...';
        VideoTagData.setFilters({video_id: $routeParams.id, order: 'begin_time'});
        VideoTagData.callbackSuccess = function(response) {
            if (response.length > 0) {
                PlayerData.url(response[0].video_url);
                PlayerData.play();

                YoutubeVideoInfo.snippet(response[0].video_url, function(data) {
                    //console.log(data);
                    if (data !== null) {
                        PlayerData.title = data.title;
                    }
                    else {
                        PlayerData.title = '';
                    }
                });
            }
        };

        PlayerData.onCurrentTimeUpdate = function(newVal) {
            var current = PlayerData.currentTag;
            // Still current trick 
            //console.log(current);
            if (current !== null && current.begin <= newVal && current.end >= newVal) {
                current.time_to_play = 0;
            }
            else if (current !== null && current.begin > newVal) {
                current.time_to_play = Math.round(current.begin - newVal, 0);
            }
            // Search next one
            else {
                PlayerData.currentTag = VideoTagData.findNextTagToPlay(newVal);
            }
        };

        PlayerData.show();
        VideoTagData.loadNextPage();
    }
}

function ExploreController(VideoTagData, PlayerData) {

    init();


    function init() {
        PlayerData.showViewMode();
        PlayerData.showListTricks = true;
        PlayerData.title = 'Best tricks';
        VideoTagData.setFilters({order: 'best'});

        PlayerData.show();
        VideoTagData.loadNextPage();
    }

}

function ViewTagController(VideoTagData, $routeParams, PlayerData) {

    init();

    function init() {
        PlayerData.title = $routeParams.sport + ': ' + $routeParams.trick;

        VideoTagData.setFilters({
            sport_name: $routeParams.sport,
            category_name: $routeParams.category,
            trick_name: $routeParams.trick
        });
        VideoTagData.callbackSuccess = function(data) {
//            console.log(data);
            if (data.length > 0) {
                PlayerData.title = data[0].sport_name + ': ' + data[0].tag_name;
            }
        };

        PlayerData.showViewMode();
        VideoTagData.loadNextPage();
    }
}

function ViewSportController(VideoTagData, $routeParams, PlayerData) {

    init();

    function init() {
        PlayerData.title = 'Best in ' + $routeParams.sport;
        PlayerData.showViewMode();
        VideoTagData.setFilter('sport_name', $routeParams.sport);
        VideoTagData.loadNextPage();
    }

}

