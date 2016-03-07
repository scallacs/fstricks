angular.module('app.layout')
        .directive('topnav', topnav);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function topnav() {
    return {
        templateUrl: TEMPLATE_URL + '/layout/partials/topnav.html',
        controller: ['$scope', 'AuthenticationService', '$state', 'SharedData', 'VideoTagData', 'PlayerData',
            function($scope, AuthenticationService, $state, SharedData, VideoTagData, PlayerData) {
                // create a message to display in our view
                $scope.currentSport = null;
                $scope.logout = logout;
                $scope.setCurrentSport = setCurrentSport;

                // -------------------------------------------------------------------------
                // Youtube player
                $scope.videoTagData = VideoTagData;
                $scope.playerData = PlayerData;

                // -------------------------------------------------------------------------

                //init();
                SharedData.onReady(function() {
                    $scope.sports = SharedData.sports;
                });

                function logout() {
                    AuthenticationService.logout();
                    $state.go("login");
                    $scope.isAuthed = AuthenticationService.isAuthed();
                }

                function setCurrentSport(sport) {
                    console.log('Setting current sport: ' + sport.name);
                    $scope.currentSport = sport;
                    SharedData.currentSport = sport;
                }
            }]
    };

}
