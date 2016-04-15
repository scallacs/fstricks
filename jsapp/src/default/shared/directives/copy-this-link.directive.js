angular.module('shared')
        .directive('copyThisLink', ['$uibModal', function($uibModal) {
            return {
                restrict: 'A',
                link: function(scope, elem) {
                    elem.click(function(event) {
                        var href = elem.attr('base-url') + elem.attr('href');
                        $uibModal.open({
                            template: '<input select-all readonly class="form-control" value="' + href + '"/>'
                        });
                        event.preventDefault();
                        return false;
                    });
                }
            };
        }])
        .directive('selectAll', ['$timeout', function($timeout) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    element.on('click', function() {
                        this.setSelectionRange(0, this.value.length);
                    });
                    $timeout(function() {
                        element.click();
                    }, 100);
                }
            };
        }]);