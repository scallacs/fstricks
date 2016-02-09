
angular.module('shared.form')
        .factory('DataExistsService', function($resource) {
            var url = WEBROOT_FULL + '/:controller/:action/:value.json';

            return $resource(url, {controller: '@controller', action: '@action', value: '@value'}, {
                check: {
                    method: 'GET',
                    params: {action: 'view'},
                    isArray: false
                }
            });
        })
        .directive('ftUnique', function(DataExistsService) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ngModel) {
                    element.bind('blur', function(e) {
                        if (!ngModel || !element.val())
                            return;
                        var keyProperty = scope.$eval(attrs.ftUnique);
                        var currentValue = element.val();
                        DataExistsService.check({
                            controller: keyProperty.controller,
                            action: keyProperty.action,
                            value: currentValue
                        }, function(response) {
                            console.log("Check exists response: " + response.exists);
                            if (currentValue == element.val()) {
                                //Ensure value that being checked hasn't changed
                                //since the Ajax call was made
                                ngModel.$setValidity('unique', !response.exists);
                            }
                            else {
                                ngModel.$setValidity('unique', true);
                            }
                        });
                    });
                }
            }
        });