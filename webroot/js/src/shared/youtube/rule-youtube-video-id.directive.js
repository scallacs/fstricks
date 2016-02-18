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

                        var youtubeInfo = new YoutubeVideoInfo();

                        if (youtubeInfo.extractVideoIdFromUrl(videoId)) {
                            videoId = youtubeInfo.extractVideoIdFromUrl(videoId);
                        }
                        if (videoId.length !== YoutubeIdLength) {
                            return def.reject();
                        }

                        youtubeInfo.addVideo(videoId).addPart('id')
                                .load()
                                .catch(function() {
                                    def.reject();
                                }).then(function(data) {
                            if (angular.isDefined(data) && data.items.length > 0) {
                                def.resolve();
                            }
                            else {
                                def.reject();
                            }
                        });

                        return def.promise;
                    };
                }
            };
        });
