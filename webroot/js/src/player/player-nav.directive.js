angular.module('app.player')
        .directive('playerNav', playerNav);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function playerNav() {
    return {
        templateUrl: 'js/src/player/partials/player-nav.html',
        controller: ['$scope', 'PlayerData', 'VideoTagData', function($scope, PlayerData, VideoTagData) {
            $scope.toggleListTricks = toggleListTricks;
            $scope.playerData = PlayerData;
            $scope.videoTagData = VideoTagData;
            $scope.togglePlayerMode = togglePlayerMode;

            function togglePlayerMode(){
                if (PlayerData.looping){
                    PlayerData.stopLooping();
                }
                else{
                    PlayerData.startLooping();
                }
            }
            
            function toggleListTricks() {
                PlayerData.showListTricks = !PlayerData.showListTricks;
            }
        }]
    };

}
