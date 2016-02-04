/*
 * Module for generating fake spot and testing
 */
var commonModule = angular.module('CommonModule', [
    'ngResource',
    'ngMessages',
    'ngRoute',
    'ui.bootstrap',
    'ui.slider',
    'ui.select',
    'djds4rce.angular-socialshare',
    'angularUtils.directives.dirPagination',
    'infinite-scroll',
    'satellizer',
    'MessageCenterModule'], function($routeProvider, $locationProvider, $httpProvider) {

    //$locationProvider.html5Mode(true).hashPrefix('!');

    var interceptor = ['$location', '$rootScope', '$q', function($location, scope, $q) {

            function requestError(rejection) {
                console.log(rejection);
//            var status = rejection.status;
////
//            if (status == 401) {
//                $location.path("/login");
//                return;
//            }
//            // otherwise
                return $q.reject(rejection);
            }


            function responseError(rejection) {
                console.log(rejection);
                var status = rejection.status;
                if (status === 401) {
                    $location.path("/login");
                    //window.location = "/login";
                    return;
                }
                else if (status >= 500) {
                    alert('This functinality is not available for now. Try again later');
                    return;
                }
                return $q.reject(rejection);
            }

            return {
                request: function(config) {
                    return config;
                },
                responseError: responseError,
                requestError: requestError,
                response: function(response) {
                    return response;
                }
            };
        }];
    $httpProvider.interceptors.push(interceptor);
});


commonModule.config(function($authProvider, API_KEYS) {
    $authProvider.facebook({
        clientId: API_KEYS.facebook,
        url: WEBROOT_FULL + '/users/facebook_login.json',
        redirectUri: WEBROOT_FULL
    });

    $authProvider.withCredentials = true;
    $authProvider.tokenRoot = null;
    $authProvider.cordova = false;
    $authProvider.baseUrl = '/';
//    $authProvider.loginUrl = WEBROOT_FULL + 'users/login';
//    $authProvider.signupUrl = WEBROOT_FULL + 'users/signup';
//    $authProvider.unlinkUrl = WEBROOT_FULL + 'users/unlink';
    $authProvider.tokenName = 'token';
    $authProvider.tokenPrefix = '';//'satellizer';
    $authProvider.authHeader = 'Authorization';
    $authProvider.authToken = 'Bearer';
    $authProvider.storageType = 'localStorage';
//    $authProvider.google({
//        clientId: 'Google Client ID'
//    });
//    $authProvider.instagram({
//        clientId: 'Instagram Client ID'
//    });
});

//app.config(['flowFactoryProvider', function (flowFactoryProvider) {
//  flowFactoryProvider.defaults = {
//    target: 'upload.php',
//    permanentErrors: [404, 500, 501],
//    maxChunkRetries: 1,
//    chunkRetryInterval: 5000,
//    simultaneousUploads: 4,
//    singleFile: true
//  };
//  flowFactoryProvider.on('catchAll', function (event) {
//    console.log('catchAll', arguments);
//  });
//  // Can be used with different implementations of Flow.js
//  // flowFactoryProvider.factory = fustyFlowFactory;
//}]);

