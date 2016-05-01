angular
        .module('app.rider')
        .directive('riderBox', RiderBox);

function RiderBox() {
    return {
        restrict: 'EA',
        templateUrl: __PathConfig__.template + '/rider/partials/rider-box.html',
        scope: {
            rider: '=rider'
        },
        controller: ['$scope', 'PlayerData', 'VideoTagData', 'TopSearchMapper', function($scope, PlayerData, VideoTagData, TopSearchMapper) {
            $scope.playerData = PlayerData;
            $scope.addSearchFilter = addSearchFilter;
            
            $scope.showRiderVideos = function(rider){
                PlayerData.showTricksMenu(true);
            };
            
            function addSearchFilter(type, data){
                PlayerData.showTricksMenu(true);
                VideoTagData.addSearchFilter(TopSearchMapper(type, data), true);
            }
        }]
    };
};

