angular.module('shared')
        .directive('ngLoadingIcon', function() {

    return {
        restrict: "EA",
        replace: true,
        scope: {
            isLoading: '='
        },
        template: '<span class="ajax-loader" >\n\
                        <img src="' + WEBROOT_FULL + '/img/ajax_loader.gif" alt="Loading, please wait..."/>\n\
                    </span>',
        link: function(scope, element, attrs) {
            scope.$watch('isLoading', function(v) {
                if (v) {
                    element.show();
                } else {
                    element.hide();
                }
            });
        }
    };
});