commonModule.run(function($FB, API_KEYS, $rootScope, $location) {
    $FB.init(API_KEYS.facebook);
    $rootScope.WEBROOT_FULL = WEBROOT_FULL;

    $rootScope.$on('$locationChangeStart', function() {
        $rootScope.previousPage = location.pathname;
    });
});
commonModule.constant('YT_event', {
    PAUSED: 0,
    PLAYING: 1,
    STOPED: 2,
    UNSARTED: 3,
    STATUS_CHANGE: 4,
    LOAD_VIDEO: 5,
    PLAY_TAG: 6,
});
commonModule.constant('API_KEYS', {
    facebook: '1536208040040285'
});
commonModule.directive('youtube', function($window, YT_event, VideoEntity, PlayerData) {

    var myTimer;

    function initPlayer(element, scope) {
        var player;

        var playerContainer = element.children()[0];
        var player = new YT.Player(playerContainer, {
            playerVars: {
                autoplay: 0,
                html5: 1,
                theme: "light",
                modesbranding: 0,
                color: "white",
                iv_load_policy: 3,
                showinfo: 1,
                controls: 1,
                rel: 0,
                loop: 1
            },
            height: scope.playerData.data.height,
            width: scope.playerData.data.width, //scope.playerData.data.width,
            videoId: scope.playerData.data.video_url,
            events: {
                onError: function(error) {
                    switch (error.data) {
                        case 2: // Invalid id
                            break;
                        case 100: // Video has been removed
                        case 101: // Video is private
                        case 150: // Same, video is private
                            VideoEntity.reportDeadLink({
                                id: PlayerData.player.getVideoData()['video_id'],
                                provider: 'youtube'
                            }, function() {
                                // ignore results
                            });
                            break
                    }
                },
                onReady: function() {
                    scope.$emit('onYouTubePlayerReady', player);

                    PlayerData.setPlayer(player);
//                    scope.$watch('playerData.data.video_url', function(newValue, oldValue) {
//                        if (scope.playerData.data.video_url) {
//                            PlayerData.view(scope.playerData.data);
//                        }
//                    });
                },
                onStateChange: function(event) {
                    clearInterval(myTimer);
                    if (event.data === YT.PlayerState.PLAYING) { // playing
                        myTimer = setInterval(function() {
                            var newTime = player.getCurrentTime();
                            scope.playerData.onCurrentTimeUpdate(newTime);
                            scope.$apply(function() {
                                scope.playerData.data.currentTime = newTime;
                            });
                        }, 100); // 100 means repeat in 100 ms
                    }

                    switch (event.data) {
                        case YT.PlayerState.ENDED:
                            player.seekTo(scope.playerData.data.begin);
                            break;
                    }
                }
            }
        });
    }

    return {
        restrict: "E",
        scope: {playerData: '='},
        template: '<div></div>',
        link: function(scope, element, attrs, $rootScope) {
            if (typeof YT === 'undefined') {
                var tag = $('<script/>').attr({
                    src: "https://www.youtube.com/iframe_api"
                });
                $('head').prepend(tag);
            }
            else {
                initPlayer(element, scope);
            }
            $window.onYouTubeIframeAPIReady = function() {
                initPlayer(element, scope);
            };


        }
    };
});
commonModule.directive('integer', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$validators.integer = function(modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty models to be valid
                    return true;
                }

                if (INTEGER_REGEXP.test(viewValue)) {
                    // it is valid
                    return true;
                }

                // it is invalid
                return false;
            };
        }
    };
});

commonModule.directive('ruleYoutubeVideoId', function($q, YoutubeVideoInfo) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            ctrl.$asyncValidators.youtubeVideoId = function(videoId, viewValue) {

                if (ctrl.$isEmpty(videoId)) {
                    // consider empty model valid
                    return $q.when();
                }

                var def = $q.defer();

                if (YoutubeVideoInfo.extractVideoIdFromUrl(videoId)) {
                    videoId = YoutubeVideoInfo.extractVideoIdFromUrl(videoId);
                }

                YoutubeVideoInfo.exists(videoId, function(exists) {
                    // Mock a delayed response
                    if (exists) {
                        scope.$emit('videoIdValidated', {videoId: videoId});
                        def.resolve();
                    } else {
                        def.reject();
                    }

                });

                return def.promise;
            };
        }
    };
});

commonModule.filter('percentage', function() {
    return function(input, total) {
        return (parseInt(input) * 100.0 / total) + '%';
    };
});

commonModule.filter('imageUrl', function() {
    return function(input) {
        return WEBROOT_FULL + '/img/sports/' + input + '.png';
    };
});

commonModule.filter('timestamp', function() {
    return function(timestamp) {
        var date = new Date(timestamp * 1000);
        var datevalues = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
        return datevalues;
    };
});
commonModule.filter('yesNo', function() {
    return function(input) {
        return input ? 'yes' : 'no';
    }
});

