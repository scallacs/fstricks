angular.module('app.layout')
        .directive('topnav', topnav);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function topnav() {
    return {
        templateUrl: 'js/src/layout/topnav.html',
        controller: function($scope, AuthenticationService,
                $state, SportEntity, SharedData, TagEntity, VideoTagData, PlayerData) {
            // create a message to display in our view
            $scope.searchTags = [];
            $scope.search = {tag: null};
            $scope.currentSport = null;
            $scope.isViewLoading = true;
            $scope.refreshSearchedTags = refreshSearchedTags;
            $scope.logout = logout;
            $scope.setCurrentSport = setCurrentSport;

            $scope.showVideoPlayer = false;

            $scope.getCurrentPlayerTime = function() {
                return 0;
            };

            // -------------------------------------------------------------------------
            // Youtube player
            $scope.videoTagData = VideoTagData;
            $scope.playerData = PlayerData;

            // -------------------------------------------------------------------------

            init();


            function init() {
                $scope.$on('onYouTubePlayerReady', function(event, player) {
                    $scope.getCurrentPlayerTime = function() {
                        return player.getCurrentTime();
                    };
                });
                $scope.$on('showVideoPlayer', function(newVal) {
                    if (newVal === false) {
                        PlayerData.showViewMode();
                    }
                });
                PlayerData.showViewMode();

                SportEntity.index({}, loadSportCallback);
            }

            function loadSportCallback(response) {
               console.log(response);
               
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
                $scope.$watch('search.tag', function(newVal, oldVal) {
//            console.log(newVal);
                    if (newVal == oldVal) {
                        return;
                    }
                    $state.go('videoplayer.tag', {tagId:newVal.id});
                });
            }

          
            function logout() {
                AuthenticationService.logout();
                $state.go("login");
                $scope.isAuthed = AuthenticationService.isAuthed();
            }
            /**
             * Header search bar function
             * @param {type} trick
             * @returns {undefined}
             */
            function refreshSearchedTags(trick) {
                if (trick.length >= 2) {
                    TagEntity.suggest({
                        id: trick,
//                category_id: category.category_id,
//                sport_id: category.sport_id
                    }, function(results) {
                        $scope.searchTags = results;
                    });
                }
            }

            function setCurrentSport(sport) {
                $scope.currentSport = sport;
                SharedData.currentSport = sport;
            }
        },
        link: function(scope, elem, attr, form) {

        }
    };

}