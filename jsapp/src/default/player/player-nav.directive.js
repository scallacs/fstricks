angular.module('app.player')
        .directive('playerNav', playerNav);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function playerNav() {
    return {
        templateUrl: __PathConfig__.template + '/player/partials/player-nav.html',
        controller: ['$scope', 'PlayerData', 'VideoTagData', function($scope, PlayerData, VideoTagData) {
            $scope.toggleListTricks = toggleListTricks;
            $scope.playerData = PlayerData;
            $scope.videoTagData = VideoTagData;

            function toggleListTricks() {
                PlayerData.showListTricks = !PlayerData.showListTricks;
            }
        }]
    };

}