commonModule.filter('camelCase', function() {
    return function(str) {
        str = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
        str[0] = str.charAt(0).toUpperCase();
        return str;
    };
});
commonModule.filter('datasize', function() {
    return function(input) {
        if (input > 1024.0) {
            return (input / 1024).toFixed(4) + ' KB';
        } else if (input > 1024 * 1024) {
            return (input / 1024.0 * 1024).toFixed(4) + ' MB';
        }
    };
});
/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
commonModule.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function(item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

commonModule.filter('secondsToHours', function() {
    return function(seconds) {
        var hours = parseInt(seconds / 3600);
        var minutes = parseInt((seconds % 3600) / 60);
        var seconds = seconds % 3600 % 60;
        var decades = parseInt((seconds - parseInt(seconds)) * 10);
        seconds = parseInt(seconds);
        return (hours > 0 ? (hours < 10 ? '0' : '') + hours + ':' : '') + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds
                + '.' + decades;
    }
});

commonModule.filter('timeago', function() {
    return function(timestamp) {
        return jQuery.timeago(timestamp);
    };
});
commonModule.factory('SharedData', function() {
    var data = {
        loadingState: 1
    };
    return data;
});
commonModule.factory('PlayerData', function(YT_event, VideoTagData) {

    return {
        extra_class: '',
        player: null,
        currentTag: null,
        show: true,
        showListTricks: true,
        data: {
            begin: 0,
            end: 0,
            video_url: null,
            duration: 0,
            currentTime: 0,
            width: '100%',
            height: '100%',
            id: null
        },
        url: url,
        view: function() {
        },
        replay: function() {
        },
        reset: function() {
        },
        play: function() {
        },
//        playRange: function() {
//        },
        stop: function() {
        },
        seekTo: function() {
        },
        pause: function() {
        },
        loadVideo: function() {
        },
        onCurrentTimeUpdate: function() {

        },
        setPlayer: function(player) {
            this.player = player;
            this.view = view;
            this.replay = replay;
            this.reset = reset;
            this.play = play;
//            this.playRange = playRange;
            this.stop = stop;
            this.seekTo = seekTo;
            this.pause = pause;
            this.loadVideo = loadVideo;
            this.playVideoRange = playVideoRange;
        }

    };

    function playVideoRange(data) {
        var info = {
            videoId: data.video_url,
            startSeconds: data.begin,
            endSeconds: data.end
        };
//            console.log(info);
        this.player.loadVideoById(info);
    }

    function view(videoTag) {
        console.log("Viewing tag id " + videoTag.id);
//        console.log(videoTag);
        if (videoTag === null) {
            this.currentTag = null;
            return;
        }
        this.currentTag = videoTag;
        this.data.id = videoTag.id;
        this.data.begin = videoTag.begin;
        this.data.end = videoTag.end;
        this.data.video_url = videoTag.video_url;
        this.showListTricks = false;

        this.playVideoRange(videoTag);
//        // If we change the video url or we change the video end we need to load it 
//        if ((videoTag.video_url !== null && videoTag.video_url !== this.data.video_url)
//                || (videoTag.end != null && videoTag.end !== this.data.end)) {
//            playVideoRange(videoTag);
//        }
//        else {
//            this.seekTo(this.data.begin);
//        }
//        this.play();
    }

    function replay(videoTag) {
        this.seekTo(videoTag.begin);
    }

    function reset() {
        VideoTagData.reset();
        this.stop();
        this.extra_class = '';
        this.show = true;
        this.currentTag = null;
        this.data.video_url = null;
        this.data.id = 0;
        this.data.begin = 0;
        this.data.end = 0;
        this.data.currentTime = 0;
        this.showListTricks = true;
        this.onCurrentTimeUpdate = function() {
        };
    }

    function url(url) {
        this.data.video_url = url;
    }

    function play() {
        this.player.playVideo();
    }
//
//    function playRange(begin, end) {
//        this.view({
//            beign: begin,
//            end: end
//        });
//    }
    function seekTo(val) {
        this.player.seekTo(val);
    }
    function pause() {
        this.player.pauseVideo();
    }

    function stop() {
        if (this.player != null) {
            this.player.stopVideo();
        }
    }

    function loadVideo(url) {
        console.log('Load video in playerData');
        this.data.video_url = url;
        this.play();
    }
});
commonModule.factory('VideoTagData', function(VideoTagEntity, SharedData) {
    var filters = {};

    return {
        data: [],
        current: 0, // Index of the current tag 
        disabled: true,
        loading: false,
        currentPage: 1,
        callbackSuccess: null,
        callbackError: null,
        reset: function() {
            this.currentPage = 1;
            this.data = [];
            filters = {};
            this.callbackSuccess = null;
            this.callbackError = null;
        },
        setFilter: function(name, value) {
            filters[name] = value;
        },
        setFilters: function(value) {
            filters = value;
        },
        setOrder: function(value) {
            filters.order = value;
        },
        next: function() {
            if (this.hasNext()) {
                this.current++;
                return this.data[this.current];
            }
            return null;
        },
        hasPrev: function() {
            return this.current > 0;
        },
        hasNext: function() {
            return this.current < this.data.length - 1;
        },
        prev: function() {
            if (this.hasPrev()) {
                this.current--;
                return this.data[this.current];
            }
            return null;
        },
        findNextTagToPlay: function(playerTime) {
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i].begin > playerTime) {
                    this.current = i;
                    return this.data[i];
                }
            }
            return null;
        },
        loadNextPage: function() {
            //alert(this.currentPage);
            this.loading = true;
            this.disabled = false;
            var that = this;
            filters.page = this.currentPage;
            SharedData.loadingState = this.data.length > 0 ? 0 : 1;
            VideoTagEntity.search(filters, function(tags) {
                console.log('Loading page ' + that.currentPage + ': ' + tags.length + ' tag(s)');
                if (tags.length < this.limit) {
                    that.disabled = true;
                }
                for (var i = 0; i < tags.length; i++) {
                    that.data.push(tags[i]);
                }
                that.loading = false;
                that.currentPage += 1;
                SharedData.loadingState = 0;
                if (that.callbackSuccess !== null)
                    that.callbackSuccess(tags);

            }, function() {
                that.loading = false;
                that.disabled = true;
                SharedData.loadingState = 0;
                if (that.callbackError !== null)
                    that.callbackError();
            });
        }
    };
});
commonModule.factory('SharedScope', function() {
    var myService = {
        emptyAvatarPath: IMAGE_FOLDER + DS + 'icon_avatar.png'
    };
    return myService;
});

