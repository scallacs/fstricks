angular.module('app.tag')
        .directive('trickList', trickList);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function trickList() {
    return {
        templateUrl: 'js/src/tag/partials/player-trick-list.html',
        controller: function($scope, PlayerData) {
            $scope.playerData = PlayerData;
        },
        link: function(scope, elem, attr, form) {

        }
    };

}
