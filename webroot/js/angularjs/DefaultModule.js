/*
 * Module for ...
 */
var module = angular.module('DefaultModule', ['ngRoute', 'ngCookies', 'CommonModule', 'ngResource', 'flow']);

module.config(function($routeProvider, $controllerProvider) {

    $controllerProvider.allowGlobals();

    $routeProvider

            // route for the home page
            .when('/', {
                templateUrl: HTML_FOLDER + 'Videos/view.html',
                controller: 'ExploreController'
            })
            .when('/index', {
                templateUrl: HTML_FOLDER + 'Videos/view.html',
                controller: 'ExploreController'
            })
            /* --------------------------------------------------------------- */
            .when('/view/:id', {
                templateUrl: HTML_FOLDER + 'Videos/view.html',
                controller: 'ViewVideoController'
            })
            .when('/video/view/:id', {
                templateUrl: HTML_FOLDER + 'Videos/view.html',
                controller: 'ViewVideoController'
            })
            .when('/sports/:sport', {
                templateUrl: HTML_FOLDER + 'Videos/view.html',
                controller: 'ViewSportController'
            })
            .when('/view/:sport/:category/:trick', {
                templateUrl: HTML_FOLDER + 'Videos/view.html',
                controller: 'ViewTagController'
            })
            /* --------------------------------------------------------------- */
//            .when('/trick/:id', {
//                templateUrl: HTML_FOLDER + 'Videos/view.html',
//                controller: 'ViewVideoTagController'
//            })
            /* --------------------------------------------------------------- */
            .when('/tag/add/:id', {
                templateUrl: HTML_FOLDER + 'VideoTags/add.html',
                controller: 'AddVideoTagController'
            })
            .when('/video/add', {
                templateUrl: HTML_FOLDER + 'Videos/add.html',
                controller: 'AddVideoController'
            })
            .when('/faq', {
                templateUrl: HTML_FOLDER + '/Pages/faq.html',
                controller: 'PagesController'
            })
            .when('/contact', {
                templateUrl: HTML_FOLDER + '/Pages/contact.html',
                controller: 'PagesController'
            })
            .when('/add/:provider/:videoId', {
                templateUrl: HTML_FOLDER + 'VideoTags/add.html',
                controller: 'AddVideoTagController'
            })
            /* --------------------------------------------------------------- */
            .when('/settings', {
                templateUrl: HTML_FOLDER + 'Users/settings.html',
                controller: 'SettingsController'
            })
            .when('/users/login', {
                templateUrl: HTML_FOLDER + 'Users/login.html',
                controller: 'UserLoginController'
            })
            .when('/login', {
                templateUrl: HTML_FOLDER + 'Users/login.html',
                controller: 'UserLoginController'
            })
            .when('/signup', {
                templateUrl: HTML_FOLDER + 'Users/signup.html',
                controller: 'SignupController'
            })
            .when('/profile/:username', {
                templateUrl: HTML_FOLDER + 'Riders/profile.html',
                controller: 'RiderProfileController'
            })
            .when('/profile', {
                templateUrl: HTML_FOLDER + 'Riders/profile.html',
                controller: 'RiderProfileController'
            })
            .otherwise({redirectTo: '/'});

});