commonModule.factory('RiderEntity', function($resource) {
    var url = WEBROOT_FULL + '/Riders/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        search: {
            method: 'GET',
            params: {action: 'local_search'},
            isArray: false
        },
        save: {
            method: 'POST',
            params: {action: 'save'},
            isArray: false
        },
        add: {
            method: 'POST',
            params: {action: 'add'},
            isArray: false
        },
        profile: {
            method: 'GET',
            params: {action: 'profile'},
            isArray: false
        }
    });
});

commonModule.factory('UserEntity', function($resource) {
    var url = WEBROOT_FULL + '/Users/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        profile: {
            method: 'GET',
            params: {action: 'profile'},
            isArray: false
        },
        edit: {
            method: 'POST',
            params: {action: 'edit'},
            isArray: false
        },
        removeAccount: {
            method: 'POST',
            params: {action: 'remove_account'},
            isArray: false
        },
        login: {
            method: 'POST',
            params: {action: 'login'},
            isArray: false
        },
        signup: {
            method: 'POST',
            params: {action: 'signup'},
            isArray: false
        },
        logout: {
            method: 'POST',
            params: {action: 'logout', id: null},
            isArray: false
        }
    });
});
commonModule.factory('ErrorReportEntity', function($resource) {
    var url = WEBROOT_FULL + '/ReportErrors/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        post: {
            method: 'POST',
            params: {action: 'add'},
            isArray: false
        }
    });
});
commonModule.factory('VideoEntity', function($resource) {
    var url = WEBROOT_FULL + '/Videos/:action/:id/:provider.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        addOrGet: {
            method: 'POST',
            params: {action: 'addOrGet', id: null},
            isArray: false
        },
        view: {
            method: 'GET',
            params: {action: 'view'},
            isArray: false
        },
        search: {
            method: 'GET',
            params: {action: 'search', id: null},
            isArray: false
        },
        reportDeadLink: {
            method: 'GET',
            params: {action: 'report_dead_link', id: null},
            isArray: false
        }
    });
});
commonModule.factory('AuthenticationService', function($http, $cookies, $rootScope, UserEntity, $location) {
    var service = {};

    var currentUser = null;

    service.login = login;
    service.logout = logout;
    service.setCredentials = setCredentials;
    service.clearCredentials = clearCredentials;
    service.getCurrentUser = getCurrentUser;
    service.isAuthed = isAuthed;
    service.socialLogin = socialLogin;
    service.signup = signup;
    service.requireLogin = requireLogin;

    return service;

    function getCurrentUser() {
        if (currentUser === false) {
            return null;
        }
        if (currentUser !== null) {
            return currentUser;
        }

        var globals = $cookies.getObject('globals');
        if (!globals) {
            return null;
        }
        var user = globals.currentUser;
        console.log("Getting current user: " + user.email);
        return user;
    }
    function isAuthed() {
        return getCurrentUser() !== null;
    }

    function login(username, password, callback) {

        UserEntity.login({email: username, password: password, id: null}, function(response) {
            console.log(response);
            if (response.success) {
                response.data.provider = null;
                setCredentials(response.data);
            }
            callback(response.success, response);
        });
    }

    function signup(data, callback) {
        UserEntity.signup(data, function(response) {
            console.log(response);
            if (response.success) {
                setCredentials(response.data);
            }
            callback(response.success, response);
        });
    }

    function socialLogin(provider, callback) {

        UserEntity.login({id: null, provider: provider}, function(response) {
            console.log(response);
            if (response.success) {
                response.data.provider = provider;
                setCredentials(response.data);
            }
            callback(response.success, response);
        });
    }

    function setCredentials(data) {
        currentUser = data;
        $rootScope.globals = {currentUser: currentUser};
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
        $cookies.remove('globals');
        $cookies.putObject('globals', $rootScope.globals);

        console.log("Setting credential for user: " + data.email + " - stored: " + getCurrentUser().email);
    }

    function logout() {
        clearCredentials();
    }

    function clearCredentials() {
        currentUser = false;
        $rootScope.globals = {};
        $cookies.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic';
        console.log("Clearing credential");
    }

    function requireLogin() {
        if (!isAuthed()) {
            console.log("User needs to be logged in to access this content");
            $location.path('/login');
        }
    }

});
commonModule.factory('YoutubeVideoInfo', function() {

    return {
        duration: duration,
        info: contentDetails,
        exists: exists,
        data: data,
        extractVideoIdFromUrl: extractVideoIdFromUrl,
        snippet: snippet
    };

    function extractVideoIdFromUrl(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }

    function getUrl(videoUrl) {
        return "https://www.googleapis.com/youtube/v3/videos?id=" + videoUrl +
                "&key=AIzaSyDYwPzLevXauI-kTSVXTLroLyHEONuF9Rw&part=snippet,contentDetails";
    }
    function exists(videoUrl, callback) {
        var url = getUrl(videoUrl);
        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function(data) {
                if (data.items.length > 0) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            },
            error: function() {
                callback(false);
            }
        });
    }
    function data(videoUrl, callback) {
        var url = getUrl(videoUrl);
        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function(data) {
                callback(data);
            },
            error: function() {
                callback(null);
            }
        });
    }
    function contentDetails(videoUrl, callback) {
        var url = getUrl(videoUrl);
        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function(data) {
                if (data.items.length > 0) {
                    var contentDetails = data.items[0].contentDetails;
                    callback(contentDetails);
                }
                else {
                    callback(null);
                }
            },
            error: function() {
                callback(null);
            }
        });
    }
    function snippet(videoUrl, callback) {
        var url = getUrl(videoUrl);
        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function(data) {
                if (data.items.length > 0) {
                    var snippet = data.items[0].snippet;
                    callback(snippet);
                }
                else {
                    callback(null);
                }
            },
            error: function() {
                callback(null);
            }
        });
    }
    function duration(videoUrl, callback) {
        var url = getUrl(videoUrl);
        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function(data) {
                if (data.items.length > 0) {
                    console.log(data);
                    var contentDetails = data.items[0].contentDetails;
                    callback(convertTime(contentDetails.duration));
                }
                else {
                    callback(null);
                }
            },
            error: function() {
                callback(null);
            }
        });


    }
    function convertTime(duration) {
        var a = duration.match(/\d+/g);

        if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
            a = [0, a[0], 0];
        }

        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
            a = [a[0], 0, a[1]];
        }
        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
            a = [a[0], 0, 0];
        }

        duration = 0;

        if (a.length == 3) {
            duration = duration + parseInt(a[0]) * 3600;
            duration = duration + parseInt(a[1]) * 60;
            duration = duration + parseInt(a[2]);
        }

        if (a.length == 2) {
            duration = duration + parseInt(a[0]) * 60;
            duration = duration + parseInt(a[1]);
        }

        if (a.length == 1) {
            duration = duration + parseInt(a[0]);
        }
        return duration;
    }
});

