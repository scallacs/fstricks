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
            .when('/view/:id', {
                templateUrl: HTML_FOLDER + 'Videos/view.html',
                controller: 'ViewVideoController'
            })
            .when('/Videos/view/:id', {
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
            .when('/tag/add/:id', {
                templateUrl: HTML_FOLDER + 'VideoTags/add.html',
                controller: 'AddVideoTagController'
            })
            .when('/trick/:id', {
                templateUrl: HTML_FOLDER + 'Videos/view.html',
                controller: 'ViewVideoTagController'
            })
            .when('/video/add', {
                templateUrl: HTML_FOLDER + 'Videos/add.html',
                controller: 'AddVideoController'
            })
            .when('/add/:provider/:videoId', {
                templateUrl: HTML_FOLDER + 'VideoTags/add.html',
                controller: 'AddVideoTagController'
            })
//            .when('/users/profile', {
//                templateUrl: HTML_FOLDER + 'Users/profile.html',
//                controller: 'UserController'
//            })
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
            .when('/users/profile/:username', {
                templateUrl: HTML_FOLDER + 'Users/profile.html',
                controller: 'UserController'
            });
});

module.controller('MainController', function($scope, AuthenticationService,
        $location, ViewFeedback, SportEntity, SharedData, TagEntity, $uibModal, PlayerProviders, YT_event) {
    // create a message to display in our view
    $scope.isAuthed = AuthenticationService.isAuthed();
    $scope.searchTags = [];
    $scope.search = {tag: null};
    $scope.currentSport = null;
    $scope.isViewLoading = true;

    $scope.refreshSearchedTags = refreshSearchedTags;
    $scope.login = login;
    $scope.logout = logout;
    $scope.setCurrentSport = setCurrentSport;
    $scope.resetVideo = resetVideo;

    $scope.playerInfo = {
        begin: 0,
        end: 0,
        video_url: null,
        duration: 0,
        currentTime: 0,
        goToTime: null,
        width: '100%',
        height: '100%',
        id: null
    };

    $scope.video = {
        video_tags: []
    };
    $scope.player = {
        provider: PlayerProviders.list()[0].name
    };

    $scope.showVideoPlayer = false;

    $scope.view = view;
    $scope.openReportErrorModal = openReportErrorModal;

    $scope.getCurrentPlayerTime = function() {
        return 0;
    };

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
        
        $scope.$on('showVideoPlayer', function (newVal){
            if (newVal === false){
                resetVideo();
            }
        });

        resetVideo();
        // loading sports 
        SportEntity.index({}, function(response) {
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
        });
    }

    function resetVideo() {
        $scope.$parent.$broadcast(YT_event.STOPED, {});

        $scope.playerInfo.video_url = null;
        $scope.playerInfo.id = 0;
        $scope.playerInfo.begin = 0;
        $scope.playerInfo.end = 0;
        $scope.video.video_tags = [];
    }

    function login(data) {
        $scope.feedback = ViewFeedback.loading();
        AuthenticationService.login(data.email, data.password, function(isLogin, response) {
            $scope.feedback = ViewFeedback.auto(response);
            $scope.isAuthed = isLogin;
            if (isLogin) {
                $location.path("/users/settings");
                return;
            }
        });
    }

    function logout() {
        AuthenticationService.logout();
        $location.path("/users/login");
        $scope.isAuthed = AuthenticationService.isAuthed();
    }

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


    function view(data) {
        $scope.playerInfo.id = data.id;
        if (data.video_url != null) {
            $scope.playerInfo.video_url = data.video_url;
        }
        $scope.playerInfo.begin = data.begin;
        $scope.playerInfo.end = data.end;
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


module.controller('ModalReportErrorController', function($scope, $uibModalInstance, ErrorReportEntity, ViewFeedback, videoTag) {
    $scope.videoTag = videoTag;
    $scope.feedback = null;

    $scope.ok = function() {
        $uibModalInstance.close($scope.videoTag);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.sendReport = function(errorReport) {
        errorReport.video_tag_id = videoTag.id;
        ErrorReportEntity.post(errorReport, function(response) {
            console.log(response);
            if (response.success) {
                $uibModalInstance.close($scope.videoTag);
            }
            else {
                $scope.feedback = ViewFeedback.auto(response);
            }
        });
    };
});


module.controller('SettingsController', function($scope, SharedData, messageCenterService, AuthenticationService, UserEntity) {
    $scope.data = {};
    $scope.password = '';
    $scope.removeAccount = removeAccount;

    init();

    function init() {
        $scope.$parent.showVideoPlayer = false;
        SharedData.loadingState = 0;
        $scope.data.user = AuthenticationService.getCurrentUser();
        console.log($scope.data);
    }

    function removeAccount(password) {
        messageCenterService.removeShown();
        UserEntity.removeAccount({password: password}, function(response) {
            if (response.success) {
                messageCenterService.add('success', response.message, {status: messageCenterService.status.next});
                $scope.$parent.logout();
            }
            else {
                messageCenterService.add('warning', response.message, {status: messageCenterService.status.shown});
            }
        });
    }
});

module.controller('UserController',
        function($filter, $scope, $location, UserEntity, $routeParams,
                ViewFeedback, AuthenticationService, SharedData) {


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

module.controller('UserLoginController', function($scope, $auth, SharedData) {
    // create a message to display in our view
    $scope.$parent.showVideoPlayer = false;
    $scope.authenticate = function(provider) {
        $auth.authenticate(provider);
    };

    function init() {
        SharedData.loadingState = 0;
    }
    init();

});
module.controller('AddVideoController', function($scope, YoutubeVideoInfo, $location,
        VideoEntity, VideoTagEntity, PlayerProviders, ViewFeedback, SharedData) {

    $scope.data = {provider_id: PlayerProviders.list()[0].name, video_url: null};
    $scope.playerProviders = PlayerProviders.list();
    $scope.add = add;

    init();

    function init() {
        $scope.feedback = null;
        $scope.$parent.showVideoPlayer = false;
        SharedData.loadingState = 0;

        loadRecentlyTagged();

        $scope.$on('videoIdValidated', function(event, data) {
            $scope.$parent.playerInfo.video_url = data.video_url;
        });
    }

    function add(data) {
        VideoEntity.addOrGet(data, function(response) {
            if (response.success) {
                $location.path('/tag/add/' + response.data.id);
            }
            else {
                $scope.feedback = ViewFeedback.failure(response);
            }
        });
    }

    function loadRecentlyTagged() {
        VideoTagEntity.recentlyTagged({}, function(response) {
            angular.forEach(response, function(video) {
                YoutubeVideoInfo.data(video.video_url, function(data) {
                    if (data.items.length > 0) {
                        video.provider_data = data.items[0];
                    }
                    else {
                        video.provider_data = null;
                    }
                });
            });
            console.log(response);
            $scope.recentVideos = response;

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
        VideoTagPointEntity.up({video_tag_id: data.id}, function(response) {
            if (response.success) {
                data.count_points = data.count_points + 1;
            }
        });
    }
    function down(data) {
        VideoTagPointEntity.down({video_tag_id: data.id}, function(response) {
            if (response.success) {
                data.count_points = data.count_points - 1;
            }
        });
    }
});
module.controller('ViewVideoTagController', function($scope, VideoTagEntity, $routeParams, SharedData) {

    init();

    function init() {
        VideoTagEntity.view({id: $routeParams.id}, function(tag) {
            $scope.$parent.video.video_url = tag.video_url;
            $scope.$parent.video.video_tags = [tag];
            $scope.$parent.playerInfo = tag;
            SharedData.loadingState = 0;
            $scope.$parent.showVideoPlayer = true;
        });
    }
});
module.controller('AddVideoTagController', function($scope, YoutubeVideoInfo, $filter,
        $routeParams, SportEntity, VideoEntity, VideoTagEntity, ViewFeedback, TagEntity, SharedData,
        messageCenterService) {

    var MIN_TAG_DURATION = 3;
    var MAX_TAG_DURATION = 30;

    $scope.slider = {
        step: 0.5
    };
    $scope.videoTag = {
        begin: 0,
        end: 0,
        range: [0, MIN_TAG_DURATION],
        tag: {}
    };
    $scope.video = {video_tags: []};
    $scope.playerInfo = {begin: 0, end: 0};
    $scope.similarTags = [];
    $scope.isFormLoading = false;

    $scope.addVideoTag = addVideoTag;
    $scope.removeVideoTag = removeVideoTag;
    $scope.sports = SharedData.sports;
    $scope.suggestedTags = [];
    $scope.suggestedCategories = [];
    $scope.refreshSuggestedTags = refreshSuggestedTags;
    $scope.refreshSuggestedCategories = refreshSuggestedCategories;
    $scope.playRange = playRange;
    $scope.addStartRange = addStartRange;
    $scope.addEndRange = addEndRange;
    $scope.setStartRangeNow = setStartRangeNow;
    $scope.setEndRangeNow = setEndRangeNow;
    $scope.view = view;
    init();

    function init() {
        $scope.$parent.showVideoPlayer = false;

        VideoEntity.view({id: $routeParams.id}, function(response) {
            $scope.video = response;
            $scope.playerInfo.video_url = response.video_url;

            YoutubeVideoInfo.duration($scope.playerInfo.video_url, function(duration) {
                $scope.playerInfo.duration = duration;
            });

            SharedData.loadingState = 0;
        });

        $scope.$watch('videoTag.range', function(newValue, oldValue) {
            if (newValue == undefined) {
                return;
            }
            if (oldValue == undefined || newValue[0] !== oldValue[0]) {
                $scope.playerInfo.goToTime = newValue[0];
                adaptRange(newValue[0], newValue, 0);
            }
            else if (newValue[1] !== oldValue[1]) {
                $scope.playerInfo.goToTime = newValue[1];
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
                if (results.length === 0) {
                    $scope.suggestedTags = [{
                            is_new: true,
                            name: trick,
                            sport_name: category.sport_name,
                            category_name: category.category_name,
                            sport_id: category.sport_id,
                            category_id: category.category_id
                        }];
                }
                else {
                    $scope.suggestedTags = results;
                }
            });
        }
    }

    function addVideoTag(data) {

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
                messageCenterService.add('success', response.message);

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
                messageCenterService.add('warning', response.message, {status: messageCenterService.status.shown});
            }
        });
    }
    ;

    function removeVideoTag(index) {
        $scope.video.video_tags.splice(index, 1);
    }

    function playRange(videoTag) {
        $scope.playerInfo.begin = videoTag.range[0];
        $scope.playerInfo.end = videoTag.range[1];
    }

    function addStartRange(value) {
        $scope.videoTag.range = [$scope.videoTag.range[0] + value, $scope.videoTag.range[1]];
    }
    function addEndRange(value) {
        $scope.videoTag.range = [$scope.videoTag.range[0], $scope.videoTag.range[1] + value];
    }
    function setStartRangeNow() {
        adaptRange($scope.$parent.getCurrentPlayerTime(), $scope.videoTag.range, 0);
    }
    function setEndRangeNow() {
        adaptRange($scope.$parent.getCurrentPlayerTime(), $scope.videoTag.range, 1);
    }

    function adaptRange(newValue, data, i) {

        if (i === 1 && newValue <= MIN_TAG_DURATION) {
            $scope.videoTag.range[1] = MIN_TAG_DURATION;
            $scope.videoTag.range[0] = 0;
            return;
        }
        else if (i === 0 && ($scope.playerInfo.duration - newValue) <= MIN_TAG_DURATION) {
            $scope.videoTag.range[0] = $scope.playerInfo.duration - MIN_TAG_DURATION;
            $scope.videoTag.range[1] = $scope.playerInfo.duration;
            return;
        }

        $scope.videoTag.range[i] = newValue;
        if (Math.abs($scope.videoTag.range[i] - $scope.videoTag.range[1 - i]) < MIN_TAG_DURATION) {
            $scope.videoTag.range[1 - i] = $scope.videoTag.range[i] + (i === 1 ? -MIN_TAG_DURATION : MIN_TAG_DURATION);
        } else if (Math.abs($scope.videoTag.range[i] - $scope.videoTag.range[1 - i]) >= MAX_TAG_DURATION) {
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
    function view(data) {
        $scope.playerInfo.id = data.id;
        if (data.video_url != null) {
            $scope.playerInfo.video_url = data.video_url;
        }
        $scope.playerInfo.begin = data.begin;
        $scope.playerInfo.end = data.end;
    }
});
module.controller('ViewSportController', function($scope, $filter, SportEntity, $routeParams, SharedData) {


    init();

    function init() {
        $scope.$parent.resetVideo();

        SportEntity.view({
            id: $routeParams.sport
        }, function(response) {
            $scope.$parent.video.video_tags = response;
            SharedData.loadingState = 0;
            SharedData.currentSport = $filter('getSportByName')(SharedData.sports, $routeParams.sport);
            $scope.$parent.currentSport = SharedData.currentSport;
            $scope.$parent.showVideoPlayer = true;
        });
    }


});
module.controller('ViewTagController', function($scope, TagEntity, $routeParams, SharedData) {

    init();

    function init() {
        TagEntity.view({
            sport: $routeParams.sport,
            category: $routeParams.category,
            trick: $routeParams.trick
        }, function(response) {
            $scope.$parent.video.video_tags = response;
            SharedData.loadingState = 0;

            $scope.$parent.showVideoPlayer = true;
        });
    }
});
module.controller('ViewVideoController', function($scope, VideoEntity, $routeParams, SharedData) {

    init();

    function init() {
        $scope.$parent.showVideoPlayer = false;
        VideoEntity.view({id: $routeParams.id}, function(video) {
            $scope.$parent.video = video;
            $scope.playerInfo.video_url = video.video_url;
            SharedData.loadingState = 0;
            $scope.$parent.showVideoPlayer = true;
        });
    }
});
module.controller('ExploreController', function($scope, TagEntity, VideoTagEntity, SharedData) {

    init();

    function init() {
        $scope.$parent.showVideoPlayer = true;
        loadVideoTags();
    }

    function loadVideoTags() {
        VideoTagEntity.best({}, function(response) {
            $scope.$parent.video.video_tags = response;
            SharedData.loadingState = 0;
        });
    }
});

module.controller('SearchTagController', function($scope, TagEntity) {

    $scope.suggested = [];
    $scope.selected = [];

    $scope.refreshSuggestedTags = loadSuggestedTags;
    $scope.onSelectTag = onSelectTag;
    $scope.tagTransform = tagTransform;

    function init() {
        loadSuggestedTags('');
    }

    function loadSuggestedTags(term) {
        TagEntity.suggest({id: term}, function(results) {
            $scope.suggested = results;
        });
    }
    ;
    init();

    function onSelectTag($item, $model) {
        $scope.$emit('onSelectedTagUpdated', $scope.selected);
    }
    ;

    function onRemoveTag($item, $model) {
        $scope.$emit('onSelectedTagUpdated', $scope.selected);
    }
    ;

    function loadSuggestedTags(term) {
        TagEntity.suggest({id: term}, function(results) {
            $scope.suggested = results;
        });
    }
    ;

    function tagTransform(term) {
        return {
            isTag: true,
            name: term,
            count_ref: 0,
            id: null
        };

    }
    ;

})
        ;


