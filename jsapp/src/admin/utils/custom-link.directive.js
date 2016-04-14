angular.module('app.admin')
        .directive('customLink', CustomLinkDirective);

CustomLinkDirective.$inject = ['$location'];
function CustomLinkDirective($location){
    return {
        restrict: 'E',
        scope: { entry: '&', text: '@', url: '@' },
        link: function (scope) {
            scope.send = function () {
                $location.path(scope.url + '/' + scope.entry().values.id);
            };
        },
        template: '<a class="btn btn-xs btn-default" ng-click="send()">{{text}}</a>'
    };
}

