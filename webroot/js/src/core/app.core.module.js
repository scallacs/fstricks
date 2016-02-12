angular
        .module('app.core', ['ngCookies'])
        .factory('PlayerData', PlayerData)
        .factory('VideoTagData', VideoTagData)
        .factory('SharedData', SharedData)
        .factory('NationalityEntity', NationalityEntity)
        .factory('RiderEntity', RiderEntity)
        .factory('UserEntity', UserEntity)
        .factory('ErrorReportEntity', ErrorReportEntity)
        .factory('VideoEntity', VideoEntity)
        .factory('SportEntity', SportEntity)
        .factory('TagEntity', TagEntity)
        .factory('VideoTagPointEntity', VideoTagPointEntity)
        .factory('VideoTagEntity', VideoTagEntity)
        .factory('AuthenticationService', AuthenticationService)
        .factory('ServerConfigEntity', ServerConfigEntity)
        .filter('searchCategory', searchCategory)
        .filter('getSportByName', getSportByName);


function PlayerData(VideoTagData, $q) {
    var obj = {
        deferred: $q.defer(),
        player: null,
        currentTag: null,
        visible: true,
        showListTricks: true,
        editionMode: false,
        showEditionMode: function() {
            this.reset();
            this.editionMode = true;
        },
        showViewMode: function() {
            this.reset();
            this.editionMode = false;
            this.visible = true;
        },
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
        view: view,
        replay: replay,
        reset: reset,
        play: play,
        stop: stop,
        seekTo: seekTo,
        pause: pause,
        loadVideo: loadVideo,
        playVideoRange: playVideoRange,
        setPlayer: setPlayer,
        onCurrentTimeUpdate: function() {

        },
        updateCurrentTag: updateCurrentTag
    };

    return obj;

    function setPlayer(player) {
        this.player = player;
        this.deferred.resolve();
    }
    function playVideoRange(data) {
        return this.deferred.promise.then(function() {
            var info = {
                videoId: data.video_url,
                startSeconds: data.begin,
                endSeconds: data.end
            };
            obj.player.loadVideoById(info);
        });
    }
    function view(videoTag) {
        return this.deferred.promise.then(function() {
            _view(videoTag);
        });
    }
    function _view(videoTag) {
        console.log("PlayerData._view: " + videoTag.id);
//        console.log(videoTag);
        if (videoTag === null) {
            console.log("Try to view a null videoTag");
            obj.currentTag = null;
            return;
        }
        obj.currentTag = videoTag;
        obj.data.id = videoTag.id;
        obj.data.begin = videoTag.begin;
        obj.showListTricks = false;

        if (videoTag.video_url === obj.data.video_url &&
                videoTag.end === obj.data.end) {
            obj.seekTo(videoTag.begin);
        }
        else {
            obj.data.end = videoTag.end;
            obj.data.video_url = videoTag.video_url;
            obj.playVideoRange(videoTag);
        }
    }

    function replay(videoTag) {
        return this.seekTo(videoTag.begin);
    }

    function reset() {
        console.log("RESETING DATA");
        VideoTagData.reset();
        this.currentTag = null;
        this.data.video_url = null;
        this.data.id = 0;
        this.data.begin = 0;
        this.data.end = 0;
        this.data.currentTime = 0;
        this.showListTricks = true;
        this.editionMode = false;
        this.onCurrentTimeUpdate = function() {
        };
    }

    function play(newUrl) {
        return this.deferred.promise.then(function() {
            if (newUrl !== obj.data.video_url) {
                obj.data.video_url = newUrl;
                obj.loadVideo(newUrl);
            }
            else {
                obj.player.playVideo();
            }
        });
    }

    function seekTo(val) {
        return this.deferred.promise.then(function() {
            obj.player.seekTo(val);
        });
    }
    function pause() {
        return this.deferred.promise.then(function() {
            obj.player.pauseVideo();
        });
    }

    function stop() {
        return this.deferred.promise.then(function() {
            obj.player.stopVideo();
        });
    }

    function loadVideo(url) {
        return this.deferred.promise.then(function() {
            console.log('Load video in playerData: ' + url);
            obj.data.video_url = url;
            obj.player.loadVideoById({videoId: url});
        });
    }


    function updateCurrentTag(newVal) {
//        console.log(PlayerData.currentTag);
        var current = PlayerData.currentTag;
        if (angular.isDefined(current) && current !== null) {
            if (current.mode === 'edition') {
                return;
            }
            if (current.begin <= newVal && current.end >= newVal) {
                current.time_to_play = 0;
                return;
            }
            else if (current.begin > newVal) {
                current.time_to_play = Math.round(current.begin - newVal, 0);
                return;
            }
        }
        PlayerData.currentTag = VideoTagData.findNextTagToPlay(newVal);
    }

}

