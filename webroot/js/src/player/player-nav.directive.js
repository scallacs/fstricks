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
                    var tag = VideoTagData.next();
                    if (tag !== null) {
                        $scope.$emit('view-video-tag', tag);
                        PlayerData.view(tag);
                    }
                }
            }
            function prevTrick() {
                if (VideoTagData.hasPrev()) {
                    console.log("Prev trick");
                    var tag = VideoTagData.prev();
                    if (tag !== null) {
                        $scope.$emit('view-video-tag', tag);
                        PlayerData.view(tag);
                    }
                }
            }
        },
        link: function(scope, elem, attr, form) {

        }
    };

}
