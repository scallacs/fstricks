angular.module('app.player')
        .directive('playerNav', playerNav);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function playerNav() {
    return {
        template: 'player-nav.html',
        controller: function($scope, PlayerData, VideoTagData) {
            $scope.toggleListTricks = toggleListTricks;
            $scope.nextTrick = nextTrick;
            $scope.prevTrick = prevTrick;

            function toggleListTricks() {
                PlayerData.showListTricks = !PlayerData.showListTricks;
            }

            function nextTrick() {
                if (VideoTagData.hasNext()) {
                    PlayerData.view(VideoTagData.next());
                }
            }
            function prevTrick() {
                if (VideoTagData.hasPrev()) {
                    PlayerData.view(VideoTagData.prev());
                }
            }
        },
        link: function(scope, elem, attr, form) {

        }
    };

}
