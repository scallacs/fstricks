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
});
commonModule.constant('API_KEYS', {
    facebook: '1536208040040285'
});
commonModule.directive('youtube', function($window, YT_event, VideoEntity) {

    function initPlayer(element, scope) {
        var player;
        var myTimer;

        var playerContainer = element.children()[0];
        player = new YT.Player(playerContainer, {
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
            height: scope.playerVideo.height,
            width: scope.playerVideo.width, //scope.playerVideo.width,
            videoId: scope.playerVideo.video_url,
            events: {
                onError: function(error) {
                    switch (error.data) {
                        case 2: // Invalid id
                            break;
                        case 100: // Video has been removed
                        case 101: // Video is private
                        case 150: // Same, video is private
                            VideoEntity.reportDeadLink({
                                id: player.getVideoData()['video_id'],
                                provider:  'youtube'
                            }, function() {
                                // ignore results
                            });
                            break
                    }
                },
                onReady: function() {

                    scope.$emit('onYouTubePlayerReady', player);

                    scope.$watch('playerVideo.width', function(newValue, oldValue) {
                        if (newValue == oldValue) {
                            return;
                        }
                        //alert('new width'); 
                        //player.setSize(scope.playerVideo.width, element.parent().parent().width() * 9 / 16);
                    });
                    scope.$watch('playerVideo.video_url + playerVideo.begin + playerVideo.end', function(newValue, oldValue) {
                        if (scope.playerVideo.video_url) {
                            var info = {
                                videoId: scope.playerVideo.video_url,
                                startSeconds: scope.playerVideo.begin,
                                endSeconds: scope.playerVideo.end
                            };
                            console.log(info);
                            player.loadVideoById(info);
//                            alert('ok');
//                            player.playVideo();
                        }
                        else {
                            console.log(scope.playerVideo.begin);
                            player.seekTo(scope.playerVideo.begin);
                        }
                    });

                    scope.$on(YT_event.STOPED, function() {
                        player.stopVideo();
                    });

                    scope.$on(YT_event.PLAYING, function() {
                        player.playVideo();
                    });

                    scope.$on(YT_event.PAUSED, function() {
                        player.pauseVideo();
                    });

                    scope.$on(YT_event.STATUS_CHANGE, function(event, youtubeEvent) {

                        switch (youtubeEvent) {
                            case YT.PlayerState.ENDED:
                                player.seekTo(scope.playerVideo.begin);
                                break;
                        }
                    });

                    scope.$watch('playerVideo.goToTime', function(newVal, oldVal) {
                        player.seekTo(newVal);
                        //scope.playerVideo.goToTime = null;
                    });
                },
                onStateChange: function(event) {

                    var message = {
                        event: YT_event.STATUS_CHANGE,
                        data: event.data
                    };
//
//                            switch (event.data) {
//                                case YT.PlayerState.PLAYING:
//                                    message.event = YT_event.PLAYING;
//                                    break;
//                                case YT.PlayerState.STOPED:
//                                    message.event = YT_event.ENDED;
//                                    break;
//                                case YT.PlayerState.UNSTARTED:
//                                    message.event = YT_event.UNSTARTED;
//                                    break;
//                                case YT.PlayerState.PAUSED:
//                                    message.event = YT_event.PAUSED;
//                                    break;
//                            }

                    if (event.data === YT.PlayerState.PLAYING) { // playing
                        myTimer = setInterval(function() {
                            scope.$apply(function() {
                                scope.playerVideo.currentTime = player.getCurrentTime();
                            });
                        }, 100); // 100 means repeat in 100 ms
                    }
                    else { // not playing
                        clearInterval(myTimer);
                    }

                    scope.$apply(function() {
                        scope.$emit(message.event, message.data);
                    });
                }
            }
        });
    }

    return {
        restrict: "E",
        scope: {playerVideo: '='},
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
commonModule.factory('VideoTagData', function(VideoTagEntity, SharedData) {
    var filters = {};

    return {
        data: [],
        disabled: true,
        loading: false,
        currentPage: 1,
        callbackSuccess: null,
        callbackError: null,
        reset: function() {
            this.currentPage = 1;
            this.data = [];
            filters = {};
        },
        setFilter: function(name, value) {
            this.reset();                  // We reset the results that are in cache if we change the filter
            filters[name] = value;
        },
        setFilters: function(value) {
            this.reset();                  // We reset the results that are in cache if we change the filter
            filters = value;
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
        extractVideoIdFromUrl: extractVideoIdFromUrl
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