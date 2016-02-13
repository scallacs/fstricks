angular.module('app.player')
        .directive('playerNav', playerNav);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function playerNav() {
    return {
        templateUrl: 'js/src/player/partials/player-nav.html',
        controller: function($scope, PlayerData, VideoTagData) {
            $scope.toggleListTricks = toggleListTricks;
            $scope.nextTrick = nextTrick;
            $scope.prevTrick = prevTrick;
            
            $scope.playerData = PlayerData;
            $scope.videoTagData = VideoTagData;

            function toggleListTricks() {
                PlayerData.showListTricks = !PlayerData.showListTricks;
            }

            function nextTrick() {
                if (VideoTagData.hasNext()) {
                    console.log("Next trick");
                    PlayerData.view(VideoTagData.next());
                }
            }
            function prevTrick() {
                if (VideoTagData.hasPrev()) {
                    console.log("Prev trick");
                    PlayerData.view(VideoTagData.prev());
                }
            }
        },
        link: function(scope, elem, attr, form) {

        }
    };

}
