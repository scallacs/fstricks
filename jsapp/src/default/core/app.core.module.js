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
        .filter('getSportByName', getSportByName)
        .filter('trickListFilter', trickListFilter);

NotifyOnLoad.$inject = ['$rootScope', '$timeout'];
function NotifyOnLoad($rootScope, $timeout) {
    return function() {
        $timeout(function() {
            $rootScope.$broadcast('notity-player-offset');
        });
    };
}

trickListFilter.$inject = ['SharedData'];
function trickListFilter(SharedData) {
    return function(input) {
        var result = [];
        input.forEach(function(item){
            var keep = (SharedData.currentCategory === null ||
                    (SharedData.currentCategory.id === item.category_id)) 
                    && (SharedData.currentSport === null ||
                            (SharedData.currentSport.id === item.sport_id));
            if (keep){
                result.push(item);
            }
        });
        return result;
    };
}

PlayerData.$inject = ['VideoTagData', '$q'];
function PlayerData(VideoTagData, $q) {
    var obj = {
        initPlayers: initPlayers,
        initData: initData,
        init: init,
        showEditionMode: showEditionMode,
        showViewMode: showViewMode,
        showValidationMode: showValidationMode,
        isMode: isMode,
        getPromise: getPromise, getPlayer: getPlayer,
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
        _view: _view,
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
        hasVideo: hasVideo,
        hide: hide,
        setVideo: setVideo
    };

    obj.init();

    return obj;

    function init() {
        console.log("PlayerData::init");
        obj.initPlayers();
        obj.initData();
    }
    function initData() {
        console.log("PlayerData::initData");
        obj.state = 'hide';
        obj.timer = null;
        obj.visible = true;
        obj.showListTricks = true;
        obj.mode = 'view';
        obj.looping = true; // True if we want to loop on the current tag
        obj.playMode = 'tag'; // tag, playlist, video
        obj.data = {
            begin: 0, end: 0,
            video_url: null,
            duration: 0, currentTime: 0,
            id: null,
            provider: null
        };
        //            obj.onSeek = function() {
        //                obj.getCurrentTime().then(function(currentTime) {
        //                    if ((obj.data.begin !== null && currentTime < obj.data.begin)
        //                            || (obj.data.end !== null && currentTime > obj.data.end)) { //                        obj.looping = false;
        //                    }
        //                });
        //            };
    }
    function initPlayers() {
        obj.deferred = {
            youtube: $q.defer(),
            vimeo: $q.defer()
        };
        obj.players = {
            youtube: null,
            vimeo: null
        };
    }

    function setVideo(data) {
        obj.data.provider = data.provider_id;
        obj.data.duration = data.duration;
    }

    function hasVideo() {
        return !obj.hasError() && obj.state !== 'hide';
    }

    function hide() {
        console.log("Hidding video player");
        obj.state = 'hide';
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
        if (obj.data.provider !== p) {
            if (obj.data.provider) {
                obj.stop(obj.data.provider);
            }
            clearInterval(PlayerData.timer);
            console.log('Changing provider to: ' + p + '(before: ' + obj.data.provider + ')');
            obj.data.provider = p;
            obj.data.video_url = null;
            obj.state = 'pause';
        }
    }

    function toggleLooping() {
        obj.looping ? obj.stopLooping() : obj.startLooping();
    }
    function isMode(m) {
//        console.log("PlayerData::isMode(" + m + ") ? " + obj.mode);
        return obj.mode === m;
    }

    function onTimeRangeEnd(provider, currentTime) {
        console.log("PlayerData::onTimeRangeEnd() mode: " + obj.playMode + ', state: ' + obj.state);
        if (obj.state !== 'play') {
            return;
        }
        if (obj.looping) {
            console.log('Looping on video tag');
            obj.seekTo(obj.data.begin);
        }
        //console.log("onTimeRangeEnd() reached !");
        else if (obj.playMode === 'playlist' && VideoTagData.getLoader().hasData()) {
            if (VideoTagData.hasNext()) {
                obj.playVideoTag(VideoTagData.next(), false);
            } else {
                obj.playVideoTag(VideoTagData.getLoader().getItem(0));
            }
        }
    }
    function hasError() {
//        return obj.data.provider !== null &&
        //                obj.players[obj.data.provider] === false;
        return obj.data.provider !== null &&
                obj.players[obj.data.provider] === false;
    }
    function onPlayProgress(currentTime) {
        //        console.log(currentTime);
        obj.data.currentTime = currentTime;
        //        console.log( obj.data);

        if (obj.playMode === 'video' && !obj.looping) {
            //        console.log(VideoTagData.currentTag);
            var current = VideoTagData.currentTag;
            if (angular.isDefined(current) && current !== null) {
                console.log("current tag is defined: " + currentTime + " in ? " + current.id + " [" + current.begin + ", " + current.end + "]");
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
        else if (obj.data.provider !== null
                && obj.data.end !== null
                && currentTime >= obj.data.end) {
            obj.onTimeRangeEnd(obj.data.provider, currentTime);
        }
    }
    function startLooping() {
        if (VideoTagData.currentTag) {
            obj.looping = true;
        }
    }

    function stopLooping() {
        obj.looping = false;
    }

    function showEditionMode() {
        obj.reset();
        obj.mode = 'edition';
    }

    function showViewMode() {
        obj.reset();
        obj.mode = 'view';
        obj.visible = true;
    }

    function showValidationMode() {
        obj.reset();
        obj.mode = 'validation';
        obj.visible = true;
    }

    function errorPlayer(type, error) {
        console.log("Error for player: " + type + " (" + error + ")");
        obj.deferred[type].reject(error);
        obj.players[type] = false;
    }

    function isProvider(provider) {
        return obj.data.provider === provider;
    }

    function setPlayer(type, player) {
        console.log("PlayerData::setPlayer : " + type);
        obj.players[type] = player;
        obj.deferred[type].resolve(player);
    }
    // TODO reset players
    function resetPlayer(type) {
        if (obj.deferred[type]) {
            console.log("Resetting player: " + type);
            obj.deferred[type].reject("player reset");
        }
        obj.players[type] = null;
        obj.deferred[type] = $q.defer();
    }
    function getPlayer() {
        //console.log(obj.players[obj.data.provider]);
        return obj.players[obj.data.provider];
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
        return obj.seekTo(videoTag.begin);
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
        return obj.getPromise().then(function(player) {
            player.play();
        });
    }

    function seekTo(val) {
        return obj.getPromise().then(function(player) {
            player.seekTo(val);
        });
    }
    function pause() {
        return obj.getPromise().then(function(player) {
            player.pause();
        });
    }

    function stop(provider) {
        if (!angular.isDefined(provider) && obj.data.provider === null) {
            return $q.defer();
        }
        else if (!angular.isDefined(provider)) {
            provider = obj.data.provider;
        }
        console.log('Stoping video from provider: ' + provider);
        obj.looping = false;
        return obj.deferred[provider].promise.then(function(player) {
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
            return obj.getPromise().then(function(player) {
                console.log('Load video in playerData: ' + data.video_url);
                var toLoad = {
                    video_url: data.video_url,
                };
                obj.data.begin = angular.isDefined(data.begin) ? data.begin : 0;
                toLoad.begin = obj.data.begin;

                obj.data.end = angular.isDefined(data.end) ? data.end : null;
                toLoad.end = obj.data.end;
                obj.state = 'stop';
                obj.state = 'play';
                player.loadVideo(toLoad);
            });
        }
    }


    function getPromise() {
        console.log("Getting promise for: " + obj.data.provider);
        if (!obj.data.provider) {
            throw "Unkown video provider: " + obj.data.provider;
        }
        return obj.deferred[obj.data.provider].promise;
    }


    function getCurrentTime() {
        return obj.getPlayer().getCurrentTime();
    }
}

PaginateDataLoader.$inject = ['$q'];
function PaginateDataLoader($q) {

    function PaginateDataLoader(r) {
        this.resource = r;
        this.init();
    }
    PaginateDataLoader.prototype.init = init;
    PaginateDataLoader.prototype.initData = initData;
    PaginateDataLoader.prototype.loadAll = loadAll;
    PaginateDataLoader.prototype.loadNextPage = loadNextPage;
    PaginateDataLoader.prototype.hasNextPage = hasNextPage;
    PaginateDataLoader.prototype.loadPage = loadPage;
    PaginateDataLoader.prototype.setFilters = setFilters;
    PaginateDataLoader.prototype.updateFilters = updateFilters;
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
        _instances: {},
        create: function(r) {
            return new PaginateDataLoader(r);
        },
        instance: function(name, r) {
            if (!angular.isDefined(this._instances[name])) {
                this._instances[name] = new PaginateDataLoader(r);
            } else {
                this._instances[name].setResource(r);
            }
            return this._instances[name];
        },
        clear: function() {
            this._instances = {};
        }
    };

    function init() {
        this.filters = {};
        this.initData();
        this.limit = 20; // TODO synchro server
        this.disabled = true;
        this.loading = false;
        //this.resource = null; VideoTagEntity.search; DO NOT RESET
        this.mode = 'append'; // Append to data Other mode: 'replace'
        return this;
    }

    function hasNextPage() {
        return this.mode === 'append' && this.data.total > this.data.items.length;
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

        // results contains only the last page
        function successCallback(results) {
            if (that.disabled) {
                deferred.resolve(that.data);
            } else {
                that.loadNextPage().then(successCallback);
            }
        }
    }

    function startLoading() {
        this.disabled = false;
        this.currentPage = 1;
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
            } else {
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
        console.log('[Loader] Loading page ' + this.filters.page + ': ' + tags.length + ' item(s)');
        if (this.mode === 'append') {
            for (var i = 0; i < tags.length; i++) {
                this.data.items.push(tags[i]);
            }
            console.log('[Loader] ' + this.data.items.length + '/' + data.total + ' items');
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
    
    function updateFilters(filters){
        var self = this;
//        var restrictif = true;
        angular.forEach(filters, function(val, key){
//            restrictif = restrictif && !this.filters[key];
            self.filters[key] = val;
        });
        return this;
    }
    
    function initData(){
        this.data = {
            total: 0,
            perPage: null,
            items: []
        };
        this.currentPage = 1;
        this.cachePage = {};
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

VideoTagData.$inject = ['PaginateDataLoader', 'VideoTagEntity'];
function VideoTagData(PaginateDataLoader, VideoTagEntity) {

    var obj = {
        getLoader: function() {
            return PaginateDataLoader.instance('default', VideoTagEntity.search);
        },
        currentTag: null,
        setCurrentTag: function(tag) {
            this.currentTag = tag;
        },
        reset: function() {
            PaginateDataLoader.instance('default', VideoTagEntity.search).init();
            this.currentTag = null;
        },
        next: function() {
            return this.getItems()[Math.min(this.getItems().length - 1, this._getCurrentIndice() + 1)];
        },
        getItems: function() {
            return this.getLoader().data.items;
        }, hasPrev: function() {
            return this.getItems().length > 0 && obj.currentTag !== null && obj.currentTag.id !== this.getItems()[0].id;
        }, hasNext: function() {
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

    obj.getLoader().setResource(VideoTagEntity.search);

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
SharedData.$inject = ['SportEntity'];
function SharedData(SportEntity) {
    var self = {
        setCurrentSearch: setCurrentSearch,
        setCurrentCategory: setCurrentCategory,
        onReady: onReady,
        pageLoader: pageLoader,
        pageTitle: pageTitle,
        init: init,
        toFilter: toFilter,
        
        sports: [],
        loadingState: true,
        currentSearch: {},
        currentSport: null,
        currentCategory: null,
        categories: [],
        _pageTitle: ''
    };

    return self;

    function toFilter(){
        return {
            category_id: self.currentCategory ? self.currentCategory.id : null,
            sport_id: self.currentSport ? self.currentSport.id : null,
            q: self.currentSearch ? self.currentSearch.term : null
        };
    }

    function setCurrentCategory(c) {
        this.currentCategory = c;
    }

    function setCurrentSearch(s) {
        console.log('Setting current search: ');
        console.log(s);
        if (s === null) {
            this._pageTitle = '';
            this.currentSearch = {};
            return;
        }
        this._pageTitle = s.category;
        this._pageTitle += ' ' + s.title;
        this.currentSearch = s;
    }

    function pageTitle() {
        return this._pageTitle;
    }

    function onReady() {
        return this.loadingPromise;
    }

    function pageLoader(val) {
        //console.log('Set loading sate: ' + val);
        self.loadingState = val ? true : false;
    }

    function init() {
        this.loadingPromise = SportEntity.index({}, function(response) {
            self.sports = response;
            self.categories = [];
            for (var i = 0; i < response.length; i++) {
                var sport = response[i];
                for (var j = 0; j < sport.categories.length; j++) {
                    var category = sport.categories[j];
                    self.categories.push({
                        category_name: category.name,
                        category_id: category.id,
                        sport_name: sport.name,
                        sport_image: sport.image,
                        sport_id: sport.id
                    });
                }
            }
        }).$promise;
    }
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
        }, profile: {
            method: 'GET',
            params: {action: 'profile'},
            isArray: false
        }
    });
}

UserEntity.$inject = ['$resource'];
function UserEntity($resource) {
    var url = API_BASE_URL + '/Users/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {profile: {
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
        },
        resetPassword: {
            method: 'POST',
            params: {action: 'reset_password', id: null},
            isArray: false
        },
        changePassword: {
            method: 'POST',
            params: {action: 'change_password', id: null},
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
    return $resource(url, {id: '@id', action: '@action', sport: '@sport', category: '@category', trick: '@trick'}, {suggest: {
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
        trending: {
            method: 'GET',
            params: {action: 'trending'},
            isArray: true
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
        }, similar: {
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
        trending: {
            method: 'GET',
            params: {action: 'trending'},
            isArray: true
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
    var resource = $resource(WEBROOT_FULL + '/data/:action.json', {action: '@action'}, {
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

AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', 'UserEntity', '$state', 'PaginateDataLoader', '$auth'];
function AuthenticationService($http, $cookies, $rootScope, UserEntity, $state, PaginateDataLoader, $auth) {
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
    service.isProvider = isProvider;
    service.logFromCookie = logFromCookie;
    service.init = init;
    service.setAuthData = setAuthData;

    service.authData = {
        token: null,
        user: null,
        provider: null,
        isAuthed: function() {
            return service.isAuthed();
        }
    };

    return service;

    function init() {
        service.logFromCookie();
    }

    function isProvider(p) {
        console.log('Provider: ' + service.authData.provider + ' ?= ' + p);
        return service.authData.provider === p;
    }

    function isAuthed() {
        return service.authData.token !== null && service.authData.user !== null;
    }

    function getCurrentUser() {
        return service.authData.user;
    }

    function setAuthData(data, provider) {
        if (data === null) {
            service.authData.user = null;
            service.authData.token = null;
            service.authData.provider = null;
        }
        else {
            service.authData.user = data.user;
            service.authData.token = data.token;
            service.authData.provider = provider ? provider : data.provider;
        }
    }

    function logFromCookie() {
        var globals = $cookies.getObject('globals');
        if (!globals) {
            console.log("Getting current user from cookies: NO COOKIES");
            service.setAuthData(null);
            return;
        }
        console.log("Getting current user from cookies");
        service.setAuthData(globals);
        setHttpHeader();
    }

    function login(username, password) {
        var promise = UserEntity.login({email: username, password: password, id: null}, function(response) {
            if (response.success) {
                service.setCredentials('local', response.data);
            }
        }).$promise;
        return promise;
    }

    function signup(data) {
        return UserEntity.signup(data, function(response) {
            console.log(response);
            if (response.success) {
                service.setCredentials('local', response.data);
            }
        }).$promise;
    }

    function requestPassword(email) {
        return UserEntity.requestPassword({email: email}, function(response) {
            console.log(response);
        }).$promise;
    }

    function socialLogin(provider) {
        var promise = $auth.authenticate(provider, {provider: provider});
        promise.then(successCallback);

        function successCallback(response) {
            response = response.data;
            if (response.success) {
                service.setCredentials(provider, response.data);
            }
        }
        return promise;

//        return UserEntity.socialLogin({id: null, provider: provider}, function(response) {
//            console.log(response);
//            if (response.success) {
//                service.setCredentials(provider, response.data);
//            }
//            callback(response.success, response);
        //        }).$promise;
    }

    function setHttpHeader() {
        console.log('Setting auth header with token: ' + service.authData.token);
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + service.authData.token;
    }

    function setCredentials(provider, data) {
        console.log('Setting credential from : ' + provider);
        service.setAuthData(data, provider);
        console.log(service.authData);
        $rootScope.globals = service.authData; // TODO useless ? 
        $cookies.remove('globals');

        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 7); // TODO param

        $cookies.putObject('globals', service.authData, {'expires': expireDate});
        console.log("Saving credential for user: " + data.user.email + " with provider " + provider + " - stored: " + getCurrentUser().email);
        setHttpHeader();
    }

    function logout() {
        UserEntity.logout(function() {
            clearCredentials();
        }, function() {

        });
        PaginateDataLoader.clear();
    }

    function clearCredentials() {
        service.setAuthData(null);
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
