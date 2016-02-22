angular.module('app.player')
        .factory('YoutubeCmdMapper', function() {
            
            function YoutubeCmdMapper(player){
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
                return this._player.getCurrentTime();
            }
            function loadVideo(data) {
                this._player.loadVideoById({
                    videoId: data.video_url,
                    startSeconds: data.begin
                });
            }
            
            return {
                create: function(player){
                    return new YoutubeCmdMapper(player);
                }
            };

        })
        .directive('youtube', function($window, VideoEntity, PlayerData, YoutubeCmdMapper) {

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
                                        id: PlayerData.data.video_url,
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
                            var intervalDuration = 100; // 100 means repeat in 100 ms
                            clearInterval(myTimer);
                            switch (event.data) {
                                case YT.PlayerState.PLAYING:
                                    myTimer = setInterval(function() {
                                        var newTime = player.getCurrentTime();
                                        PlayerData.onPlayProgress(newTime);
                                        PlayerData.onCurrentTimeUpdate(newTime);
                                        PlayerData.data.currentTime = newTime;
                                        if (PlayerData.looping && (PlayerData.data.end - newTime) < (intervalDuration/1000)){
                                            console.log("Pre on end triggerd");
                                            PlayerData.onEnd();
                                        }
                                    }, intervalDuration); 
                                    break
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
