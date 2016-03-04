angular
        .module('app.core', ['ngCookies'])
        .factory('PlayerData', PlayerData)
        .factory('VideoTagData', VideoTagData)
        .factory('PaginateDataLoader', PaginateDataLoader)
        .factory('SharedData', SharedData)
        .factory('NationalityEntity', NationalityEntity)
        .factory('RiderEntity', RiderEntity)
        .factory('UserEntity', UserEntity)
        .factory('ErrorReportEntity', ErrorReportEntity)
        .factory('VideoEntity', VideoEntity)
        .factory('SportEntity', SportEntity)
        .factory('TagEntity', TagEntity)
        .factory('UpDownPointEntity', UpDownPointEntity)
        .factory('VideoTagEntity', VideoTagEntity)
        .factory('PlaylistEntity', PlaylistEntity)
        .factory('PlaylistItemEntity', PlaylistItemEntity)
        .factory('AuthenticationService', AuthenticationService)
        .factory('ServerConfigEntity', ServerConfigEntity)
        .factory('VideoTagAccuracyRateEntity', VideoTagAccuracyRateEntity)
        .directive('notifyOnLoad', NotifyOnLoad)
        .filter('searchCategory', searchCategory)
        .filter('getSportByName', getSportByName);

NotifyOnLoad.$inject = ['$rootScope', '$timeout'];
function NotifyOnLoad($rootScope, $timeout) {
    return function() {
        $timeout(function() {
            $rootScope.$broadcast('notity-player-offset');
        });
    };
}

