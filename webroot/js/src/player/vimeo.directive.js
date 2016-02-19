(function(window, angular) {
    'use strict';
    angular.module('app.player')
            .factory('VimeoCmdMapper', function() {
                function VimeoCmdMapper(player) {
                    this._player = player;
                }
                VimeoCmdMapper.prototype = {
                    seekTo: seekTo,
                    getCurrentTime: getCurrentTime,
                    loadVideo: loadVideo,
                    play: play,
                    stop: stop,
                    pause: pause
                };

                function seekTo(seconds) {
                    this._player.api('seekTo', seconds);
                }
                function getCurrentTime() {
                    this._player.api.getCurrentTime();
                }
                function loadVideo(data) {

                }
                function play() {
                    this._player.api('play');
                }
                function stop() {
                    this._player.api('stop');
                }
                function pause() {
                    this._player.api('pause');
                }
                
                return {
                    create: function(player){
                        return new VimeoCmdMapper(player);
                    }
                }
            })
            .directive('vimeoVideo', function(VimeoService, VimeoCmdMapper) {
                return {
                    restrict: 'EA',
                    replace: true,
                    scope: {
                        playerData: '='
                    },
                    link: function(scope, element, attrs, ctrl) {
                        var playerId = attrs.playerId || element[0].id;
                        element[0].id = playerId;

                        var PlayerData = scope.playerData;
                        var url = PlayerData.data.video_url ?
                                'https://vimeo.com/' + PlayerData.data.video_url : PlayerData.data.video_url;

                        var params = {
                            url: url,
                            callback: 'JSON_CALLBACK',
                            player_id: playerId,
                            width: '100%',
                            api: 1
                        };

                        VimeoService.oEmbed(params).then(function(data) {
                            element.html(data.html);
                        }, function(error) {
                            PlayerData.errorPlayer('vimeo', error);
                        });


                        var iframe = $('#' + playerId)[0];
                        var player = $f(iframe);
                        // When the player is ready, add listeners for pause, finish, and playProgress
                        player.addEvent('ready', function() {
                            PlayerData.setPlayer('vimeo', VimeoCmdMapper.create(player));
                            player.addEvent('playProgress', PlayerData.onPlayProgress);
                        });

                        function onPause(id) {
                            console.log('paused');
                        }

                        function onFinish(id) {
                            console.log('finished');
                        }

                        function onPlayProgress(data, id) {
                            console.log(data.seconds + 's played');
                        }

                    },
                    controller: function() {
                    }
                };
            })

            .factory('VimeoService', function($http) {
                var endpoint = 'https://www.vimeo.com/api/oembed.json';

                return {
                    oEmbed: function(params) {
                        return $http.jsonp(endpoint, {params: params}).then(function(res) {
                            return res.data;
                        });
                    }
                };
            });
})(window, window.angular);
