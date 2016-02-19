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
        init: function() {
            this.deferred = {
                youtube: $q.defer(),
                vimeo: $q.defer()
            };
            this.players = {};
            this.visible = true;
            this.showListTricks = true;
            this.editionMode = false;
            this.looping = false; // True if we want to loop on the current tag
            this.onCurrentTimeUpdate = function() {
            };
            this.data = {
                begin: 0,
                end: 0,
                video_url: null,
                duration: 0,
                currentTime: 0,
                id: null,
                provider: null
            };
            this.onFinish = function() {
            };
            this.onPause = function() {
            };
            this.onSeek = function() {
            };

        },
        showEditionMode: showEditionMode,
        showViewMode: showViewMode,
        getPromise: getPromise,
        getPlayer: getPlayer,
        isProvider: isProvider,
        setPlayer: setPlayer,
        errorPlayer: errorPlayer,
        reset: reset,
        startLooping: startLooping,
        stopLooping: stopLooping,
        replay: replay,
        playVideoTag: playVideoTag,
        play: play,
        pause: pause,
        stop: stop,
        seekTo: seekTo,
        loadVideo: loadVideo,
        /**
         * Called when player is 
         * @return {undefined}
         */
        onEnd: onEnd,
        onPlayProgress: onPlayProgress,
        getCurrentTime: getCurrentTime,
        updateCurrentTag: updateCurrentTag
    };

    obj.init();

    return obj;

    function onEnd() {
        console.log("onEnd() reached !");
        if (this.looping) {
            this.seekTo(this.data.begin);
        }
    }
    function onPlayProgress(currentTime) {
        if (this.data.end !== null && currentTime >= this.data.end) {
            this.onEnd();
        }
    }
    function startLooping() {
        if (VideoTagData.currentTag) {
            this.looping = true;
        }
    }

    function stopLooping() {
        this.looping = false;
    }

    function showEditionMode() {
        this.reset();
        this.editionMode = true;
    }

    function showViewMode() {
        this.reset();
        this.editionMode = false;
        this.visible = true;
    }

    function errorPlayer(type, error) {
        this.deferred[type].reject(error);
    }

    function isProvider(provider) {
        return this.data.provider === provider;
    }   

    function setPlayer(type, player) {
        console.log("Setting player: " + type);
        this.players[type] = player;
        this.deferred[type].resolve();
    }
    function getPlayer() {
        return this.players[this.data.provider];
    }
    function playVideoTag(videoTag) {
        this.data.provider = videoTag.provider_id;
        return this.getPromise().then(function() {
            _view(videoTag);
        });
    }
    function _view(videoTag) {
        //console.log("PlayerData._view: " + videoTag.id);
//        console.log(videoTag);
        VideoTagData.setCurrentTag(videoTag);
        if (videoTag === null) {
            console.log("Try to view a null videoTag");
            return;
        }
        obj.data.provider = videoTag.provider_id;
        obj.data.id = videoTag.id;
        obj.data.begin = videoTag.begin;
        obj.data.end = videoTag.end;
        obj.showListTricks = false;
        obj.looping = true;

        if (videoTag.provider_id === obj.data.provider &&
                videoTag.video_url === obj.data.video_url) {
            obj.seekTo(videoTag.begin);
        }
        else {
            obj.loadVideo(videoTag);
        }
    }

    function replay(videoTag) {
        return this.seekTo(videoTag.begin);
    }

    function reset() {
        console.log("RESETING DATA");
        VideoTagData.reset();
        obj.init();
    }

    function play() {
        return this.getPromise().then(function() {
            obj.getPlayer().play();
        });
    }

    function seekTo(val) {
        return this.getPromise().then(function() {
            if ((obj.data.begin !== null && obj.getCurrentTime() < obj.data.begin)
                    || (obj.data.end !== null && obj.getCurrentTime() > obj.data.end)) {
                obj.looping = false;
            }
            obj.getPlayer().seekTo(val);
        });
    }
    function pause() {
        return this.getPromise().then(function() {
            obj.getPlayer().pause();
        });
    }

    function stop() {
        this.looping = false;
        if (this.data.provider === null){
            return;
        }
        return this.getPromise().then(function() {
            obj.data.video_url = null
            obj.getPlayer().stop();
        });
    }

    function loadVideo(data) {
        if (angular.isDefined(data.provider)){
            this.data.provider = data.provider;
        }
        
        return this.getPromise().then(function() {
            console.log('Load video in playerData: ' + data.video_url);
            var toLoad = {
                video_url: data.video_url,
            };
            obj.data.video_url = data.video_url;
            obj.data.begin = angular.isDefined(data.begin) ? data.begin : 0;
            toLoad.begin = obj.data.begin;

            obj.data.end = angular.isDefined(data.end) ? data.end : null;
            toLoad.end =  obj.data.end;
            
            obj.getPlayer().loadVideo(toLoad);
        });
    }

    function getPromise() {
        console.log("Getting promise for: " + this.data.provider);
        return this.deferred[this.data.provider].promise;
    }

    function updateCurrentTag(newVal) {
//        console.log(VideoTagData.currentTag);
        var current = VideoTagData.currentTag;
        if (angular.isDefined(current) && current !== null) {
            //console.log("current tag is defined: " + newVal + " in ? " + current.id + " [" + current.begin+", "+current.end+"]");
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
        console.log("Searching for next tag...");
        VideoTagData.setCurrentTag(VideoTagData.findNextTagToPlay(newVal));
    }

    function getCurrentTime() {
        return obj.getPlayer().getCurrentTime();
    }
}