commonModule.directive('loading', function($http, SharedData) {
    return {
        restrict: 'A',
        link: function(scope, elm, attrs) {
            scope.isLoading = function() {
                return SharedData.loadingState > 0 || scope.isViewLoading;
            };

            scope.$watch(scope.isLoading, function(v) {
                if (v) {
                    elm.show();
                } else {
                    elm.hide();
                }
            });
        }
    };

});


commonModule.directive('youtubeItem', function() {
    return {
        restrict: 'EA',
        templateUrl: WEBROOT_FULL + '/html/Videos/item.html',
        scope: {
            info: '=',
            id: '='
        },
        link: function(scope, element) {
            scope.url = scope.info.id;
            scope.thumbnail = scope.info.snippet.thumbnails.default.url;
            scope.title = scope.info.snippet.title;
            scope.description = scope.info.snippet.description;
            scope.published = scope.info.snippet.publishedAt;
            scope.provider_name = 'youtube';
        }
    };

});

commonModule.directive('videoTagItem', function() {
    return {
        restrict: 'EA',
        templateUrl: WEBROOT_FULL + '/html/VideoTags/item.html',
        scope: {
            playerData: '=playerData',
            videoTag: '=videoTag'
        },
        link: function(scope, element) {

        }
    };
});

commonModule.directive('riderItem', function() {
    return {
        restrict: 'EA',
        templateUrl: WEBROOT_FULL + '/html/Riders/item.html',
        scope: {
            rider: '=rider'
        },
        link: function(scope, element) {

        }
    };
});

