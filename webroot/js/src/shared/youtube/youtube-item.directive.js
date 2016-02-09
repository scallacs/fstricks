angular.module('shared.youtube')
    .directive('youtubeItem', function() {
    return {
        restrict: 'EA',
        templateUrl: 'js/src/shared/youtube/youtube-item.html',
        scope: {
            info: '=',
            id: '='
        },
        link: function(scope, element) {
            scope.url = scope.info.id;
            scope.thumbnail = scope.info.snippet.thumbnails.default.url;
            scope.title = scope.info.snippet.title;
            scope.description = scope.info.snippet.description;
            scope.published = scope.info.snippet.publishedAt;
            scope.provider_name = 'youtube';
        }
    };

});