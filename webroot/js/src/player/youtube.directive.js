angular.module('app.player')
        .directive('youtube', function($window, VideoEntity, PlayerData, VideoTagData) {

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
                    height: PlayerData.data.height, // TODO remove safely
                    width: PlayerData.data.width, //PlayerData.data.width,
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
                                        id: PlayerData.player.getVideoData()['video_id'],
                                        provider: 'youtube'
                                    }, function() {
                                        // ignore results
                                    });
                                    break
                            }
                            PlayerData.deferred.reject(error.data);
                        },
                        onReady: function() {
                            console.log("onYouTubePlayerReady()");
                            scope.$emit('onYouTubePlayerReady', player);
                            PlayerData.setPlayer(player);
                        },
                        onStateChange: function(event) {
                            clearInterval(myTimer);
                            switch (event.data) {
                                case YT.PlayerState.ENDED:
                                    player.seekTo(VideoTagData.currentTag.begin);
                                    break;
                                case YT.PlayerState.PLAYING:
                                    myTimer = setInterval(function() {
                                        var newTime = player.getCurrentTime();
                                        PlayerData.onCurrentTimeUpdate(newTime);

                                        if (PlayerData.looping && player.getCurrentTime() > VideoTagData.currentTag.end) {
                                            player.seekTo(VideoTagData.currentTag.begin);
                                        }

                                        scope.$apply(function() {
                                            PlayerData.data.currentTime = newTime;
                                        });
                                    }, 200); // 100 means repeat in 100 ms
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