module.controller('MainController', function($scope, AuthenticationService,
        $location, SportEntity, SharedData, TagEntity, $uibModal, PlayerProviders, YT_event, VideoTagData, PlayerData) {
    // create a message to display in our view
    $scope.isAuthed = AuthenticationService.isAuthed();
    $scope.searchTags = [];
    $scope.search = {tag: null};
    $scope.currentSport = null;
    $scope.isViewLoading = true;

    $scope.refreshSearchedTags = refreshSearchedTags;
    $scope.logout = logout;
    $scope.setCurrentSport = setCurrentSport;

    //$scope.reportDeadLink = reportDeadLink;
    $scope.toggleListTricks = toggleListTricks;
    $scope.nextTrick = nextTrick;
    $scope.prevTrick = prevTrick;


    $scope.player = {
        provider: PlayerProviders.list()[0].name
    };

    $scope.showVideoPlayer = false;

    //$scope.view = view;

    $scope.getCurrentPlayerTime = function() {
        return 0;
    };

    // -------------------------------------------------------------------------
    // Youtube player
    $scope.videoTagData = VideoTagData;
    $scope.playerData = PlayerData;

    // -------------------------------------------------------------------------

    init();


    function init() {

        $scope.$on('$routeChangeStart', function() {
            $scope.isViewLoading = true;
        });
        $scope.$on('$routeChangeSuccess', function() {
            $scope.isViewLoading = false;
        });
        $scope.$on('$routeChangeError', function() {
            $scope.isViewLoading = false;
        });

        $scope.$on('onYouTubePlayerReady', function(event, player) {
            $scope.getCurrentPlayerTime = function() {
                return player.getCurrentTime();
            };
        });

        $scope.$on('showVideoPlayer', function(newVal) {
            if (newVal === false) {
                PlayerData.reset();
            }
        });


        PlayerData.reset();
        // loading sports 
        SportEntity.index({}, loadSportCallback);
    }

    function loadSportCallback(response) {
        SharedData.sports = response;
        SharedData.categories = [];
        for (var i = 0; i < response.length; i++) {
            var sport = response[i];
            for (var j = 0; j < sport.categories.length; j++) {
                var category = sport.categories[j];
                SharedData.categories.push({
                    category_name: category.name,
                    category_id: category.id,
                    sport_name: sport.name,
                    sport_image: sport.image,
                    sport_id: sport.id
                });
            }
        }
        //console.log(SharedData.categories);
        $scope.sports = SharedData.sports;
        $scope.$watch('search.tag', function(newVal, oldVal) {
            console.log(newVal);
            if (newVal == oldVal) {
                return;
            }
            $location.path('/view/' + newVal.sport_name + '/' + newVal.category_name + '/' + newVal.slug);
        });
    }

    /* ======================================================================= */


    function toggleListTricks() {
        PlayerData.showListTricks = !PlayerData.showListTricks;
    }

    function nextTrick() {
        if (VideoTagData.hasNext()) {
            PlayerData.view(VideoTagData.next());
        }
    }
    function prevTrick() {
        if (VideoTagData.hasPrev()) {
            PlayerData.view(VideoTagData.prev());
        }
    }

    /* ======================================================================= */

    function logout() {
        AuthenticationService.logout();
        $location.path("/users/login");
        $scope.isAuthed = AuthenticationService.isAuthed();
    }
    /**
     * Header search bar function
     * @param {type} trick
     * @returns {undefined}
     */
    function refreshSearchedTags(trick) {
        if (trick.length >= 2) {
            TagEntity.suggest({
                id: trick,
//                category_id: category.category_id,
//                sport_id: category.sport_id
            }, function(results) {
                $scope.searchTags = results;
            });
        }
    }

    function setCurrentSport(sport) {
        $scope.currentSport = sport;
        SharedData.currentSport = sport;
    }

});


module.controller('ModalReportErrorController', function($scope, $uibModalInstance, ErrorReportEntity,
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
});


module.controller('SettingsController', function($scope, SharedData, messageCenterService, AuthenticationService, UserEntity, PlayerData) {

    AuthenticationService.requireLogin();

    $scope.data = {};
    $scope.password = '';
    $scope.removeAccount = removeAccount;
    $scope.isFormDeleteAccountLoading = false;
    $scope.isSociaLogin = function() {
        return AuthenticationService.getCurrentUser().provider !== null;
    };

    init();

    function init() {
        PlayerData.hide();
        SharedData.loadingState = 0;
        $scope.data.user = AuthenticationService.getCurrentUser();
        console.log($scope.data);
    }

    function removeAccount(password) {
        $scope.isFormDeleteAccountLoading = true;
        messageCenterService.removeShown();
        UserEntity.removeAccount({password: password}, function(response) {
            if (response.success) {
                messageCenterService.add('success', response.message, {status: messageCenterService.status.next});
                $scope.$parent.logout();
            }
            else {
                messageCenterService.add('danger', response.message, {status: messageCenterService.status.shown});
            }
            $scope.isFormDeleteAccountLoading = false;
        }, function() {

            $scope.isFormDeleteAccountLoading = false;
        });
    }
});

