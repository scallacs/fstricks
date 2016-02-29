angular.module('shared')
        .directive('showMore', ['$timeout', '$compile', function($timeout, $compile) {
                return {
                    restrict: 'A',
                    link: function(scope, elem, attr) {
                        scope.show = false;
                        scope.showMore = function() {
                            scope.show = true;
                        };

                        scope.hideMore = function() {
                            scope.show = false;
                        };
                        
                        var maxLength = parseInt(attr.maxLength);

                        $timeout(function() {

                            var text = elem.text();
                            if (!angular.isDefined(attr.maxLength)) {
                                attr.maxLength = 200;
                            }
                            if (text.length > attr.maxLength) {
                                var hiddenText = text.substr(maxLength + 1);
                                var visibleText = text.substr(0, maxLength);
                                var content = visibleText + '\
                                <a href="#" ng-show="!show" ng-click="showMore()"> show more</a>\n\
                                <span ng-show="show">' + hiddenText + '</span>\n\
                                <a href="#" ng-show="show" ng-click="hideMore()"> hide </a>';
                                elem.html($compile('<div>' + content + '<div>')(scope));
                            }

                        });
                    }
                };
            }]);