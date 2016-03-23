(function(window, angular) {
    'use strict';
    angular.module('app.player')
            .factory('VimeoCmdMapper', ['$q', function($q) {

                    var factory = {
                        params: {
                            url: null,
                            callback: 'JSON_CALLBACK',
                        }
                    };

                    factory.create = function(player, iframe) {
                        return new VimeoCmdMapper(player, iframe);
                    };
                    factory.computeUrl = function(videoId, playerId) {
                        return 'http://player.vimeo.com/video/' + videoId + '?api=1&amp;player_id=' + playerId + '&amp;callback=JSON_CALLBACK';
                    };

                    function VimeoCmdMapper(player, iframe) {
                        console.log("Setting cmd mapper with video player");
                        this._player = player;
                        this._iframe = iframe;
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
                        var self = this;
                        return $q(function(resolve, reject) {
                            self._player.api('getCurrentTime', function(value) {
                                return resolve(value);
                            });
                        });
                    }
                    function loadVideo(data) {
                        var self = this;
                        console.log('VimeoCmdMapper::loadVideo');
                        this._iframe.attr('src', factory.computeUrl(data.video_url, this._iframe.attr('id')));
                        this._iframe.load(function() {
                            self.seekTo(angular.isDefined(data.begin) ? data.begin : 0);
                            self.play();
                        });
                    }
                    function play() {
                        this._player.api('play');
                    }
                    function stop() {
                        console.log('VimeoCmdMapper::stop()');
                        this._player.api('pause');
                    }
                    function pause() {
                        console.log('VimeoCmdMapper::pause()');
                        this._player.api('pause');
                    }

                    return factory;

                }])
            .directive('vimeoVideo', vimeoVideoDirective);
//            .factory('VimeoService', VimeoService);

    vimeoVideoDirective.$inject = ['VimeoCmdMapper'];
    function vimeoVideoDirective(VimeoCmdMapper) {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                playerData: '='
            },
            link: function(scope, element, attrs, ctrl) {
                var playerId = attrs.playerId || element[0].id;
                element[0].id = playerId + 'Container';
                var PlayerData = scope.playerData;

                element.on('$destroy', function() {
                    PlayerData.resetPlayer('vimeo');
                });

                scope.$watch('playerData.data.video_url', function(newVal) {
                    if ($('#' + playerId).length === 0 && newVal !== null) {
                        loadPlayer(newVal);
                    }
                });

                function loadPlayer(videoUrl) {
                    console.log('LOAD VIMEO PLAYER');
                    var html = '<iframe \n\
                            src="' + VimeoCmdMapper.computeUrl(videoUrl, playerId) + '" \n\
                            id="' + playerId + '" width="100%" height="100%" frameborder="0"></iframe>';
                    element.html(html);
                    var iframe = $('#' + playerId);
                    var player = $f(iframe[0]);
                    // When the player is ready, add listeners for pause, finish, and playProgress

                    player.addEvent('ready', function(playerId) {
                        var player = $f(playerId);
                        console.log('VIMEO PLAYER: ready');
                        PlayerData.setPlayer('vimeo', VimeoCmdMapper.create(player, iframe));
                        player.addEvent('playProgress', function(data) {
                            scope.$apply(function() {
                                PlayerData.onPlayProgress(data.seconds);
                            });
                        });
                        player.addEvent('pause', PlayerData.onPause);
                        player.addEvent('play', PlayerData.onPlay);
                        player.addEvent('finished', PlayerData.onFinish);
                    });

                }
            }
        };
    }
//
//    VimeoService.$inject = ['$http'];
//    function VimeoService($http) {
//        var endpoint = 'https://vimeo.com/api/oembed.json';
//
//        return {
//            oEmbed: function(params) {
//                return $http.jsonp(endpoint, {params: params})
//                        .then(function(res) {
//                            return res.data;
//                        });
//            }
//        };
//    }

})(window, window.angular);