PlayerData.$inject = ['VideoTagData', '$q'];
function PlayerData(VideoTagData, $q) {
    var obj = {
        initPlayers: function() {
            this.deferred = {
                youtube: $q.defer(),
                vimeo: $q.defer()
            };
            this.players = {
                youtube: null,
                vimeo: null
            };
        },
        initData: function() {
            this.state = 'pause';
            this.timer = null;
            this.visible = true;
            this.showListTricks = true;
            this.mode = 'view';
            this.looping = true; // True if we want to loop on the current tag
            this.playMode = 'tag'; // tag, playlist, video
            this.data = {
                begin: 0,
                end: 0,
                video_url: null,
                duration: 0,
                currentTime: 0,
                id: null,
                provider: null
            };
//            this.onSeek = function() {
//                obj.getCurrentTime().then(function(currentTime) {
//                    if ((obj.data.begin !== null && currentTime < obj.data.begin)
//                            || (obj.data.end !== null && currentTime > obj.data.end)) {
//                        obj.looping = false;
//                    }
//                });
//            };
        },
        init: function() {
            console.log("Init PlayerData");
            this.initPlayers();
            this.initData();
        },
        showEditionMode: showEditionMode,
        showViewMode: showViewMode,
        showValidationMode: showValidationMode,
        isMode: isMode,
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
        hasError: hasError,
        getCurrentTime: getCurrentTime,
        resetPlayer: resetPlayer,
        toggleLooping: toggleLooping,
        setProvider: setProvider,
        onTimeRangeEnd: onTimeRangeEnd,
        onPlayProgress: onPlayProgress,
        onFinish: onFinish,
        onPause: onPause,
        onPlay: onPlay,
        hasVideo: hasVideo
    };

    obj.init();

    return obj;

    function hasVideo() {
        return this.data.video_url !== null && this.data.provider !== null && this.state !== 'stop';
    }

    function onFinish() {
        console.log('Player::onFinish');
        obj.state = 'stop';
    }
    function onPause() {
        console.log('Player::onPause');
        obj.state = 'pause';
    }
    function onPlay() {
        console.log('Player::onPlay');
        obj.state = 'play';
    }

    function setProvider(p) {
        if (this.data.provider !== p) {
            if (this.data.provider) {
                obj.stop(this.data.provider);
            }
            clearInterval(PlayerData.timer);
            console.log('Changing provider to: ' + p + '(before: ' + this.data.provider + ')');
            obj.data.provider = p;
            obj.data.video_url = null;
            obj.state = 'pause';
        }
    }

    function toggleLooping() {
        obj.looping ? obj.stopLooping() : obj.startLooping();
    }
    function isMode(m) {
        return this.mode === m;
    }

    function onTimeRangeEnd(provider, currentTime) {
        console.log("PlayerData::onTimeRangeEnd() mode: " + obj.playMode + ', state: ' + obj.state);
        if (obj.state !== 'play') {
            return;
        }
        if (obj.looping) {
            console.log('Looping on video tag');
            obj.seekTo(this.data.begin);
        }
        //console.log("onTimeRangeEnd() reached !");
        else if (obj.playMode === 'playlist' && VideoTagData.getLoader().hasData()) {
            if (VideoTagData.hasNext()) {
                obj.playVideoTag(VideoTagData.next(), false);
            }
            else {
                obj.playVideoTag(VideoTagData.getLoader().getItem(0));
            }
        }
    }
    function hasError() {
//        return this.data.provider !== null &&
//                this.players[this.data.provider] === false;
        return this.data.provider !== null &&
                this.players[this.data.provider] === false;
    }
    function onPlayProgress(currentTime) {
//        console.log(currentTime);
        obj.data.currentTime = currentTime;
//        console.log( obj.data);
        if (obj.data.provider !== null
                && obj.data.end !== null
                && currentTime >= obj.data.end) {
            obj.onTimeRangeEnd(this.data.provider, currentTime);
        }
        else if (this.playMode === 'video') {
//        console.log(VideoTagData.currentTag);
            var current = VideoTagData.currentTag;
            if (angular.isDefined(current) && current !== null) {
                //console.log("current tag is defined: " + newVal + " in ? " + current.id + " [" + current.begin+", "+current.end+"]");
                if (current.begin <= currentTime && current.end >= currentTime) {
                    current.time_to_play = 0;
                    obj.data.end = current.end;
                    obj.data.begin = current.begin;
                    return;
                }
                else if (current.begin > currentTime) {
                    current.time_to_play = Math.round(current.begin - currentTime, 0);
                    return;
                }
            }
            console.log("Searching for next tag...");
            VideoTagData.setCurrentTag(VideoTagData.findNextTagToPlay(currentTime));
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
        this.mode = 'edition';
    }

    function showViewMode() {
        this.reset();
        this.mode = 'view';
        this.visible = true;
    }

    function showValidationMode() {
        this.reset();
        this.mode = 'validation';
        this.visible = true;
    }

    function errorPlayer(type, error) {
        console.log("Error for player: " + type + " (" + error + ")");
        this.deferred[type].reject(error);
        this.players[type] = false;
    }

    function isProvider(provider) {
        return this.data.provider === provider;
    }

    function setPlayer(type, player) {
        console.log("PlayerData::setPlayer : " + type);
        this.players[type] = player;
        this.deferred[type].resolve(player);
    }
    // TODO reset players
    function resetPlayer(type) {
        if (this.deferred[type]) {
            console.log("Resetting player: " + type);
            this.deferred[type].reject("player reset");
        }
        this.players[type] = null;
        this.deferred[type] = $q.defer();
    }
    function getPlayer() {
        //console.log(this.players[this.data.provider]);
        return this.players[this.data.provider];
    }
    function playVideoTag(videoTag, looping) {
        return _view(videoTag, looping);
    }
    function _view(videoTag, looping) {
        console.log("PlayerData._view: " + videoTag.id);
        console.log(videoTag);
        VideoTagData.setCurrentTag(videoTag);
        if (videoTag === null) {
            console.log("Try to view a null videoTag");
            return;
        }
        obj.data.id = videoTag.id;
        obj.showListTricks = false;
        obj.looping = !angular.isDefined(looping) ? (obj.playMode === 'tag') : looping;
//        console.log("Play mode: " + obj.playMode + ". Set looping: " + obj.looping);

        return obj.loadVideo(videoTag.provider_id, videoTag);
    }

    function replay(videoTag) {
        return this.seekTo(videoTag.begin);
    }

    function reset() {
        console.log("PlayerData::reset()");
        VideoTagData.reset();
        obj.stop();
        clearInterval(obj.timer);
        obj.initData();
        return this;
    }

    function play() {
        return this.getPromise().then(function(player) {
            player.play();
        });
    }

    function seekTo(val) {
        return this.getPromise().then(function(player) {
            player.seekTo(val);
        });
    }
    function pause() {
        return this.getPromise().then(function(player) {
            player.pause();
        });
    }

    function stop(provider) {
        if (!angular.isDefined(provider) && this.data.provider === null) {
            return $q.defer();
        }
        else if (!angular.isDefined(provider)) {
            provider = this.data.provider;
        }
        console.log('Stoping video from provider: ' + provider);
        this.looping = false;
        return this.deferred[provider].promise.then(function(player) {
            player.stop();
        });
    }

    function loadVideo(provider, data) {
        if (obj.isProvider(provider) &&
                data.video_url === obj.data.video_url) {
            console.log('Same video, same provider');
            obj.data.begin = data.begin;
            obj.data.end = data.end;
            return obj.seekTo(data.begin);
        }
        else {
            console.log('Load video: ' + data.video_url + ' with ' + provider);
            obj.setProvider(provider);
            obj.data.video_url = data.video_url;
            return this.getPromise().then(function(player) {
                console.log('Load video in playerData: ' + data.video_url);
                var toLoad = {
                    video_url: data.video_url,
                };
                obj.data.begin = angular.isDefined(data.begin) ? data.begin : 0;
                toLoad.begin = obj.data.begin;

                obj.data.end = angular.isDefined(data.end) ? data.end : null;
                toLoad.end = obj.data.end;

                player.loadVideo(toLoad);
            });
        }
    }


    function getPromise() {
        console.log("Getting promise for: " + this.data.provider);
        return this.deferred[this.data.provider].promise;
    }


    function getCurrentTime() {
        return obj.getPlayer().getCurrentTime();
    }
}

PaginateDataLoader.$inject = ['VideoTagEntity', '$q'];
function PaginateDataLoader(VideoTagEntity, $q) {

    function PaginateDataLoader() {
        this.init();
    }
    PaginateDataLoader.prototype.init = init;
    PaginateDataLoader.prototype.loadAll = loadAll;
    PaginateDataLoader.prototype.loadNextPage = loadNextPage;
    PaginateDataLoader.prototype.loadPage = loadPage;
    PaginateDataLoader.prototype.setFilters = setFilters;
    PaginateDataLoader.prototype.setFilter = setFilter;
    PaginateDataLoader.prototype.setLimit = setLimit;
    PaginateDataLoader.prototype.remove = remove;
    PaginateDataLoader.prototype.startLoading = startLoading;
    PaginateDataLoader.prototype.setOrder = setOrder;
    PaginateDataLoader.prototype.add = add;
    PaginateDataLoader.prototype.prepend = prepend;
    PaginateDataLoader.prototype.hasData = hasData;
    PaginateDataLoader.prototype.setResource = setResource;
    PaginateDataLoader.prototype.setMode = setMode;
    PaginateDataLoader.prototype.getItem = getItem;
    PaginateDataLoader.prototype._onSuccessPageLoad = _onSuccessPageLoad;

    return {
        instances: {},
        instance: function(name) {
            if (!angular.isDefined(this.instances[name])) {
                this.instances[name] = new PaginateDataLoader();
            }
            return this.instances[name];
        },
        clear: function() {
            this.instances = {};
        }
    };

    function init() {
        this.filters = {};
        this.data = {
            total: null,
            perPage: null,
            items: []
        };
        this.limit = 20; // TODO synchro server
        this.disabled = true;
        this.loading = false;
        this.currentPage = 1;
        this.cachePage = {};
        this.resource = VideoTagEntity.search;
        this.mode = 'append'; // Append to data Other mode: 'replace'
        return this;
    }

    function getItem(i) {
        return this.data.items[i];
    }

    function setResource(r) {
        this.resource = r;
        return this;
    }

    function setMode(m) {
        this.mode = m;
        return this;
    }

    function setLimit(l) {
        this.limit = l;
        this.setFilter('limit', l);
        return this;
    }

    function hasData() {
        return this.data.items.length > 0;
    }

    function setOrder(value) {
        this.filters.order = value;
        return this;
    }

    function add(tag) {
        this.data.items.push(tag);
        this.data.total += 1;
    }
    // Add item in first position
    function prepend(tag) {
        this.data.items.unshift(tag);
        this.data.total += 1;
    }

    function loadAll() {
        var that = this;
        var deferred = $q.defer();

        this.loadNextPage()
                .then(successCallback)
                .catch(function() {
                    deferred.reject(0);
                });

        return deferred.promise;

        function successCallback(results) {
            if (that.disabled) {
                deferred.resolve(results);
            }
            else {
                that.loadNextPage().then(successCallback);
            }
        }
    }

    function startLoading() {
        this.disabled = false;
        return this.loadNextPage();
    }

    function loadNextPage() {
        var that = this;
        this.disabled = true;
        var promise = this.loadPage(this.currentPage);
        this.currentPage += 1;
        promise.then(function(data) {
            if (data.items.length < data.perPage) {
                console.log('disabling video tag data loader');
                that.disabled = true;
            }
            else {
                that.disabled = false;
            }
        });
        return promise;
    }

    function loadPage(page) {
        var that = this;
        console.log('Request page ' + page + ' with filter: ');
        console.log(this.filters);
//        console.log(that.data.items);
        if (!angular.isDefined(this.cachePage[page])) {
            this.filters.page = page;
            this.loading = true;
            this.cachePage[page] = this.resource(this.filters).$promise;
        }
        this.cachePage[page]
                .then(function(data) {
                    that._onSuccessPageLoad(data)
                })
                .catch(function() {
                    that.disabled = true;
                })
                .finally(function() {
                    that.loading = false;
                });
        return this.cachePage[page];
    }

    function setFilter(name, value) {
        this.filters[name] = value;
        return this;
    }

    function _onSuccessPageLoad(data) {
        this.data.perPage = data.perPage;
        this.data.total = data.total;
        this.data.extra = data.extra;

        var tags = data.items;
        console.log('[OK] Loading page ' + this.filters.page + ': ' + tags.length + ' item(s)');
        if (this.mode === 'append') {
            for (var i = 0; i < tags.length; i++) {
                this.data.items.push(tags[i]);
            }
        }
        else {
            this.data.items = tags;
        }
    }

    function setFilters(value) {
        this.init();
        console.log("Setting filters: ");
        console.log(value);
        this.filters = value;
        return this;
    }

    function remove(id) {
        for (var i = 0; i < this.data.items.length; i++) {
            if (this.data.items[i].id === id) {
                this.data.items.splice(i, 1);
                return;
            }
        }
        console.log("Cannot find item to remove: " + id);
    }
}

VideoTagData.$inject = ['PaginateDataLoader'];
function VideoTagData(PaginateDataLoader) {

    var obj = {
        getLoader: function() {
            return PaginateDataLoader.instance('default');
        },
        currentTag: null,
        setCurrentTag: function(tag) {
            this.currentTag = tag;
        },
        reset: function() {
            PaginateDataLoader.instance('default').init();
            this.currentTag = null;
        },
        next: function() {
            return this.getItems()[Math.min(this.getItems().length - 1, this._getCurrentIndice() + 1)];
        },
        getItems: function() {
            return this.getLoader().data.items;
        },
        hasPrev: function() {
            return this.getItems().length > 0 && obj.currentTag !== null && obj.currentTag.id !== this.getItems()[0].id;
        },
        hasNext: function() {
            //console.log(obj.currentTag.id+ ' != ' + this.getItems()[this.getItems().length - 1].id);
            return this.getItems().length > 0 && obj.currentTag !== null && obj.currentTag.id !== this.getItems()[this.getItems().length - 1].id;
        },
        prev: function() {
            return this.getItems()[Math.max(0, this._getCurrentIndice() - 1)];
        },
        findNextTagToPlay: function(playerTime) {
            return this._findTagToPlay(playerTime, 1);
        },
        findPreviousTagToPlay: function(playerTime) {
            return this._findTagToPlay(playerTime, -1);
        },
        _findTagToPlay: function(playerTime, m) {
            for (var i = 0; i < this.getItems().length; i++) {
                if (m * this.getItems()[i].begin > m * playerTime) {
                    console.log("Found next tag: " + this.getItems()[i].id);
                    return this.getItems()[i];
                }
            }
            return null;
        },
        _getCurrentIndice: function() {
            if (obj.currentTag === null) {
                return 0;
            }
            for (var i = 0; i < this.getItems().length; i++) {
                if (this.getItems()[i].id === obj.currentTag.id) {
                    return i;
                }
            }
            return 0;
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
            //console.log('Set loading sate: ' + val);
            this.loadingState = val ? true : false;
        },
        currentSearch: {}
    };
    return data;
}

NationalityEntity.$inject = ['$resource'];
function NationalityEntity($resource) {

    var url = API_BASE_URL + '/nationalities/:action.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        all: {
            method: 'GET',
            params: {action: 'index'},
            isArray: true
        }
    });
}

