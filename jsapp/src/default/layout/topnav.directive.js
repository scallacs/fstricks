angular.module('app.layout')
        .directive('topnav', topnav);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function topnav() {
    return {
        templateUrl: __PathConfig__.template + '/layout/partials/topnav.html',
        controller: ['$scope', 'AuthenticationService', '$state', 'SharedData', 'VideoTagData', 'PlayerData', 'PaginateDataLoader',
            function($scope, AuthenticationService, $state, SharedData, VideoTagData, PlayerData, PaginateDataLoader) {
                // create a message to display in our view
                $scope.logout = logout;

                // -------------------------------------------------------------------------
                // Youtube player
                $scope.videoTagData = VideoTagData;
                $scope.playerData = PlayerData;
                $scope.SharedData = SharedData;

                // -------------------------------------------------------------------------

                //init();
                SharedData.onReady().then(function() {
                    $scope.sports = SharedData.sports;
                });

                function logout() {
                    AuthenticationService.logout();
                    PaginateDataLoader.clear();
                    $state.go("login");
                    $scope.isAuthed = AuthenticationService.isAuthed();
                }

            }]
    };

}
