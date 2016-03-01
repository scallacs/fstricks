angular.module('app.player')
    .directive('playlistItem', function() {
    return {
        restrict: 'EA',
        templateUrl: TEMPLATE_URL + '/player/partials/playlist-item.html',
        scope: {
            playlist: '=',
            shortmode: '@',
            points: '@'
        },
        controller: ['$scope', function($scope){
            $scope.titleClick = titleClick;
            
            function titleClick(playlist){
                $scope.$emit('on-playlist-title-clicked', playlist);
            }
        }]
    };

});