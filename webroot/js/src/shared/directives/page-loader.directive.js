angular.module('shared')
.directive('pageLoader', function(SharedData) {
    return {
        restrict: 'A',
        templateUrl: 'js/src/shared/directives/page-loader.html',
        link: function(scope, elm) {
            scope.isLoading = function() {
                return SharedData.loadingState;
            };
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
