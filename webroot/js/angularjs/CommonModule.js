/*
 * Module for generating fake spot and testing
 */
var commonModule = angular.module('CommonModule', [
    'ngResource',
    'ui.bootstrap',
    'ui.slider',
    'ui.select',
    'djds4rce.angular-socialshare',
    'ngRoute',
    'satellizer'], function($routeProvider, $locationProvider, $httpProvider) {

    //$locationProvider.html5Mode(true).hashPrefix('!');

    var interceptor = ['$location', '$rootScope', '$q', function($location, scope, $q) {

            function requestError(rejection) {
                alert('requestError');
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

commonModule.config(function($authProvider) {

    $authProvider.facebook({
        clientId: 'Facebook App ID'
    });

    $authProvider.google({
        clientId: 'Google Client ID'
    });
//    $authProvider.instagram({
//        clientId: 'Instagram Client ID'
//    });
});

commonModule.constant('YT_event', {
    STOP: 0,
    PLAY: 1,
    PAUSE: 2,
    STATUS_CHANGE: 3
});

commonModule.directive('youtube', function($window, YT_event) {
    return {
        restrict: "E",
        scope: {playerVideo: '='},
        template: '<div></div>',
        link: function(scope, element, attrs, $rootScope) {
            if ($('#YoutubeIFrameScript').length === 0) {
                var tag = $('<script/>').attr({
                    id: 'YoutubeIFrameScript',
                    src: "https://www.youtube.com/iframe_api"
                });
                $('head').prepend(tag);
            }
            else {
                $window.onYouTubeIframeAPIReady();
            }
            var player;

            $window.onYouTubeIframeAPIReady = function() {
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
                        controls: 1
                    },
                    height: element.parent().width() * 9 / 16,
                    width: scope.playerVideo.width,
                    videoId: scope.playerVideo.video_url,
                    events: {
                        onReady: function() {

                            scope.$emit('onYouTubePlayerReady', player);

                            scope.$watch('height + width', function(newValue, oldValue) {
                                if (newValue == oldValue) {
                                    return;
                                }

                                player.setSize(scope.width, scope.height);

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
                                    player.playVideo();
                                }
                                else {
                                    console.log(scope.playerVideo.begin);
                                    player.seekTo(scope.playerVideo.begin);
                                }
                            });

                            scope.$on(YT_event.STOP, function() {
                                player.seekTo(0);
                                player.stopVideo();
                            });

                            scope.$on(YT_event.PLAY, function() {
                                player.playVideo();
                            });

                            scope.$on(YT_event.PAUSE, function() {
                                player.pauseVideo();
                            });
                            scope.$watch('playerVideo.currentTime', function(newVal) {
                                player.seekTo(newVal);
                            });
                        },
                        onStateChange: function(event) {

                            var message = {
                                event: YT_event.STATUS_CHANGE,
                                data: ""
                            };

                            switch (event.data) {
                                case YT.PlayerState.PLAYING:
                                    message.data = "PLAYING";
                                    break;
                                case YT.PlayerState.ENDED:
                                    message.data = "ENDED";
                                    break;
                                case YT.PlayerState.UNSTARTED:
                                    message.data = "NOT PLAYING";
                                    break;
                                case YT.PlayerState.PAUSED:
                                    message.data = "PAUSED";
                                    break;
                            }

                            scope.$apply(function() {
                                scope.$emit(message.event, message.data);
                            });
                        }
                    }
                });
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
        return (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds
                + '.' + decades;
    }
});

commonModule.filter('timeago', function() {
    return function(timestamp) {
        return jQuery.timeago(timestamp * 1000);
    };
});
commonModule.factory('SharedData', function() {
    var data = {
        loadingState: 1
    };
    return data;
});
commonModule.factory('ViewFeedback', function() {
    var success = function(message) {
        return {
            message: message,
            icon: 'glyphicon-info-sign',
            class: 'bg-success'
        };
    };
    var failure = function(message) {
        return {
            message: message,
            icon: 'glyphicon-warning-sign',
            class: 'bg-danger'
        };
    };

    return {
        success: success,
        failure: failure,
        loading: function() {
            return {
                message: "Loading",
                icon: 'glyphicon-info-sign',
                class: 'bg-info'
            };
        },
        auto: function(response) {
            if (response.success) {
                return success(response.message);
            }
            else {
                return failure(response.message);
            }
        },
        error: function(error) {
            console.log(error);
            return {
                message: "Server error, please try agian later",
                icon: 'glyphicon-error-sign',
                class: 'bg-danger'
            };
        }
    }
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
        login: {
            method: 'POST',
            params: {action: 'login', id: null},
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
    var url = WEBROOT_FULL + '/Users/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        post: {
            method: 'PORT',
            params: {action: 'add'},
            isArray: false
        }
    });
});
commonModule.factory('VideoEntity', function($resource) {
    var url = WEBROOT_FULL + '/Videos/:action/:id.json';
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
        }
    });
});
commonModule.factory('AuthenticationService', function($http, $cookies, $rootScope, UserEntity) {
    var service = {};

    var isAuthed = null;

    service.login = login;
    service.logout = logout;
    service.setCredentials = setCredentials;
    service.clearCredentials = clearCredentials;
    service.getCurrentUser = getCurrentUser;
    service.isAuthed = getIsAuthed;
    return service;

    function getCurrentUser() {
        return $cookies.getObject('globals').currentUser;
    }
    function getIsAuthed() {
        try {
            if (isAuthed === null) {
                var globals = $cookies.getObject('globals');
                console.log(globals);
                isAuthed = (globals && globals.currentUser && globals.currentUser.token);
            }
            return isAuthed;
        } catch (ex) {
            isAuthed = false;
            clearCredentials();
        }
    }

    function login(username, password, callback) {

        UserEntity.login({email: username, password: password}, function(response) {
            console.log(response);
            if (response.success) {
                setCredentials(response.data);
            }
            callback(response.success, response);
        });
    }

    function setCredentials(data) {
        $rootScope.globals = {
            currentUser: {
                username: data.email,
                token: data.token,
                id: data.id
            }
        };

        $http.defaults.headers.common['Authorization'] = 'Bearer ' + data.token; // jshint ignore:line
        $cookies.putObject('globals', $rootScope.globals);
        isAuthed = true;
    }

    function logout() {
        isAuthed = false;
        clearCredentials();
    }

    function clearCredentials() {
        $rootScope.globals = {};
        $cookies.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic';
    }

})
commonModule.factory('YoutubeVideoInfo', function() {

    return {
        duration: duration,
        info: contentDetails,
        exists: exists
    };

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

commonModule.factory('VideoProviderEntity', function() {
    //var data = [{name: 'youtube'}, {name: 'vimeo'}];
    var data = [{name: 'youtube'}];
    return {
        get: function() {
            return data;
        }
    };
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
commonModule.factory('SportEntity', function($resource) {
    var url = WEBROOT_FULL + '/Sports/:action/:id.json';
    //var url = '/sys/MediaTagTricks/:action/:id';
    return $resource(url, {id: '@id', action: '@action'}, {
        index: {
            method: 'GET',
            params: {action: 'index'},
            isArray: true
        },
        view: {
            method: 'GET',
            params: {action: 'view'},
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
    var url = WEBROOT_FULL + '/Tags/:action/:id/:sport/:category/:trick.json';
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
        },
        view: {
            method: 'GET',
            params: {action: 'view'},
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
        best: {
            method: 'GET',
            params: {action: 'best'},
            isArray: true
        },
        recentlyTagged: {
            method: 'GET',
            params: {action: 'recentlyTagged', id: null},
            isArray: true
        }
    });
});

commonModule.factory('PlayerProviders', function() {
    var data = [{name: 'youtube'}];
    return {
        list: function() {
            return data;
        }
    };
})