module.controller('UserLoginController', function($scope, $rootScope, $auth, SharedData, messageCenterService, $location,
        AuthenticationService, PlayerData) {
    // create a message to display in our view
    PlayerData.hide();
    $scope.authenticate = authenticate;
    $scope.isFormLoading = false;
    $scope.login = login;

    function init() {
        messageCenterService.removeShown();
        SharedData.loadingState = 0;
    }
    init();

    function authenticate(provider) {
        $scope.isFormLoading = true;
        messageCenterService.removeShown();
        console.log("Start authenticate with provider=" + provider);

//        AuthenticationService.socialLogin(provider, function(isLogin, response){
//            console.log(response);
//            $scope.$parent.isAuthed = isLogin;
//            if (isLogin) {
//                messageCenterService.add('success', response.message, {status: messageCenterService.status.next});
//                $location.path($rootScope.previousPage);
//            }
//            else {
//                $scope.isFormLoading = false;
//                messageCenterService.add('danger', response.message, {status: messageCenterService.status.shown});
//            }
//        });
        $auth.authenticate(provider, {provider: provider}).then(function(response) {
            response = response.data;
            console.log(response);
            $scope.$parent.isAuthed = response.success;

            if (response.success) {
                response.data.provider = provider;
                AuthenticationService.setCredentials(response.data);
                messageCenterService.add('success', response.message, {status: messageCenterService.status.next});
                $location.path($rootScope.previousPage);
            }
            else {
                $scope.isFormLoading = false;
                messageCenterService.add('danger', response.message, {status: messageCenterService.status.shown});
            }

        });
//                .then(function(error) {
//            console.log(error);
//            $scope.isFormLoading = false;
//            messageCenterService.add('danger', "Facebook login is not available right now. Sorry!", {status: messageCenterService.status.shown});
//        });
    }


    function login(data) {
        $scope.isFormLoading = true;
        messageCenterService.removeShown();
        AuthenticationService.login(data.email, data.password, function(isLogin, response) {
            $scope.$parent.isAuthed = isLogin;
            if (isLogin) {
                messageCenterService.add('success', response.message, {status: messageCenterService.status.shown});
                $location.path($rootScope.previousPage);
                return;
            }
            else {
                messageCenterService.add('danger', response.message, {status: messageCenterService.status.shown});
            }
            $scope.isFormLoading = false;
        }, function() {
            $scope.isFormLoading = false;
        });
    }

//        $auth.authenticate(provider)
//                .then(function(response) {
//                    if (response.data.success) {
//                        messageCenterService.add('success', 'You have successfully signed in with ' + provider + '!');
//                        $location.path('/');
//                    }
//                    else {
//                        console.log(response);
//                        messageCenterService.add('danger', response.data.message, {status: messageCenterService.status.shown});
//                    }
//                })
//                .catch(function(error) {
//                    console.log(error);
//                    if (error.error) {
//                        // Popup error - invalid redirect_uri, pressed cancel button, etc.
//                        messageCenterService.add('danger', error.error, {status: messageCenterService.status.shown});
//                    } else if (error.data) {
//                        // HTTP response error from server
//                        messageCenterService.add('danger', error.statusText, {status: messageCenterService.status.shown});
//                    } else {
//                        messageCenterService.add('danger', "Sorry but this service is not available for now. Try again later.", {status: messageCenterService.status.shown});
//                    }
//                });
//    }

});
module.controller('AddVideoController', function($scope, YoutubeVideoInfo, $location,
        VideoEntity, VideoTagEntity, PlayerProviders, messageCenterService, SharedData, AuthenticationService, PlayerData) {

    AuthenticationService.requireLogin();

    var videosInCache = {};
    $scope.data = {provider_id: PlayerProviders.list()[0].name, video_url: null};
    $scope.playerProviders = PlayerProviders.list();
    $scope.add = add;
    $scope.isFormLoading = false;

    $scope.videoPerPage = 5;
    $scope.totalVideos = 0; // todo

    $scope.pageChanged = function(newPage) {
        loadRecentlyTagged(newPage);
    };

    init();

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
            console.log(response);
            $scope.recentVideos = items;
            videosInCache[page] = items;
        });
    }

});
module.filter('searchCategory', function() {
    return function(categories, term) {
        if (term.length === 0) {
            return categories;
        }
        var results = [];
        var terms = term.split(' ');
        angular.forEach(categories, function(item) {
            var found = 0;
            for (var i = 0; i < terms.length; i++) {
                var term = terms[i].trim();
                if ((item.category_name.indexOf(term) !== -1) ||
                        (item.sport_name.indexOf(term) !== -1)) {
                    found++;
                }
            }
            if (found === terms.length) {
                results.push(item);
            }
        });
        return results;
    };

});
module.filter('getSportByName', function() {
    return function(sports, name) {
        for (var i = 0; i < sports.length; i++) {
            var item = sports[i];
            if (item.name == name) {
                return item;
            }
        }
        return null;
    };

});
module.controller('VideoTagPointsController', function($scope, VideoTagPointEntity) {
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
});

