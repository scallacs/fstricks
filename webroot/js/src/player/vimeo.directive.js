(function(window, angular) {
    'use strict';
    angular.module('app.player')
            .factory('VimeoCmdMapper', function() {

                var factory = {
                    params: {
                        url: null,
                        callback: 'JSON_CALLBACK',
                        player_id: 'vimeoplayer',
                        width: '100%',
                        api: 1
                    }
                };

                factory.create = function(player) {
                    return new VimeoCmdMapper(player);
                };

                factory.onVideoChanged = function() {
                };

                function VimeoCmdMapper(player) {
                    console.log("Setting cmd mapper with video player: ");
                    console.log(player);
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
                    return this._player.api.getCurrentTime();
                }
                function loadVideo(data) {
                    factory.onVideoChanged(data.video_url);
                }
                function play() {
                    this._player.api('play');
                }
                function stop() {
                    this._player.api('stop');
                }
                function pause() {
                    console.log(this._player.api);
                    this._player.api('pause');
                }

                return factory;

            })
            .directive('vimeoVideo', vimeoVideoDirective)
            .factory('VimeoService', VimeoService);

    vimeoVideoDirective.$inject = ['VimeoService', 'VimeoCmdMapper'];
    function vimeoVideoDirective(VimeoService, VimeoCmdMapper) {
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

                var url = PlayerData.data.video_url ? PlayerData.data.video_url : null;
                PlayerData.setPlayer('vimeo', VimeoCmdMapper.create(null));

                VimeoCmdMapper.onVideoChanged = function(videoUrl) {
                    PlayerData.resetPlayer('vimeo');

                    VimeoCmdMapper.params.url = 'https://vimeo.com/' + videoUrl;

                    VimeoService.oEmbed(VimeoCmdMapper.params).then(function(data) {
                        element.html(data.html);
                    }).catch(function(error) {
                        PlayerData.errorPlayer('vimeo', error);
                    });


                    var iframe = $('#' + playerId)[0];
                    var player = $f(iframe);
                    // When the player is ready, add listeners for pause, finish, and playProgress
                    player.addEvent('ready', function() {
//                        alert('vimeo is ready');
                        PlayerData.setPlayer('vimeo', VimeoCmdMapper.create(player));
                        player.addEvent('playProgress', PlayerData.onPlayProgress);
                    });

                };


                if (url !== null) {
                    VimeoCmdMapper.onVideoChanged(VimeoCmdMapper.params);
                }

//                function onPause(id) {
//                    console.log('paused');
//                }
//
//                function onFinish(id) {
//                    console.log('finished');
//                }
//
//                function onPlayProgress(data, id) {
//                    console.log(data.seconds + 's played');
//                }

            }
        };
    }

    VimeoService.$inject = ['$http'];
    function VimeoService($http) {
        var endpoint = 'https://vimeo.com/api/oembed.json';

        return {
            oEmbed: function(params) {
                return $http.jsonp(endpoint, {params: params})
                        .then(function(res) {
                            return res.data;
                        });
            }
        };
    }

})(window, window.angular);
