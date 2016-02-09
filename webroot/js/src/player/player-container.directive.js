angular.module('app.player')
        .directive('playerContainer', playerContainer);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function playerContainer() {
    return {
        templateUrl: 'js/src/player/partials/player-container.html',
        controller: function($scope, PlayerData, VideoTagData) {
            $scope.playerData = PlayerData;
            $scope.videoTagData = VideoTagData;
        },
        link: function(scope, elem, attr, form) {

        }
    };

}
