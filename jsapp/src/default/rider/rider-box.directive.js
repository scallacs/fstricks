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
        controller: ['$scope', 'PlayerData', function($scope, PlayerData) {
            $scope.playerData = PlayerData;
        }]
    };
};

