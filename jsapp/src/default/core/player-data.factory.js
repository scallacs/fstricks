angular
        .module('app.core')
        .factory('PlayerData', PlayerData);

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
            begin: 0, 
            end: 0,
            video_url: null,
            duration: 0, 
            currentTime: 0,
            id: null,
            provider: null
        };
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

    function setVideo(video) {
        obj.data.provider = video.provider_id;
        obj.data.duration = video.duration;
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
        VideoTagData.setCurrentTag(videoTag);
        if (!videoTag) {
            console.log("Try to view a null videoTag");
            return;
        }
        console.log("PlayerData._view: " + videoTag.id);
        console.log(videoTag);
        obj.data.id = videoTag.id;
        obj.showListTricks = false;
        obj.looping = !angular.isDefined(looping) ? (obj.playMode === 'tag') : looping;
        //        console.log("Play mode: " + obj.playMode + ". Set looping: " + obj.looping);
        return obj.loadVideo(videoTag.video.provider_id, {
            video_url: videoTag.video.video_url,
            begin: videoTag.begin, 
            end: videoTag.end
        });
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

    function loadVideo(provider, video) {
        if (obj.isProvider(provider) &&
                video.video_url === obj.data.video_url) {
            console.log('Same video, same provider');
            obj.data.begin = video.begin;
            obj.data.end = video.end;
            return obj.seekTo(video.begin);
        }
        else {
            console.log('Load video: ' + video.video_url + ' with ' + provider);
            obj.setProvider(provider);
            obj.data.video_url = video.video_url;
            return obj.getPromise().then(function(player) {
                console.log('Load video in playerData: ' + video.video_url);
                obj.data.end = video.end;
                obj.data.begin = video.begin;
                obj.state = 'play';
                player.loadVideo(video);
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
