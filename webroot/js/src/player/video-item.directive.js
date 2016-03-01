angular.module('app.player')
    .directive('videoItem', function() {
    return {
        restrict: 'EA',
        templateUrl: TEMPLATE_URL + '/player/partials/video-item.html',
        scope: {
            video: '=',
            id: '='
        }
    };

});