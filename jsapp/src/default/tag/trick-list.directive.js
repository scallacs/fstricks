angular.module('app.tag')
        .directive('trickList', trickList);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function trickList() {
    return {
        templateUrl: __PathConfig__.template + '/tag/partials/player-trick-list.html',
        controller: ['$scope', 'PlayerData', 'SharedData', 'VideoTagData', '$state', function ($scope, PlayerData, SharedData, VideoTagData, $state) {
                $scope.playerData = PlayerData;
                $scope.setCategory = setCategory;
                $scope.toggleAppendFilters = toggleAppendFilters;
                $scope.showCategories = showCategories;
                function setCategory(c) {
                    console.log("Setting category: " + c);
                    SharedData.setCurrentCategory(c);
                    $scope.$emit('on-category-changed', c);
                }

                function toggleAppendFilters() {
                    VideoTagData.appendFilters = !VideoTagData.appendFilters;
                    VideoTagData.focusSearchBar();
                }
                
                function showCategories() {
                    return $state.current.name === 'videoplayer.sport' 
                            && SharedData.currentSport && SharedData.currentSport.categories.length > 1;
                }

            }]
    };

}
