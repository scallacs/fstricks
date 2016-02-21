angular.module('app.player')
        .factory('ProviderVideoInfo', function($http, YoutubeVideoInfo, VimeoInfo) {
            return {
                get: function(provider) {
                    if (provider === 'youtube') {
                        return YoutubeVideoInfo;
                    }
                    else if (provider === 'vimeo') {
                        return VimeoInfo;
                    }
                    else {
                        console.log("Unknown provider: " + provider);
                        throw "Unknown provider: " + provider;
                    }
                }
            };
        });