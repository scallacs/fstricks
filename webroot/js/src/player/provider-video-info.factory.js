angular.module('app.player')
        .factory('ProviderVideoInfo', ['YoutubeVideoInfo', 'VimeoInfo', function(YoutubeVideoInfo, VimeoInfo) {
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
        }]);