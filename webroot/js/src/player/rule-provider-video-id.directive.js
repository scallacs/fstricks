angular.module('app.player')
        .directive('ruleProviderVideoId', ['$q', 'ProviderVideoInfo', function($q, ProviderVideoInfo) {
            return {
                require: 'ngModel',
                link: function(scope, elm, attrs, ngModel) {
                    ngModel.$asyncValidators.ruleProviderVideoId = function(videoId) {
                        if (ngModel.$isEmpty(videoId)) {
                            return $q.when();
                        }
                        var def = $q.defer();
//                        try {
                            var providerInfo = ProviderVideoInfo.get(attrs.provider);
                            
                            if (providerInfo.extractIdFromUrl(videoId)) {
                                videoId = providerInfo.extractIdFromUrl(videoId);
                            }
                            if (videoId && videoId.length <= attrs.minLength) {
                                def.reject();
                                return def.promise;
                            }
                            var providerInfoInstance = providerInfo.create();
                            providerInfoInstance.addVideo(videoId)
                                    .load()
                                    .then(function() {
                                        providerInfoInstance.exists() ? def.resolve() : def.reject();
                                    })
                                    .catch(function() {
                                        def.reject();
                                    });
//                        } catch (ex) {
//                            console.log("Exception...");
//                            def.reject();
//                        }
                        return def.promise;
                    };
                }
            };
        }]);
