angular.module('app.player')
    .directive('playlistItem', function() {
    return {
        restrict: 'EA',
        templateUrl: __PathConfig__.template + '/player/partials/playlist-item.html',
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
        }],
        link: function (scope){
            //console.log(scope);
            scope.showPoints = !scope.shortmode 
                && (scope.playlist && scope.playlist.status === 'public') && scope.points;
        }
    };

}); 