angular.module('shared.youtube')
    .directive('ruleYoutubeVideoId', function($q, YoutubeVideoInfo) {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {

            ctrl.$asyncValidators.youtubeVideoId = function(videoId, viewValue) {
                if (ctrl.$isEmpty(videoId)) {
                    // consider empty model valid
                    return $q.when();
                }
                var def = $q.defer();
                if (YoutubeVideoInfo.extractVideoIdFromUrl(videoId)) {
                    videoId = YoutubeVideoInfo.extractVideoIdFromUrl(videoId);
                }
                YoutubeVideoInfo.exists(videoId, function(exists) {
                    // Mock a delayed response
                    if (exists) {
                        scope.$emit('videoIdValidated', {videoId: videoId});
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