/*
 EditionTag
 - range
 - tag: { id, name }
 - rider: {display_name, id}
 - video_url
 - category
 
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
module.controller('AddVideoTagController', function($scope, YoutubeVideoInfo, $filter,
        $routeParams, VideoEntity, VideoTagEntity, TagEntity, SharedData, PlayerData,
        messageCenterService, AuthenticationService, RiderEntity, YT_event, VideoTagData) {

    SharedData.loadingState = 1;

    AuthenticationService.requireLogin();
    PlayerData.reset();
    PlayerData.show();

    // -------------------------------------------------------------------------
    // Properties: TODO match with server side
    var MIN_TAG_DURATION = 2;
    var MAX_TAG_DURATION = 40;

    $scope.slider = {
        step: 0.5
    };
    $scope.showCreateRiderForm = false;
    // We maintain two version the VideoTag and the 
    var editionTagExtra = {
        tag: null,
    };
    $scope.editionTag = {
        mode: 'edition',
        id: null,
        begin: 0,
        end: MIN_TAG_DURATION,
        video_url: null,
        video_id: 113,
        tag_name: 'No trick specified',
        tag_slug: null,
        tag_id: null,
        sport_name: null,
        category_name: null,
        sport_id: null,
        category_id: null,
        rider_name: 'No rider specified',
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
        PlayerData.showListTricks = false;
        PlayerData.editionMode = true;
        PlayerData.currentTag = $scope.editionTag;
        VideoTagData.setFilter('video_id', $routeParams.id);
        VideoTagData.loadNextPage();

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
            $scope.similarTags = findSimilarTags($scope.editionTag.range);
        });

        $scope.$on('rider-selected', function(event, rider) {
            console.log(rider);
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
        VideoEntity.view({id: $routeParams.id}, function(video) {
            $scope.editionTag.range[1] = MIN_TAG_DURATION;
            $scope.editionTag.video_url = video.video_url;
            PlayerData.data.duration = video.duration;
            PlayerData.url(video.video_url);
            PlayerData.play();
            SharedData.loadingState = 0;

            // OLD 
//            YoutubeVideoInfo.duration(video.video_url, function(duration) {
//                PlayerData.data.duration = duration;
//            });
        });

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
                console.log(results);
                $scope.suggestedRiders = results.data;
            });
        }
    }

    function addVideoTag(data) {
        messageCenterService.removeShown();
        $scope.isFormLoading = true;

        var postData = toPostData(data);

        VideoTagEntity.add(postData, function(response) {
            $scope.isFormLoading = false;
            if (response.success) {
                messageCenterService.add('success', response.message, {
                    timeout: 3000,
                    status: messageCenterService.status.shown
                });
                $scope.editionTag.id = response.data.id;
                VideoTagData.add($scope.editionTag);
            }
            else {
                messageCenterService.add('warning', response.message, {
                    status: messageCenterService.status.shown
                });
            }
        });
    }

//    function removeVideoTag(index) {
//        // TODO 
//        //$scope.video.video_tags.splice(index, 1);
//    }

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
        var limit = 0.6;                // TODO global variable
        var similarTags = [];
        angular.forEach(VideoTagData.data, function(tag) {
            // Contain
            var commonSeconds = Math.min(tag.end, range[1]) - Math.max(tag.begin, range[0]);
            // Check percentage in common with other tag
            if (commonSeconds > 0) {
                var commonPercents = commonSeconds / (range[1] - range[0]);
                console.log("Similar at " + (commonPercents * 100) + "%");
                if (commonPercents >= limit) { // More than 60% in common
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
        console.log($item);
        $scope.editionTag.tag_name = $item.name;
        $scope.editionTag.tag_id = $item.id;
        editionTagExtra.tag = $item;
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
        $scope.editionTag = videoTag;
        PlayerData.view(videoTag);
    }


    /**
     * Convert the EditionTag to a PostData
     * @param EditionTag data
     * @returns 
     */
    function toPostData(editionTag) {
        var postData = {
            video_id: $routeParams.id,
            begin: editionTag.begin,
            end: editionTag.end,
            rider_id: editionTag.rider_id,
            tag_id: editionTag.tag_id,
        };
        if (editionTagExtra.tag.is_new) {
            postData.tag = editionTagExtra.tag;
        }
        return postData;
    }
//    
//    /**
//     * Convert a EditionTag to a VideoTag
//     * @param EditionTag data
//     * @returns 
//     */
//    function toVideoTag(data) {
//        return angular.extend({
//            rider_name: data.rider_name,
//            tag_name: data.tag.name,
//            begin: data.range[0],
//            end: data.range[1],
//            removable: false,
//            count_points: 0
//        }, data.category);
//    }
});
module.controller('ViewSportController', function($scope, VideoTagData, $routeParams, PlayerData) {

    init();

    function init() {
        PlayerData.reset();
        PlayerData.title = 'Best in ' + $routeParams.sport;
        VideoTagData.setFilter('sport_name', $routeParams.sport);
        PlayerData.show();
        VideoTagData.loadNextPage();
    }

});

