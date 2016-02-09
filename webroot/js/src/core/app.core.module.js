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
        .factory('CategoryEntity', CategoryEntity)
        .factory('TagEntity', TagEntity)
        .factory('VideoTagPointEntity', VideoTagPointEntity)
        .factory('VideoTagEntity', VideoTagEntity)
        .factory('AuthenticationService', AuthenticationService)
        .filter('searchCategory', searchCategory)
        .filter('getSportByName', getSportByName);


function PlayerData(VideoTagData) {

    return {
        //extra_class: '',
        player: null,
        currentTag: null,
        visible: true,
        showListTricks: true,
        editionMode: false,
        showEditionMode: function() {
            this.reset();
            this.editionMode = true;
            this.show();
        },
        showViewMode: function() {
            this.reset();
            this.editionMode = false;
            this.show();
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
        url: function(url) {
            if (url !== this.data.video_url) {
                this.data.video_url = url;
                this.loadVideo(url);
            }
        },
        show: function() {
            this.visible = true;
        },
        hide: function() {
            this.stop();
            this.visible = false;
            this.showListTricks = false;
        },
        view: null,
        _view: _view,
        replay: function() {
        },
        reset: function() {
        },
        play: function() {
        },
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
            if (this.view === null) {
                this.view = view;
            }
            this.replay = replay;
            this.reset = reset;
            this.play = play;
//            this.playRange = playRange;
            this.stop = stop;
            this.seekTo = seekTo;
            this.pause = pause;
            this.loadVideo = loadVideo;
            this.playVideoRange = playVideoRange;

            if (this.data.video_url !== null) {
                this.loadVideo(this.data.video_url);
            }
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
        this._view(videoTag);
    }
    function _view(videoTag) {
        console.log("PlayerData._view: " + videoTag.id);
//        console.log(videoTag);
        if (videoTag === null) {
            this.currentTag = null;
            return;
        }
        this.currentTag = videoTag;
        this.data.id = videoTag.id;
        this.data.begin = videoTag.begin;
        this.showListTricks = false;

        if (videoTag.video_url === this.data.video_url &&
                videoTag.end === this.data.end) {
            this.seekTo(videoTag.begin);
        }
        else {
            this.data.end = videoTag.end;
            this.data.video_url = videoTag.video_url;
            this.playVideoRange(videoTag);
        }
    }

    function replay(videoTag) {
        this.seekTo(videoTag.begin);
    }

    function reset() {
        console.log("RESETING DATA");
        VideoTagData.reset();
        this.hide();
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

    function play() {
        this.player.playVideo();
    }

    function seekTo(val) {
        this.player.seekTo(val);
    }
    function pause() {
        this.player.pauseVideo();
    }

    function stop() {
        if (this.player) {
            this.player.stopVideo();
        }
    }

    function loadVideo(url) {
        console.log('Load video in playerData: ' + url);
        //console.log(this);
        this.data.video_url = url;
        this.player.loadVideoById({videoId: url});
    }
}

function VideoTagData(VideoTagEntity, SharedData) {
    var filters = {};

    return {
        data: [],
        limit: 20, // TODO synchro server
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
        loadNextPage: function() {
            if (this.loading) {
                return;
            }
            this.disabled = false;
            this.loading = true;
            var that = this;
            filters.page = this.currentPage;
            SharedData.loadingState = this.data.length > 0 ? 0 : 1;
            VideoTagEntity.search(filters, function(tags) {
                console.log('Loading page ' + that.currentPage + ': ' + tags.length + ' tag(s)');
                if (tags.length < that.limit) {
                    console.log('disabling video tag data loader');
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
        loadingState: 1
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
            isArray: true
        }
    });

}

function CategoryEntity($filter) {
    var url = WEBROOT_FULL + '/Categories/:action/:id.json';
    //var url = '/sys/MediaTagTricks/:action/:id';
    return $resource(url, {id: '@id', action: '@action'}, {
        index: {
            method: 'GET',
            params: {action: 'index'},
            isArray: true
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

AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', 'UserEntity', '$location'];
function AuthenticationService($http, $cookies, $rootScope, UserEntity, $location) {

    var currentUser = null;
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

    function login(username, password) {
        var promise = UserEntity.login({email: username, password: password, id: null}, function(response) {
                    if (response.success) {
                        response.data.provider = null;
                        setCredentials(response.data);
                    }
                }).$promise;
        return promise;
    }

    function signup(data) {
        return UserEntity.signup(data, function(response) {
            console.log(response);
            if (response.success) {
                setCredentials(response.data);
            }
        }).$promise;
    }

    function socialLogin(provider, callback) {

        UserEntity.login({id: null, provider: provider}, function(response) {
            console.log(response);
            if (response.success) {
                response.data.provider = provider;
                setCredentials(response.data);
            }
            callback(response.success, response);
        }).$promise;
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

}



function ServerConfig($http) {
    var baseUrl = 'data/';
    
    var cache = {
        rules: null,
        countries: null,
        config: null
    };
    
    return {
        rules: rules
    };
    
    function rules(){
        load('rules').then()
    }
    
    function load(type){
        if (cache[type] != null){
            return cache[type];
        }
         cache[type] =  $http.get(baseUrl + type + '.json');
         return cache[type];
    }
    
}