angular.module('app.layout')
        .directive('topnav', topnav);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function topnav() {
    return {
        templateUrl: 'js/src/layout/partials/topnav.html',
        controller: ['$scope', 'AuthenticationService', '$state', 'SportEntity', 'SharedData', 'VideoTagData', 'PlayerData', 
            function($scope, AuthenticationService, $state, SportEntity, SharedData, VideoTagData, PlayerData) {
            // create a message to display in our view
            $scope.currentSport = null;
            $scope.logout = logout;
            $scope.setCurrentSport = setCurrentSport;

            // -------------------------------------------------------------------------
            // Youtube player
            $scope.videoTagData = VideoTagData;
            $scope.playerData = PlayerData;

            // -------------------------------------------------------------------------

            init();


            function init() {
                SportEntity.index({}, loadSportCallback);
            }

            function loadSportCallback(response) {
                SharedData.sports = response;
                SharedData.categories = [];
                for (var i = 0; i < response.length; i++) {
                    var sport = response[i];
                    for (var j = 0; j < sport.categories.length; j++) {
                        var category = sport.categories[j];
                        SharedData.categories.push({
                            category_name: category.name,
                            category_id: category.id,
                            sport_name: sport.name,
                            sport_image: sport.image,
                            sport_id: sport.id
                        });
                    }
                }
                $scope.sports = SharedData.sports;
//                $scope.$watch('search.tag', function(newVal, oldVal) {
//                    if (newVal == oldVal) {
//                        return;
//                    }
//                    $state.go('videoplayer.tag', {tagId: newVal.id});
//                });
            }

            function logout() {
                AuthenticationService.logout();
                $state.go("login");
                $scope.isAuthed = AuthenticationService.isAuthed();
            }

            function setCurrentSport(sport) {
                $scope.currentSport = sport;
                SharedData.currentSport = sport;
            }
        }]
    };

}