RiderEntity.$inject = ['$resource'];
function RiderEntity($resource) {
    var url = API_BASE_URL + '/Riders/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        search: {
            method: 'GET',
            params: {action: 'local_search'},
            isArray: true
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

UserEntity.$inject = ['$resource'];
function UserEntity($resource) {
    var url = API_BASE_URL + '/Users/:action/:id.json';
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
        logout: {
            method: 'POST',
            params: {action: 'logout', id: null},
            isArray: false
        },
        signup: {
            method: 'POST',
            params: {action: 'signup'},
            isArray: false
        },
        requestPassword: {
            method: 'POST',
            params: {action: 'request_password', id: null},
            isArray: false
        }
    });
}

ErrorReportEntity.$inject = ['$resource'];
function ErrorReportEntity($resource) {
    var url = API_BASE_URL + '/ReportErrors/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        post: {
            method: 'POST',
            params: {action: 'add'},
            isArray: false
        }
    });
}

VideoEntity.$inject = ['$resource'];
function VideoEntity($resource) {
    var url = API_BASE_URL + '/Videos/:action/:id/:provider.json';
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

SportEntity.$inject = ['$resource'];
function SportEntity($resource) {
    var url = API_BASE_URL + '/Sports/:action/:id.json';
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

TagEntity.$inject = ['$resource'];
function TagEntity($resource) {
    var url = API_BASE_URL + '/Tags/:action/:id.json';
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

UpDownPointEntity.$inject = ['$resource'];
function UpDownPointEntity($resource) {
    var url = API_BASE_URL + '/:controller/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action', controller: '@controller'}, {
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

VideoTagAccuracyRateEntity.$inject = ['$resource'];
function VideoTagAccuracyRateEntity($resource) {
    var url = API_BASE_URL + '/VideoTagAccuracyRates/:action.json';
    return $resource(url, {action: '@action'}, {
        accurate: {
            method: 'POST',
            params: {action: 'accurate'},
            isArray: false
        },
        fake: {
            method: 'POST',
            params: {action: 'fake'},
            isArray: false
        },
        skip: {
            method: 'POST',
            params: {action: 'skip'},
            isArray: false
        }
    });
}

VideoTagEntity.$inject = ['$resource'];
function VideoTagEntity($resource) {
    var url = API_BASE_URL + '/VideoTags/:action/:id.json';
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
            isArray: false
        },
        validation: {
            method: 'GET',
            params: {action: 'validation'},
            isArray: true
        },
        similar: {
            method: 'POST',
            params: {action: 'similar'},
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
PlaylistEntity.$inject = ['$resource'];
function PlaylistEntity($resource) {
    var url = API_BASE_URL + '/Playlists/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        user: {
            method: 'GET',
            params: {action: 'user'},
            isArray: false
        },
        search: {
            method: 'GET',
            params: {action: 'search'},
            isArray: true
        },
        add: {
            method: 'POST',
            params: {action: 'add'},
            isArray: false
        },
        view: {
            method: 'GET',
            params: {action: 'view'},
            isArray: false
        },
        delete: {
            method: 'POST',
            params: {action: 'delete'},
            isArray: false
        },
        edit: {
            method: 'POST',
            params: {action: 'edit'},
            isArray: false
        }
    });
}

PlaylistItemEntity.$inject = ['$resource'];
function PlaylistItemEntity($resource) {
    var url = API_BASE_URL + '/PlaylistVideoTags/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        playlist: {
            method: 'GET',
            params: {action: 'playlist'},
            isArray: false
        },
        add: {
            method: 'POST',
            params: {action: 'add'},
            isArray: false
        },
        delete: {
            method: 'POST',
            params: {action: 'delete'},
            isArray: false
        },
        edit: {
            method: 'POST',
            params: {action: 'edit'},
            isArray: false
        }
//        down: {
//            method: 'POST',
//            params: {action: 'down'},
//            isArray: false
//        }
    });
}
ServerConfigEntity.$inject = ['$resource'];
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

AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', 'UserEntity', '$state', 'PaginateDataLoader'];
function AuthenticationService($http, $cookies, $rootScope, UserEntity, $state, PaginateDataLoader) {

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
    service.requestPassword = requestPassword;
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
        service.authData.user = globals.user;
        console.log("Getting current user: ");
        console.log(service.authData);
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
                response.data.provider = null;   
                service.setCredentials(response.data);
            }
        }).$promise;
    }

    function requestPassword(email) {
        return UserEntity.requestPassword({email: email}, function(response) {
            console.log(response);
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
        console.log('Setting credential: ');
        console.log(data);
        service.authData.user = data.user;
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + data.token;
        $cookies.remove('globals');
        $cookies.putObject('globals', service.authData);

        console.log("Setting credential for user: " + data.email + " - stored: " + getCurrentUser().email);
    }

    function logout() {
        UserEntity.logout(function() {
            clearCredentials();
        }, function() {

        });
        PaginateDataLoader.clear();
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
