angular.module('shared.youtube')
        .constant('YoutubeIdLength', 11)
        .directive('ruleYoutubeVideoId', function($q, YoutubeVideoInfo, YoutubeIdLength) {
            return {
                require: 'ngModel',
                link: function(scope, elm, attrs, ngModel) {

                    ngModel.$asyncValidators.youtubeVideoId = function(videoId, viewValue) {
                        if (ngModel.$isEmpty(videoId)) {
                            // consider empty model valid
                            return $q.when();
                        }
                        var def = $q.defer();
                        if (YoutubeVideoInfo.extractVideoIdFromUrl(videoId)) {
                            videoId = YoutubeVideoInfo.extractVideoIdFromUrl(videoId);
                        }
                        if (videoId.length !== YoutubeIdLength) {
                            return def.reject();
                        }

                        YoutubeVideoInfo.exists(videoId, function(exists) {
                            if (exists) {
//                                scope.$emit('videoIdValidated', {videoId: videoId});
                                def.resolve();
                            } else {
                                def.reject();
                            }
                        });
                        return def.promise;
                    };
                }
            };
        });