module.controller('ViewTagController', function($scope, VideoTagData, $routeParams, PlayerData) {

    init();

    function init() {
        PlayerData.reset();
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

        PlayerData.show();
        VideoTagData.loadNextPage();
    }
});
module.controller('ViewVideoController', function($scope, VideoTagData, $routeParams, YoutubeVideoInfo, PlayerData) {

    init();


    function init() {
        PlayerData.reset();
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
});
module.controller('ExploreController', function($scope, VideoTagData, PlayerData) {

    init();


    function init() {
        PlayerData.reset();
        PlayerData.title = 'Best tricks';
        VideoTagData.setFilters({order: 'best'});

        PlayerData.show();
        VideoTagData.loadNextPage();
    }

});

module.controller('SearchTagController', function($scope, TagEntity) {

    $scope.suggested = [];
    $scope.selected = [];

    $scope.refreshSuggestedTags = loadSuggestedTags;
    $scope.onSelectTag = onSelectTag;
    $scope.tagTransform = tagTransform;

    function onSelectTag($item, $model) {
        $scope.$emit('onSelectedTagUpdated', $scope.selected);
    }

    function onRemoveTag($item, $model) {
        $scope.$emit('onSelectedTagUpdated', $scope.selected);
    }
    function loadSuggestedTags(term) {
        TagEntity.suggest({id: term}, function(results) {
            $scope.suggested = results;
        });
    }
    function tagTransform(term) {
        return {
            isTag: true,
            name: term,
            count_ref: 0,
            id: null
        };

    }

});




//toastr
module.controller('SignupController', function($scope, $location, PlayerData, SharedData,
        messageCenterService, AuthenticationService, FormManager) {

    SharedData.loadingState = 0;
    messageCenterService.removeShown();
    PlayerData.hide();
    $scope.signup = signup;
    console.log($scope.signupForm);
    var formManager = null;

    $scope.$watch('signupForm', function(form) {
        formManager = FormManager.instance($scope.signupForm);
    });

    function signup(data) {
        messageCenterService.removeShown();

        $scope.isFormLoading = true;

        AuthenticationService.signup(data, function(success, response) {
            if (success) {
                $scope.$parent.isAuthed = true;
                messageCenterService.add('success', response.message, {status: messageCenterService.status.shown});
                $location.path('/');
            }
            else {
                messageCenterService.add('danger', response.message, {status: messageCenterService.status.shown});
                formManager.setErrors(response.validationErrors.Users);
            }
            $scope.isFormLoading = false;
        }, function() {
            $scope.isFormLoading = false;
        });

    }
});

module.controller('PagesController', function($scope, SharedData, PlayerData) {
    PlayerData.hide();
    SharedData.loadingState = 0;
});

module.controller('RiderProfileController',
        function($scope, $routeParams, AuthenticationService, SharedData, RiderEntity, VideoTagData, PlayerData) {
            if (!$routeParams.riderId){
                AuthenticationService.requireLogin();
            }

            SharedData.profileLoaded = false;
            PlayerData.reset();
            PlayerData.hide();

            // =========================================================================
            // Properties
            $scope.SharedData = SharedData;
            $scope.editionMode = false;
            $scope.isCurrentUserProfile = false;
            $scope.rider = {id: null};
            $scope.hasRiderProfile = hasRiderProfile;

            $scope.$on("rider-selected", function(event, rider) {
                if (rider === null) {
                    cancelEditionMode();
                }
                else {
                    console.log(rider);
                    $scope.editionMode = false;
                    $scope.rider = rider;
                }
            });

            // =========================================================================
            // Init
            function loadProfile(riderId) {
                RiderEntity.profile({id: riderId}, function(rider) {
                    $scope.rider = rider;
                    $scope.profileLoaded = true;
                }).$promise.finally(function() {
                    SharedData.loadingState = 0;
                });
            }

            function init() {
                var riderId = null;
                if ($routeParams.riderId) {
                    username = $routeParams.riderId;
                }
                loadProfile(riderId);
            }
            init();

            // =========================================================================
            // Form
            function hasRiderProfile() {
                return $scope.rider.firstname != null;
            }
            // =========================================================================
            // scope

            $scope.startEditionMode = function() {
                $scope.editionMode = true;
            };
            function cancelEditionMode() {
                $scope.editionMode = false;
            }

            $scope.isEditabled = function() {
                return !hasRiderProfile() || $scope.rider.user_id === AuthenticationService.getCurrentUser().id;
            };

            $scope.viewVideos = function() {
                PlayerData.show();
                VideoTagData.setFilter('rider_id', $scope.rider.id);
                VideoTagData.setOrder('created');
                VideoTagData.loadNextPage();
            };

        });