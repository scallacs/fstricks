angular.module('app.player')
    .directive('videoItem', function() {
    return {
        restrict: 'EA',
        templateUrl: 'js/src/player/partials/video-item.html',
        scope: {
            video: '=',
            id: '='
        },
        link: function(scope, element) {
        }
    };

});