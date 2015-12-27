/*
 * Module for ...
 */
var module = angular.module('DefaultModule', ['ngRoute', 'ngCookies', 'CommonModule', 'ngResource']);

module.config(function($routeProvider, $controllerProvider) {

    $controllerProvider.allowGlobals();

    $routeProvider

            // route for the home page
            .when('/', {
                templateUrl: HTML_FOLDER + 'VideoTags/explore.html',
                controller: 'ExploreController'
            })
            .when('/view/:id', {
                templateUrl: HTML_FOLDER + 'Videos/view.html',
                controller: 'ViewVideoController'
            })
            .when('/tag/add/:id', {
                templateUrl: HTML_FOLDER + 'VideoTags/add.html',
                controller: 'AddVideoTagController'
            })
            .when('/video/add', {
                templateUrl: HTML_FOLDER + 'Videos/add.html',
                controller: 'AddVideoController'
            })
            .when('/add/:provider/:videoId', {
                templateUrl: HTML_FOLDER + 'VideoTags/add.html',
                controller: 'AddVideoTagController'
            })
            .when('/users/profile', {
                templateUrl: HTML_FOLDER + 'Users/profile.html',
                controller: 'UserController'
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

module.controller('MainController', function($scope, AuthenticationService, $location, ViewFeedback, SportEntity, SharedData) {
    // create a message to display in our view
    $scope.isAuthed = AuthenticationService.isAuthed();

    init();

    function init() {
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
            console.log(SharedData.categories);
        });
    }

    $scope.login = function(data) {
        $scope.feedback = ViewFeedback.loading();
        AuthenticationService.login(data.email, data.password, function(isLogin, response) {
            $scope.feedback = ViewFeedback.auto(response);
            $scope.isAuthed = isLogin;
            if (isLogin) {
                $location.path("/users/profile");
                return;
            }
        });
    };

    $scope.logout = function() {
        AuthenticationService.logout();
        $location.path("/users/login");
        $scope.isAuthed = AuthenticationService.isAuthed();
    };
});

module.controller('UserController',
        function($filter, $scope, $location, UserEntity, $routeParams, ViewFeedback, AuthenticationService) {


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

                    if (response.tag_string.length > 0) {
                        $scope.tags = $.map(response.tag_string.split(','), function(value) {
                            return {name: value, edition_status: 'keep'};
                        });
                    }
                    else {
                        $scope.tags = [{name: 'EditMePlease', edition_status: 'keep'}];
                    }

                    console.log(response);
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

module.controller('UserLoginController', function($scope, $location, AuthenticationService, ViewFeedback) {
    // create a message to display in our view

    function init() {
    }
    init();

});
module.controller('AddVideoController', function($scope, YoutubeVideoInfo, $location,
        VideoEntity, VideoTagEntity, PlayerProviders, ViewFeedback) {

    $scope.player = {
        width: '500px',
        height: null
    };
    $scope.data = {provider_id: PlayerProviders.list()[0].name, video_url: null};
    $scope.playerProviders = PlayerProviders.list();
    $scope.add = add;
    $scope.previewVideo = {};

    init();

    function init() {
        loadRecentlyTagged();

        $scope.$on('videoIdValidated', function(event, data) {
            $scope.previewVideo.video_url = data.video_url;
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
            if (found === terms.length){
                results.push(item);
            }
        });
        return results;
    };

});
module.controller('VideoTagPointsController', function($scope, VideoTagPointEntity){
    $scope.up = up;
    $scope.down = down;
    
    function up(data){
        VideoTagPointEntity.up({video_tag_id:data.id}, function(response){
            if (response.success){
                data.count_points = data.count_points + 1;
            }
        });
    }
    function down(data){
        VideoTagPointEntity.down({video_tag_id:data.id}, function(response){
            if (response.success){
                data.count_points = data.count_points - 1;
            }
        });
    }
});
module.controller('AddVideoTagController', function($scope, YoutubeVideoInfo, $filter,
        $routeParams, SportEntity, VideoEntity, VideoTagEntity, ViewFeedback, TagEntity, SharedData) {
    $scope.player = {
        width: '500px',
        height: null,
        provider: 'youtube'
    };
    $scope.playerInfo = {
        begin: 0,
        end: 0,
        video_url: null,
        duration: 0,
        currentTime: 0,
        width: '100%',
        height: '100%'
    };
    $scope.slider = {
        step: 0.5
    };
    $scope.addVideoTag = addVideoTag;
    $scope.removeVideoTag = removeVideoTag;
    $scope.sports = SharedData.sports;
    $scope.videoTag = {};
    $scope.suggestedTags = [];
    $scope.suggestedCategories = [];
    $scope.refreshSuggestedTags = refreshSuggestedTags;
    $scope.refreshSuggestedCategories = refreshSuggestedCategories;
    $scope.playRange = playRange;
    $scope.addStartRange = addStartRange;
    $scope.addEndRange = addEndRange;
    $scope.getCurrentPlayerTime = function() {
        return 0;
    };
    init();

    function init() {

        VideoEntity.view({id: $routeParams.id}, function(response) {
            $scope.video = response;
            $scope.playerInfo.video_url = response.video_url;

            YoutubeVideoInfo.duration($scope.playerInfo.video_url, function(duration) {
                $scope.playerInfo.duration = duration;
                $scope.videoTag.range = [0, duration];
            });
        });

        $scope.$watch('videoTag.range', function(newValue, oldValue) {
            if (newValue == undefined) {
                return;
            }
            if (oldValue == undefined || newValue[0] !== oldValue[0]) {
                $scope.playerInfo.currentTime = newValue[0];
            }
            else if (newValue[1] !== oldValue[1]) {
                $scope.playerInfo.currentTime = newValue[1];
            }
        });
        $scope.$on('onYouTubePlayerReady', function(event, player) {
            $scope.getCurrentPlayerTime = function() {
                return player.getCurrentTime();
            };
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
    ;
    function addVideoTag(data) {
        console.log(data);
        var videoTag = {
            name: data.tag.name,
            begin: data.range[0],
            end: data.range[1],
            category: data.category_id,
            sport: data.sport_id,
            removable: true,
            count_points: 0
        };
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
            if (response.success) {
                $scope.video.video_tags.push(videoTag);
            }
            else {
                ViewFeedback.failure(response);
            }
        });
    }
    ;

    function removeVideoTag(index) {
        $scope.video.video_tags.splice(index, 1);
    }

    function playRange(range) {
        $scope.playerInfo.begin = range[0];
        $scope.playerInfo.end = range[1];
    }

    function addStartRange(value) {
        $scope.videoTag.range = [$scope.videoTag.range[0] + value, $scope.videoTag.range[1]];
    }
    function addEndRange(value) {
        $scope.videoTag.range = [$scope.videoTag.range[0], $scope.videoTag.range[1] + value];
    }
});
module.controller('ViewVideoController', function($scope, VideoEntity, $routeParams) {
    $scope.video = {};
    $scope.playerInfo = {
        video_url: null,
        width: '100%',
        height: '100%'
    };
    $scope.view = view;
    
    init();
    
    function view(data) {
        console.log(data);
        $scope.playerInfo.video_url =  $scope.video.video_url;
        $scope.playerInfo.begin=  data.begin;
        $scope.playerInfo.end= data.end;
    }

    function init(){
        VideoEntity.view({id: $routeParams.id}, function(video){
            $scope.video = video;
            $scope.playerInfo.video_url = video.video_url;
        });
    }
});
module.controller('ExploreController', function($scope, TagEntity, VideoTagEntity) {

    $scope.view = view;

    $scope.video = {
        id: null,
        url: false,
        begin: 0,
        width: '100%',
        height: '100%'
    };

    init();

    function init() {
        loadVideoTags();
    }

    function view(data) {
        //alert('view' + data);
        console.log(data);
        $scope.video = data;
    }

    function loadVideoTags() {
        VideoTagEntity.best({}, function(response) {
            $scope.videoTags = response;
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


