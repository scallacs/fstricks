angular.module('app.player')
    .directive('videoItem', function() {
    return {
        restrict: 'EA',
        templateUrl: __PathConfig__.template + '/player/partials/video-item.html',
        scope: {
            video: '=',
            id: '='
        }
    };

});