function VideoTagData(VideoTagEntity, $q) {

    var obj = {
        filters: {},
        currentTag: null,
        data: [],
        limit: 20, // TODO synchro server
        disabled: true,
        currentPage: 1,
        delete: function(id) {
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i].id === id) {
                    this.data.splice(i, 1);
                }
            }
        },
        startLoading: function() {
            this.disabled = false;
            return this.loadPage(1);
        },
        setCurrentTag: function(tag) {
            this.currentTag = tag;
        },
        reset: function() {
            this.currentTag = null;
            this.currentPage = 1;
            this.data = [];
            this.disabled = true;
            this.cachePage = {};
            obj.filters = {};
        },
        setFilter: function(name, value) {
            obj.filters[name] = value;
        },
        setFilters: function(value) {
            this.reset();
            obj.filters = value;
        },
        setOrder: function(value) {
            obj.filters.order = value;
        },
        add: function(tag) {
            this.data.push(tag);
        },
        next: function() {
            return this.data[Math.min(this.data.length - 1, this._getCurrentIndice() + 1)];
        },
        hasPrev: function() {
            return this.data.length > 0 && obj.currentTag !== null && obj.currentTag.id !== this.data[0].id;
        },
        hasNext: function() {
            //console.log(obj.currentTag.id+ ' != ' + this.data[this.data.length - 1].id);
            return this.data.length > 0 && obj.currentTag !== null && obj.currentTag.id !== this.data[this.data.length - 1].id;
        },
        prev: function() {
            return this.data[Math.max(0, this._getCurrentIndice() - 1)];
        },
        findNextTagToPlay: function(playerTime) {
            return this._findTagToPlay(playerTime, 1);
        },
        findPreviousTagToPlay: function(playerTime) {
            return this._findTagToPlay(playerTime, -1);
        },
        _findTagToPlay: function(playerTime, m) {
            for (var i = 0; i < this.data.length; i++) {
                if (m * this.data[i].begin > m * playerTime) {
                    console.log("Found next tag: " + this.data[i].id);
                    return this.data[i];
                }
            }
            return null;
        },
        _getCurrentIndice: function() {
            if (obj.currentTag === null) {
                return 0;
            }
            for (var i = 0; i < this.data.length; i++) {
                if (this.data[i].id === obj.currentTag.id) {
                    return i;
                }
            }
            return 0;
        },
        cachePage: {},
        loadAll: function() {
            var deferred = $q.defer();

            this.loadNextPage()
                    .then(successCallback)
                    .catch(function() {
                        deferred.reject(0);
                    });

            function successCallback(results) {
                if (obj.disabled) {
                    deferred.resolve(results);
                }
                else {
                    obj.loadNextPage().then(successCallback);
                }
            }

            return deferred.promise;
        },
        loadNextPage: function() {
            obj.disabled = true;
            var promise = this.loadPage(this.currentPage);
            obj.currentPage += 1;
            promise.then(function(tags) {
                if (tags.length < obj.limit) {
                    console.log('disabling video tag data loader');
                    obj.disabled = true;
                }
                else {
                    obj.disabled = false;
                }
            });
            return promise;
        },
        loadPage: function(page) {
            console.log('Request page ' + page + ' with filter: ');
            console.log(obj.filters);
            if (this.cachePage[page]) {
                return this.cachePage[page];
            }
//            if (this.disabled) {
//                // TODO 
//            }
            obj.filters.page = page;
            this.cachePage[page] = VideoTagEntity.search(obj.filters, function(tags) {
                console.log('Loading page ' + page + ' response: ' + tags.length + ' tag(s)');
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
        delete: {
            method: 'POST',
            params: {action: 'delete'},
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