function VideoTagData(VideoTagEntity) {
    var filters = {};

    var obj = {
        data: [],
        limit: 20, // TODO synchro server
        current: 0, // Index of the current tag 
        disabled: true,
        currentPage: 1,
        reset: function() {
            this.currentPage = 1;
            this.data = [];
            this.disabled = false;
            this.cachePage = {};
            filters = {};
        },
        setFilter: function(name, value) {
            filters[name] = value;
        },
        setFilters: function(value) {
            this.reset();
            filters = value;
        },
        setOrder: function(value) {
            filters.order = value;
        },
        add: function(tag) {
            this.data.push(tag);
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
        cachePage: {},
        loadNextPage: function() {
            var promise = this.loadPage(this.currentPage);
            promise.then(function(tags) {
                if (tags.length < obj.limit) {
                    console.log('disabling video tag data loader');
                    obj.disabled = true;
                }
                obj.currentPage += 1;
            });
            return promise;
        },
        loadPage: function(page) {
            if (this.cachePage[page]) {
                return this.cachePage[page];
            }
//            if (this.disabled) {
//                // TODO 
//            }
            filters.page = page;
            this.cachePage[page] = VideoTagEntity.search(filters, function(tags) {
                console.log('Loading page ' + obj.currentPage + ': ' + tags.length + ' tag(s)');
                for (var i = 0; i < tags.length; i++) {
                    obj.data.push(tags[i]);
                }
            }, function() {
                obj.disabled = true;
            }).$promise;
            return this.cachePage[page];
        }
    };

    return obj;
}

function searchCategory() {
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

}

function getSportByName() {
    return function(sports, name) {
        for (var i = 0; i < sports.length; i++) {
            var item = sports[i];
            if (item.name == name) {
                return item;
            }
        }
        return null;
    };

}

// loadingState
function SharedData() {
    var data = {
        loadingState: true,
        pageLoader: function(val) {
            console.log('Set loading sate: ' + val);
            this.loadingState = val ? true : false;
        }
    };
    return data;
}

function NationalityEntity($resource) {

    var url = WEBROOT_FULL + '/nationalities/:action.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        all: {
            method: 'GET',
            params: {action: 'index'},
            isArray: true
        }
    });
}

function RiderEntity($resource) {
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
}

function UserEntity($resource) {
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
}

function ErrorReportEntity($resource) {
    var url = WEBROOT_FULL + '/ReportErrors/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        post: {
            method: 'POST',
            params: {action: 'add'},
            isArray: false
        }
    });
}

function VideoEntity($resource) {
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
}

function SportEntity($resource) {
    var url = WEBROOT_FULL + '/Sports/:action/:id.json';
    //var url = '/sys/MediaTagTricks/:action/:id';
    return $resource(url, {id: '@id', action: '@action'}, {
        index: {
            method: 'GET',
            params: {action: 'index'},
            isArray: true,
            cache: true
        }
    });

}

function TagEntity($resource) {
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
}

function VideoTagPointEntity($resource) {
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
}

function VideoTagEntity($resource) {
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
        edit: {
            method: 'POST',
            params: {action: 'edit'},
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
}

AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', 'UserEntity', '$state'];
function AuthenticationService($http, $cookies, $rootScope, UserEntity, $state) {

    var service = {};

    service.login = login;
    service.logout = logout;
    service.setCredentials = setCredentials;
    service.clearCredentials = clearCredentials;
    service.getCurrentUser = getCurrentUser;
    service.isAuthed = isAuthed;
    service.socialLogin = socialLogin;
    service.signup = signup;
    service.requireLogin = requireLogin;
    service.authData = {
        user: null,
        isAuthed: function() {
            return service.isAuthed();
        }
    };

    return service;

    function isAuthed() {
        return service.getCurrentUser() !== null;
    }

    function getCurrentUser() {
        if (service.authData.user === false) {
            return null;
        }
        if (service.authData.user !== null) {
            return service.authData.user;
        }

        var globals = $cookies.getObject('globals');
        if (!globals) {
            return null;
        }
        service.authData.user = globals.currentUser;
        console.log("Getting current user: " + service.authData.email);
        return service.authData.user;
    }

    function login(username, password) {
        var promise = UserEntity.login({email: username, password: password, id: null}, function(response) {
            if (response.success) {
                response.data.provider = null;
                service.setCredentials(response.data);
            }
        }).$promise;
        return promise;
    }

    function signup(data) {
        return UserEntity.signup(data, function(response) {
            console.log(response);
            if (response.success) {
                service.setCredentials(response.data);
            }
        }).$promise;
    }

    function socialLogin(provider, callback) {

        UserEntity.login({id: null, provider: provider}, function(response) {
            console.log(response);
            if (response.success) {
                response.data.provider = provider;
                service.setCredentials(response.data);
            }
            callback(response.success, response);
        }).$promise;
    }

    function setCredentials(data) {
        service.authData.user = data;
        $rootScope.globals = {currentUser: data};
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
        $cookies.remove('globals');
        $cookies.putObject('globals', $rootScope.globals);

        console.log("Setting credential for user: " + data.email + " - stored: " + getCurrentUser().email);
    }

    function logout() {
        clearCredentials();
    }

    function clearCredentials() {
        service.authData.user = false;
        $rootScope.globals = {};
        $cookies.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic';
        console.log("Clearing credential");
    }

    function requireLogin() {
        if (!isAuthed()) {
            console.log("User needs to be logged in to access this content");
            $state.go('login');
        }
    }

}



function ServerConfigEntity($resource) {
    var resource = $resource('data/:action.json', {action: '@action'}, {
        rules: {
            method: 'GET',
            params: {action: 'rules'},
            isArray: false,
            cache: true
        },
        countries: {
            method: 'GET',
            params: {action: 'countries'},
            isArray: true,
            cache: true
        }
    });

    return {
        rules: rules,
        countries: countries
    };

    function rules() {
        return resource.rules().$promise;
    }

    function countries() {
        return resource.countries().$promise;
    }


}