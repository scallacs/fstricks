angular.module('shared.form')
    .directive('servererror', function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ctrl) {
            element.on('change', function() {
                scope.$apply(function() {
                    ctrl.$setValidity('server', true);
                });
            });
        }
    }
});