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
        controller: ['$scope', 'PlayerData', 'VideoTagData', function($scope, PlayerData, VideoTagData) {
            $scope.playerData = PlayerData;
            
            $scope.showRiderVideos = function(rider){
                PlayerData.showTricksMenu(true);
            };
        }]
    };
};

