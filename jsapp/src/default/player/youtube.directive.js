angular.module('app.player')
        .factory('YoutubeCmdMapper', ['$q', function($q) {
                function YoutubeCmdMapper(player) {
                    this._player = player;
                }
                YoutubeCmdMapper.prototype = {
                    seekTo: seekTo,
                    getCurrentTime: getCurrentTime,
                    loadVideo: loadVideo,
                    play: play,
                    stop: stop,
                    pause: pause
                };

                function seekTo(seconds) {
                    this._player.seekTo(seconds);
                }
                function play() {
                    this._player.playVideo();
                }
                function stop() {
                    this._player.stopVideo();
                }
                function pause() {
                    this._player.pauseVideo();
                }
                function getCurrentTime() {
                    return $q.when(this._player.getCurrentTime());
                }
                function loadVideo(data, play) {
                    this._player.loadVideoById({
                        videoId: data.video_url,
                        startSeconds: data.begin
                    });
                }
                return {
                    create: function(player) {
                        return new YoutubeCmdMapper(player);
                    }
                };

            }])
        .directive('youtube', youtubeDirective);

youtubeDirective.$inject = ['$window', 'VideoEntity', 'PlayerData', 'YoutubeCmdMapper'];
function youtubeDirective($window, VideoEntity, PlayerData, YoutubeCmdMapper) {

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
            height: '100%',
            width: '100%',
            videoId: PlayerData.data.video_url,
            events: {
                onError: function(error) {
                    switch (error.data) {
                        case 2: // Invalid id
                            break;
                        case 100: // Video has been removed
                        case 101: // Video is private
                        case 150: // Same, video is private
                            VideoEntity.reportDeadLink({
                                video_url: PlayerData.data.video_url,
                                provider: 'youtube'
                            }, function() {
                                // ignore results
                            });
                            break
                    }
                    PlayerData.errorPlayer('youtube', error.data);
                },
                onReady: function() {
                    console.log("onYouTubePlayerReady()");
                    scope.$emit('onYouTubePlayerReady', player);
                    PlayerData.setPlayer('youtube', YoutubeCmdMapper.create(player));
                },
                onStateChange: function(event) {
                    var intervalDuration = 100; // TODO constant 100 means repeat in 100 ms
                    clearInterval(PlayerData.timer);

                    switch (event.data) {
                        case YT.PlayerState.PAUSED:
                            PlayerData.onPause();
                            break;
                        case YT.PlayerState.ENDED:
                            PlayerData.onFinish();
                            break;
                        case YT.PlayerState.PLAYING:
                            PlayerData.onPlay();
                            if (PlayerData.looping && PlayerData.data.end < player.getCurrentTime()) {
                                PlayerData.onTimeRangeEnd('youtube', player.getCurrentTime());
                            }
                            console.log("Setting youtube time event");
                            PlayerData.timer = setInterval(function() {
//                                if (PlayerData.looping) {
//                                    var durationBeforeEnd = PlayerData.data.end - player.getCurrentTime();
//                                    if (durationBeforeEnd < 0.3 && durationBeforeEnd > 0) {
//                                        console.log("Just before end: " + durationBeforeEnd);
//                                        setTimeout(function() {
//                                            PlayerData.onPlayProgress(player.getCurrentTime());
//                                        }, (durationBeforeEnd-0.01) * 1000);
//                                    }
//                                }
                                scope.$apply(function() {
                                    PlayerData.onPlayProgress(player.getCurrentTime());
                                });
//                                        console.log(PlayerData.data.end - newTime);
//                                if (PlayerData.looping 
//                                        && (PlayerData.data.end - newTime) < (intervalDuration / 1000)) {
//                                    PlayerData.onTimeRangeEnd('youtube');
//                                }
                            }, intervalDuration);
                            break
                    }
//                    YT.PlayerState.ENDED
//                    YT.PlayerState.PLAYING
//                    YT.PlayerState.PAUSED
//                    YT.PlayerState.BUFFERING
//                    YT.PlayerState.CUED
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

            element.on('$destroy', function() {
                PlayerData.resetPlayer('youtube');
            });
        }
    };
}