commonModule.directive('ngLoadingIcon', function() {

    return {
        restrict: "EA",
        replace: true,
        scope: {
            isLoading: '='
        },
        template: '<span class="ajax-loader" >\n\
                        <img src="' + WEBROOT_FULL + '/img/ajax_loader.gif" alt="Loading, please wait..."/>\n\
                    </span>',
        link: function(scope, element, attrs) {
            scope.$watch('isLoading', function(v) {
                if (v) {
                    element.show();
                } else {
                    element.hide();
                }
            });
        }
    };
});


commonModule.factory('SportEntity', function($resource) {
    var url = WEBROOT_FULL + '/Sports/:action/:id.json';
    //var url = '/sys/MediaTagTricks/:action/:id';
    return $resource(url, {id: '@id', action: '@action'}, {
        index: {
            method: 'GET',
            params: {action: 'index'},
            isArray: true
        }
    });

});
commonModule.factory('CategoryEntity', function($filter) {
    var url = WEBROOT_FULL + '/Categories/:action/:id.json';
    //var url = '/sys/MediaTagTricks/:action/:id';
    return $resource(url, {id: '@id', action: '@action'}, {
        index: {
            method: 'GET',
            params: {action: 'index'},
            isArray: true
        }
    });

});

commonModule.factory('TagEntity', function($resource) {
    var url = WEBROOT_FULL + '/Tags/:action/:id.json';
    //var url = '/sys/MediaTagTricks/:action/:id';
    return $resource(url, {id: '@id', action: '@action', sport: '@sport', category: '@category', trick: '@trick'}, {
        suggest: {
            method: 'GET',
            params: {action: 'suggest'},
            isArray: true
        },
        suggestCategory: {
            method: 'GET',
            params: {action: 'suggestCategory', id: null},
            isArray: true
        }
    });
});

