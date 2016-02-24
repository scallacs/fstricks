angular.module('shared')
        .directive('copyThisLink', function($uibModal) {
            return {
                restrict: 'A',
                link: function(scope, elem) {
                    elem.click(function(event) {
                        var href = WEBROOT_FULL + elem.attr('href');
                        $uibModal.open({
                            template: '<input select-all readonly class="form-control" value="' + href + '"/>'
                        });
                        event.preventDefault();
                        return false;
                    });
                }
            };
        })
        .directive('selectAll', function($timeout) {
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
        });