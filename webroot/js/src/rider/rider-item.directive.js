angular
        .module('app.rider')
        .directive('riderItem', function() {
            return {
                restrict: 'EA',
                templateUrl: 'rider-item.html',
                scope: {
                    rider: '=rider'
                },
                link: function(scope, element) {

                }
            };
        });