commonModule.factory('VideoTagPointEntity', function($resource) {
    var url = WEBROOT_FULL + '/VideoTagPoints/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        up: {
            method: 'POST',
            params: {action: 'up'},
            isArray: false
        },
        down: {
            method: 'POST',
            params: {action: 'down'},
            isArray: false
        }
    });
});
commonModule.factory('VideoTagEntity', function($resource) {
    var url = WEBROOT_FULL + '/VideoTags/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        view: {
            method: 'GET',
            params: {action: 'view'},
            isArray: false
        },
        add: {
            method: 'POST',
            params: {action: 'add'},
            isArray: false
        },
        search: {
            method: 'GET',
            params: {action: 'search'},
            isArray: true
        },
        rider: {
            method: 'GET',
            params: {action: 'rider'},
            isArray: true
        },
        recentlyTagged: {
            method: 'GET',
            params: {action: 'recentlyTagged', id: null},
            isArray: false
        }
    });
});
commonModule.directive('passwordMatch', function() {
    return {
        require: 'ngModel',
        scope: {
            otherModelValue: '=passwordMatch'
        },
        link: function(scope, element, attributes, ngModel) {
            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue === scope.otherModelValue;
            };
            scope.$watch('otherModelValue', function() {
                ngModel.$validate();
            });
        }
    };
});
commonModule.directive('serverForm', function() {

    return {
        require: 'form',
        link: function(scope, elem, attr, form) {
            form._pending = false;
            
            form.submit = function(resourceCall, data, success, error){
                console.log("Call server form submit with data: " + data);
                if (form._pending){
                    return ;
                }
                form._pending = true;
                resourceCall(data, success, error).$promise.finally(function(){
                    console.log('Finally called');
                    form._pending = false;
                });
            };

            form.setValidationErrors = function setValidationErrors(serverErrors) {
                console.log("Setting validation errors (" + serverErrors.length + ")");
                angular.forEach(serverErrors, function(errors, field) {
                    var errorString = Object.keys(errors).map(function(k) {
                        return errors[k];
                    }).join(', ');
                    if (form[field] !== undefined) {
                        form[field].$setValidity('server', false);
                        form[field].$error.server = errorString;
                        console.log(form.$name + "." + field + ": " + errorString);
                    }
                    else{
                        console.log(form.$name + "." + field + ": " + errorString);
                    }
                });
            };
        }
    };

});
commonModule.factory('FormManager', function() {
    var FormManager = function(form) {
        this.form = form;
        this.pending = false;
    };
    FormManager.prototype.setErrors = function(errors) {
        var form = this.form;
        angular.forEach(errors, function(errors, field) {
            var errorString = Object.keys(errors).map(function(k) {
                return errors[k];
            }).join(', ');
            console.log(form.$name + "." + field + ": " + errorString);
            if (form[field] !== undefined) {
                form[field].$setValidity('server', false);
                form[field].$error.server = errorString;
            }
        });
    };
    FormManager.prototype.submit = function(callback, data) {
        if (this.pending) {
            // Form is already pendiong
            return;
        }
        this.pending = true;
        callback(data);
    };
    return {
        instance: function(form) {
            return new FormManager(form);
        }
    }
});

commonModule.factory('DataExistsService', function($resource) {
    var url = WEBROOT_FULL + '/:controller/:action/:value.json';

    return $resource(url, {controller: '@controller', action: '@action', value: '@value'}, {
        check: {
            method: 'GET',
            params: {action: 'view'},
            isArray: false
        }
    });
});
commonModule.directive('ftUnique', function(DataExistsService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            element.bind('blur', function(e) {
                if (!ngModel || !element.val())
                    return;
                var keyProperty = scope.$eval(attrs.ftUnique);
                var currentValue = element.val();
                DataExistsService.check({
                    controller: keyProperty.controller,
                    action: keyProperty.action,
                    value: currentValue
                }, function(response) {
                    console.log("Check exists response: " + response.exists);
                    if (currentValue == element.val()) {
                        //Ensure value that being checked hasn't changed
                        //since the Ajax call was made
                        ngModel.$setValidity('unique', !response.exists);
                    }
                    else {
                        ngModel.$setValidity('unique', true);
                    }
                });
            });
        }
    }
});

