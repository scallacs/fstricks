angular.module('app.player')
    .directive('playlistItem', function() {
    return {
        restrict: 'EA',
        templateUrl: 'js/src/player/partials/playlist-item.html',
        scope: {
            playlist: '=',
            shortmode: '@'
        }
    };

});