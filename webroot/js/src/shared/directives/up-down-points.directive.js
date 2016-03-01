angular.module('shared')
        .directive('upDownPoints', function() {
            return {
                restrict: 'A',
                templateUrl: TEMPLATE_URL + '/shared/directives/up-down-points.html',
                scope: {
                    data: '=',
                    controller: '@'
                },
                controller: ['$scope', 'UpDownPointEntity', function($scope, UpDownPointEntity) {
                        $scope.up = up;
                        $scope.down = down;
                        function up(controller, data) {
                            if (data.user_rate === 'up') {
                                return;
                            }
                            data.user_rate = 'loading';
                            UpDownPointEntity.up({id: data.id, controller: controller}, function(response) {
                                data.user_rate = 'up';
                                if (response.success) {
                                    data.count_points = data.count_points + 1;
                                }
                            });
                        }
                        function down(controller, data) {
                            if (data.user_rate === 'down') {
                                return;
                            }
                            data.user_rate = 'loading';
                            UpDownPointEntity.down({id: data.id, controller: controller}, function(response) {
                                data.user_rate = 'down';
                                if (response.success) {
                                    data.count_points = data.count_points - 1;
                                }
                            });
                        }
                    }]
            };
        });
