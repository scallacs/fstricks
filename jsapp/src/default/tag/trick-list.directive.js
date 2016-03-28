angular.module('app.tag')
        .directive('trickList', trickList);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function trickList() {
    return {
        templateUrl: TEMPLATE_URL + '/tag/partials/player-trick-list.html',
        controller: ['$scope', 'PlayerData', 'SharedData', function($scope, PlayerData, SharedData) {
            $scope.playerData = PlayerData;
            $scope.setCategory = setCategory;
            
            function setCategory(c){
                console.log("Setting category: " + c);
                SharedData.setCurrentCategory(c);
                $scope.$emit('on-category-changed', c);
            }
        }]
    };

}