commonModule.directive('passwordStrength', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            var indicator = element.children();
            var dots = Array.prototype.slice.call(indicator.children());
            var weakest = dots.slice(-1)[0];
            var weak = dots.slice(-2);
            var strong = dots.slice(-3);
            var strongest = dots.slice(-4);

            element.after(indicator);

            element.bind('keyup', function() {
                var matches = {
                    positive: {},
                    negative: {}
                },
                counts = {
                    positive: {},
                    negative: {}
                },
                tmp,
                        strength = 0,
                        letters = 'abcdefghijklmnopqrstuvwxyz',
                        numbers = '01234567890',
                        symbols = '\\!@#$%&/()=?¿',
                        strValue;

                angular.forEach(dots, function(el) {
                    el.style.backgroundColor = '#ebeef1';
                });

                if (ngModel.$viewValue) {
                    // Increase strength level
                    matches.positive.lower = ngModel.$viewValue.match(/[a-z]/g);
                    matches.positive.upper = ngModel.$viewValue.match(/[A-Z]/g);
                    matches.positive.numbers = ngModel.$viewValue.match(/\d/g);
                    matches.positive.symbols = ngModel.$viewValue.match(/[$-/:-?{-~!^_`\[\]]/g);
                    matches.positive.middleNumber = ngModel.$viewValue.slice(1, -1).match(/\d/g);
                    matches.positive.middleSymbol = ngModel.$viewValue.slice(1, -1).match(/[$-/:-?{-~!^_`\[\]]/g);

                    counts.positive.lower = matches.positive.lower ? matches.positive.lower.length : 0;
                    counts.positive.upper = matches.positive.upper ? matches.positive.upper.length : 0;
                    counts.positive.numbers = matches.positive.numbers ? matches.positive.numbers.length : 0;
                    counts.positive.symbols = matches.positive.symbols ? matches.positive.symbols.length : 0;

                    counts.positive.numChars = ngModel.$viewValue.length;
                    tmp += (counts.positive.numChars >= 8) ? 1 : 0;

                    counts.positive.requirements = (tmp >= 3) ? tmp : 0;
                    counts.positive.middleNumber = matches.positive.middleNumber ? matches.positive.middleNumber.length : 0;
                    counts.positive.middleSymbol = matches.positive.middleSymbol ? matches.positive.middleSymbol.length : 0;

                    // Decrease strength level
                    matches.negative.consecLower = ngModel.$viewValue.match(/(?=([a-z]{2}))/g);
                    matches.negative.consecUpper = ngModel.$viewValue.match(/(?=([A-Z]{2}))/g);
                    matches.negative.consecNumbers = ngModel.$viewValue.match(/(?=(\d{2}))/g);
                    matches.negative.onlyNumbers = ngModel.$viewValue.match(/^[0-9]*$/g);
                    matches.negative.onlyLetters = ngModel.$viewValue.match(/^([a-z]|[A-Z])*$/g);

                    counts.negative.consecLower = matches.negative.consecLower ? matches.negative.consecLower.length : 0;
                    counts.negative.consecUpper = matches.negative.consecUpper ? matches.negative.consecUpper.length : 0;
                    counts.negative.consecNumbers = matches.negative.consecNumbers ? matches.negative.consecNumbers.length : 0;

                    // Calculations
                    strength += counts.positive.numChars * 4;
                    if (counts.positive.upper) {
                        strength += (counts.positive.numChars - counts.positive.upper) * 2;
                    }
                    if (counts.positive.lower) {
                        strength += (counts.positive.numChars - counts.positive.lower) * 2;
                    }
                    if (counts.positive.upper || counts.positive.lower) {
                        strength += counts.positive.numbers * 4;
                    }
                    strength += counts.positive.symbols * 6;
                    strength += (counts.positive.middleSymbol + counts.positive.middleNumber) * 2;
                    strength += counts.positive.requirements * 2;

                    strength -= counts.negative.consecLower * 2;
                    strength -= counts.negative.consecUpper * 2;
                    strength -= counts.negative.consecNumbers * 2;

                    if (matches.negative.onlyNumbers) {
                        strength -= counts.positive.numChars;
                    }
                    if (matches.negative.onlyLetters) {
                        strength -= counts.positive.numChars;
                    }

                    strength = Math.max(0, Math.min(100, Math.round(strength)));

                    if (strength > 85) {
                        angular.forEach(strongest, function(el) {
                            el.style.backgroundColor = '#008cdd';
                        });
                    } else if (strength > 65) {
                        angular.forEach(strong, function(el) {
                            el.style.backgroundColor = '#6ead09';
                        });
                    } else if (strength > 30) {
                        angular.forEach(weak, function(el) {
                            el.style.backgroundColor = '#e09115';
                        });
                    } else {
                        weakest.style.backgroundColor = '#e01414';
                    }
                }
            });
        },
        template: '<span class="password-strength-indicator"><span></span><span></span><span></span><span></span></span>'
    };
});

commonModule.directive('servererror', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ctrl) {
            element.on('change', function() {
                scope.$apply(function() {
                    ctrl.$setValidity('server', true);
                });
            });
        }
    }
});

commonModule.factory('PlayerProviders', function() {
    var data = [{name: 'youtube'}];
    return {
        list: function() {
            return data;
        }
    };
});