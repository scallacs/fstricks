angular.module('shared.vimeo')
        .directive('ruleVimeoVideoId', function($q, VimeoInfo) {
            return {
                require: 'ngModel',
                link: function(scope, elm, attrs, ngModel) {
                    ngModel.$asyncValidators.vimeoVideoId = function(videoId, viewValue) {
                        if (ngModel.$isEmpty(videoId)) {
                            // consider empty model valid
                            return $q.when();
                        }
                        var def = $q.defer();

                        var vimeoInfo = new VimeoInfo();

                        vimeoInfo.addVideo(videoId)
                                .load()
                                .catch(function() {
                                    def.reject();
                                }).then(function(data) {
                                    console.log(data);
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
