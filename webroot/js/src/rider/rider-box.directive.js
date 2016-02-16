angular
        .module('app.rider')
        .directive('riderBox', function() {
            return {
                restrict: 'EA',
                templateUrl:'js/src/rider/partials/rider-box.html',
                scope: {
                    rider: '=rider'
                },
                controller: function($scope, PlayerData){
                    $scope.playerData = PlayerData;
                }
            };
        });

