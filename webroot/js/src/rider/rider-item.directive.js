angular
        .module('app.rider')
        .directive('riderItem', function() {
            return {
                restrict: 'EA',
                templateUrl:'js/src/rider/partials/rider-item.html',
                scope: {
                    rider: '=rider'
                },
                link: function(scope, element) {

                }
            };
        });
