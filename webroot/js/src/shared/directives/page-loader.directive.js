angular.module('shared')
        .directive('pageLoader', function(SharedData) {
            return {
                restrict: 'A',
                templateUrl: 'js/src/shared/directives/page-loader.html',
                scope: {
                    isLoading: '&isLoading'
                },
                link: function(scope, elm) {
                    scope.$watch(scope.isLoading, function(v) {
                        if (v) {
                            elm.show();
                        } else {
                            elm.hide();
                        }
                    });
                }
            };

        });
