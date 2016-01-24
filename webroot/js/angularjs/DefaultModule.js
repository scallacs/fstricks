/*
 * Module for ...
 */
var module = angular.module('DefaultModule', ['ngRoute', 'ngCookies', 'CommonModule', 'ngResource']);

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
            .when('/users/settings', {
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
//            .when('/users/profile/:username', {
//                templateUrl: HTML_FOLDER + 'Users/profile.html',
//                controller: 'UserController'
//            })
//            .when('/users/profile', {
//                templateUrl: HTML_FOLDER + 'Users/profile.html',
//                controller: 'UserController'
//            })
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
    $scope.openReportErrorModal = openReportErrorModal;

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

    function openReportErrorModal(videoTag) {
        var modal = $uibModal.open({
            templateUrl: HTML_FOLDER + '/ReportErrors/form.html',
            controller: 'ModalReportErrorController',
            size: 'lg',
            resolve: {
                videoTag: function() {
                    return videoTag;
                }
            }
        });
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


module.controller('SettingsController', function($scope, SharedData, messageCenterService, AuthenticationService, UserEntity) {

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
        $scope.$parent.showVideoPlayer = false;
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

module.controller('UserController',
        function($filter, $scope, $location, UserEntity, $routeParams,
                AuthenticationService, SharedData) {


            // =========================================================================
            // Properties
            $scope.editionMode = false;
            $scope.new_tag = '';
            $scope.isCurrentUserProfile = false;

            var saved = true;

            function loadProfile(userId) {

                UserEntity.profile({id: userId}, function(response) {
                    if (!response.username) {
                        $location.path('/login');
                        return;
                    }
                    $scope.isCurrentUserProfile = (AuthenticationService.isAuthed() &&
                            AuthenticationService.getCurrentUser().id === response.id);
                    $scope.data.user = response;
                    $scope.data.user.count_posts = 0;

//                    if (response.tag_string.length > 0) {
//                        $scope.tags = $.map(response.tag_string.split(','), function(value) {
//                            return {name: value, edition_status: 'keep'};
//                        });
//                    }
//                    else {
//                        $scope.tags = [{name: 'EditMePlease', edition_status: 'keep'}];
//                    }
                    SharedData.loadingState = 0;
                    //console.log(response);
                });
            }


            // =========================================================================
            // Init

            function initData() {
                $scope.data = {
                    user: null,
                };
            }
            function init() {
                $scope.$parent.showVideoPlayer = false;

                initData();
                var username = null;
                if ($routeParams.username) {
                    username = $routeParams.username;
                }
                loadProfile(username);
            }
            init();

            // =========================================================================
            // Form


            function save() {
                $scope.message = 'Saving... Please wait';
                var data = {
                    tag_string: $.map($scope.tags, function(tag) {
                        return tag.name;
                    }).join(","),
                };
                UserEntity.edit(data, function(response) {
                    console.log(response);
                    saved = response.success;
                    $scope.message = response.message;
                });
            }
            // =========================================================================
            // scope

            $scope.addTag = function(val) {
                if (!val || val.length < 2) {
                    $scope.message = "Tag must be at least 2 chars";
                    return;
                }
                $scope.new_tag = '';
                $scope.tags.push({id: null, name: $filter('camelCase')(val), edition_status: 'new'});
            };

            $scope.removeTag = function(tag) {
                tag.edition_status = 'remove';
                return false;
            };

            $scope.startEditionMode = function() {
                $scope.editionMode = true;
            };
            $scope.cancelEditionMode = function() {
                $scope.editionMode = false;
                for (var i = $scope.tags.length - 1; i >= 0; i--) {
                    if ($scope.tags[i].edition_status === 'new') {
                        $scope.tags.splice(i, 1);
                    }
                    else {
                        $scope.tags[i].edition_status = 'keep';
                    }
                }
            };
            $scope.save = function() {
                save();
                $scope.editionMode = false;
            };

            $scope.isSaved = function() {
                return saved;
            };

        });

module.controller('UserLoginController', function($scope, $rootScope, $auth, SharedData, messageCenterService, $location, AuthenticationService) {
    // create a message to display in our view
    $scope.$parent.showVideoPlayer = false;
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
        VideoEntity, VideoTagEntity, PlayerProviders, messageCenterService, SharedData, AuthenticationService) {

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
        $scope.$parent.showVideoPlayer = false;
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
//module.controller('ViewVideoTagController', function($scope, VideoTagEntity, $routeParams, SharedData, PlayerData) {
//
//    init();
//
//    function init() {
//        PlayerData.title = 'TODO : ????';
//        
//        VideoTagEntity.view({id: $routeParams.id}, function(tag) {
//            PlayerData.view(tag);
//            $scope.$parent.video.video_url = tag.video_url;
//            $scope.$parent.video.video_tags = [tag];
//            SharedData.loadingState = 0;
//            $scope.$parent.showVideoPlayer = true;
//        });
//    }
//
//});
module.controller('AddVideoTagController', function($scope, YoutubeVideoInfo, $filter,
        $routeParams, VideoEntity, VideoTagEntity, TagEntity, SharedData, PlayerData,
        messageCenterService, AuthenticationService, RiderEntity) {

    AuthenticationService.requireLogin();

    // TODO match with server side
    var MIN_TAG_DURATION = 2;
    var MAX_TAG_DURATION = 40;

    $scope.slider = {
        step: 0.5
    };
    $scope.videoTag = {
        begin: 0,
        end: 0,
        range: [0, MIN_TAG_DURATION],
        tag: null
    };
    $scope.video = {video_tags: []};
    //$scope.playerInfo = {begin: 0, end: 0};
    $scope.similarTags = [];
    $scope.isFormLoading = false;

    $scope.playerData = PlayerData;
    $scope.sports = SharedData.sports;
    $scope.suggestedTags = [];
    $scope.suggestedCategories = [];
    $scope.suggestedRiders = [];
    // Functions
    $scope.addVideoTag = addVideoTag;
    $scope.removeVideoTag = removeVideoTag;
    $scope.refreshSuggestedTags = refreshSuggestedTags;
    $scope.refreshSuggestedCategories = refreshSuggestedCategories;
    $scope.refreshSuggestedRiders = refreshSuggestedRiders;
    $scope.playRange = playRange;
    $scope.addStartRange = addStartRange;
    $scope.addEndRange = addEndRange;
    $scope.setStartRangeNow = setStartRangeNow;
    $scope.setEndRangeNow = setEndRangeNow;
//    $scope.view = view;
    init();

    function init() {
        PlayerData.reset();
        $scope.$parent.showVideoPlayer = false;

        VideoEntity.view({id: $routeParams.id}, function(response) {
            $scope.video = response;
            PlayerData.url(response.video_url);

            YoutubeVideoInfo.duration(response.video_url, function(duration) {
                PlayerData.data.duration = duration;
            });

            SharedData.loadingState = 0;
        });

        $scope.$watch('videoTag.range', function(newValue, oldValue) {
            if (newValue == undefined) {
                return;
            }
            if (oldValue == undefined || newValue[0] !== oldValue[0]) {
                PlayerData.seekTo(newValue[0]);
                adaptRange(newValue[0], newValue, 0);
            }
            else if (newValue[1] !== oldValue[1]) {
                PlayerData.seekTo(newValue[1]);
                adaptRange(newValue[1], newValue, 1);
            }
            $scope.similarTags = findSimilarTags($scope.videoTag.range);
        });

    }
    function refreshSuggestedCategories(term) {
        $scope.suggestedCategories = $filter('searchCategory')(SharedData.categories, term);
    }


    function refreshSuggestedTags(trick) {
        var category = $scope.videoTag.category;
        if (trick.length >= 2) {
            TagEntity.suggest({
                id: trick,
                category_id: category.category_id,
                sport_id: category.sport_id
            }, function(results) {
                $scope.suggestedTags = [{
                        is_new: true,
                        name: trick,
                        sport_name: category.sport_name,
                        category_name: category.category_name,
                        sport_id: category.sport_id,
                        category_id: category.category_id
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
                $scope.suggestedRiders = results.data;
            });
        }
    }

    function addVideoTag(data) {
        messageCenterService.removeShown();
        $scope.isFormLoading = true;

        var postData = {
            video_id: $routeParams.id,
            begin: data.range[0],
            end: data.range[1]
        };
        if (data.tag.is_new) {
            postData.tag = data.tag;
        }
        else {
            postData.tag_id = data.tag.id;
        }

        VideoTagEntity.add(postData, function(response) {
            $scope.isFormLoading = false;
            if (response.success) {
                messageCenterService.add('success', response.message, {
                    timeout: 3000,
                    status: messageCenterService.status.shown
                });

                var videoTag = angular.extend({
                    tag_name: data.tag.name,
                    begin: data.range[0],
                    end: data.range[1],
                    removable: true,
                    count_points: 0
                }, data.category);

                $scope.video.video_tags.push(videoTag);
            }
            else {
                messageCenterService.add('warning', response.message, {
                    status: messageCenterService.status.shown
                });
            }
        });
    }
    ;

    function removeVideoTag(index) {
        $scope.video.video_tags.splice(index, 1);
    }

    function playRange(videoTag) {
        PlayerData.playRange(videoTag.range[0], videoTag.range[1]);
    }

    function addStartRange(value) {
        $scope.videoTag.range = [$scope.videoTag.range[0] + value, $scope.videoTag.range[1]];
    }
    function addEndRange(value) {
        $scope.videoTag.range = [$scope.videoTag.range[0], $scope.videoTag.range[1] + value];
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
            $scope.videoTag.range[1] = MIN_TAG_DURATION;
            $scope.videoTag.range[0] = 0;
            return;
        }
        else if (i === 0 && (PlayerData.data.duration - newValue) <= MIN_TAG_DURATION) {
            $scope.videoTag.range[0] = PlayerData.data.duration - MIN_TAG_DURATION;
            $scope.videoTag.range[1] = PlayerData.data.duration;
            return;
        }

        $scope.videoTag.range[i] = newValue;
        if (($scope.videoTag.range[1] - $scope.videoTag.range[0]) < MIN_TAG_DURATION) {
            $scope.videoTag.range[1 - i] = $scope.videoTag.range[i] + (i === 1 ? -MIN_TAG_DURATION : MIN_TAG_DURATION);
        } else if (($scope.videoTag.range[1] - $scope.videoTag.range[0]) >= MAX_TAG_DURATION) {
            $scope.videoTag.range[1 - i] = $scope.videoTag.range[i] + (i === 1 ? -MAX_TAG_DURATION : MAX_TAG_DURATION);
        }
    }
    function findSimilarTags(range) {
        var limit = 0.6;                // TODO global variable
        var similarTags = [];
        angular.forEach($scope.video.video_tags, function(tag) {
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

// TODO remove duplicate with main controller
//    function view(data) {
//        $scope.playerInfo.id = data.id;
//        if (data.video_url != null) {
//            $scope.playerInfo.video_url = data.video_url;
//        }
//        $scope.playerInfo.begin = data.begin;
//        $scope.playerInfo.end = data.end;
//    }
});
module.controller('ViewSportController', function($scope, VideoTagData, $routeParams, PlayerData) {

    init();

    function init() {
        PlayerData.reset();
        PlayerData.title = 'Best in ' + $routeParams.sport;
        VideoTagData.setFilter('sport_name', $routeParams.sport);
        $scope.$parent.showVideoPlayer = true;
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

        $scope.$parent.showVideoPlayer = true;
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

        $scope.$parent.showVideoPlayer = true;
        VideoTagData.loadNextPage();
    }
});
module.controller('ExploreController', function($scope, VideoTagData, PlayerData) {

    init();


    function init() {
        PlayerData.reset();
        PlayerData.title = 'Best tricks';
        VideoTagData.setFilters({order: 'best'});

        $scope.$parent.showVideoPlayer = true;
        VideoTagData.loadNextPage();
    }

});

module.controller('SearchTagController', function($scope, TagEntity) {

    $scope.suggested = [];
    $scope.selected = [];

    $scope.refreshSuggestedTags = loadSuggestedTags;
    $scope.onSelectTag = onSelectTag;
    $scope.tagTransform = tagTransform;

    function init() {
    }


    init();

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
module.controller('SignupController', function($scope, $location, UserEntity, SharedData,
        messageCenterService, AuthenticationService) {

    SharedData.loadingState = 0;
    messageCenterService.removeShown();
    $scope.$parent.showVideoPlayer = false;
    $scope.signup = signup;

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
                angular.forEach(response.validationErrors.Users, function(errors, field) {
                    var errorString = Object.keys(errors).map(function(k) {
                        return errors[k];
                    }).join(', ');
                    console.log("Setting error '" + errorString + "' for field " + field);
                    $scope.signupForm[field].$setValidity('server', false);
                    $scope.signupForm[field].$error.server = errorString;
//                    angular.forEach(errors, function(error) {
//                       // keep the error messages from the server
//
//                    });
                });
            }
            $scope.isFormLoading = false;
        }, function() {
            $scope.isFormLoading = false;
        });

    }
});

module.controller('PagesController', function($scope, SharedData) {
    $scope.$parent.showVideoPlayer = false;
    SharedData.loadingState = 0;
});

module.controller('ProfileController', function($scope, $auth, toastr, Account) {
    $scope.getProfile = function() {
        Account.getProfile()
                .then(function(response) {
                    $scope.user = response.data;
                })
                .catch(function(response) {
                    toastr.error(response.data.message, response.status);
                });
    };
    $scope.updateProfile = function() {
        Account.updateProfile($scope.user)
                .then(function() {
                    toastr.success('Profile has been updated');
                })
                .catch(function(response) {
                    toastr.error(response.data.message, response.status);
                });
    };
    $scope.link = function(provider) {
        $auth.link(provider)
                .then(function() {
                    toastr.success('You have successfully linked a ' + provider + ' account');
                    $scope.getProfile();
                })
                .catch(function(response) {
                    toastr.error(response.data.message, response.status);
                });
    };
    // TODO
    $scope.unlink = function(provider) {
        $auth.unlink(provider)
                .then(function() {
                    toastr.info('You have unlinked a ' + provider + ' account');
                    $scope.getProfile();
                })
                .catch(function(response) {
                    toastr.error(response.data ? response.data.message : 'Could not unlink ' + provider + ' account', response.status);
                });
    };

    $scope.getProfile();
});