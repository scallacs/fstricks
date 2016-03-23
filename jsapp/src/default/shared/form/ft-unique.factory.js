
angular.module('shared.form')
        .factory('DataExistsService', ['$resource', function($resource) {
            var url = API_BASE_URL + '/:controller/:action.json';

            return $resource(url, {controller: '@controller', action: '@action'}, {
                check: {
                    method: 'GET',
                    params: {action: 'view'},
                    isArray: false
                }
            });
        }])
        .directive('ftUnique', ['DataExistsService', function(DataExistsService) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, element, attrs, ngModel) {
                    element.bind('keyup', function(e) {
                        ngModel.$setValidity('unique', true);
                    });
                    element.bind('blur', function(e) {
                        if (!ngModel || !element.val())
                            return;
                        var keyProperty = scope.$eval(attrs.ftUnique);
                        var currentValue = element.val();
                        DataExistsService.check({
                            controller: keyProperty.controller,
                            action: keyProperty.action,
                            q: currentValue
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
        }]);