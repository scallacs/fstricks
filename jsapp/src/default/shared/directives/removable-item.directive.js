/**
 * Options:
 *  - confirm: true to show a confirm dialog befofore continuing
 *  - waitResponse: true if we want to wait request result before deleting this item
 *  - trigger: 
 */
angular.module('shared')
        .directive('removableItem', removableItem);

removableItem.$inject = ['$uibModal', 'toaster'];
function removableItem($uibModal, toaster) {

    return {
        restrict: 'A',
        scope: {
            removableItemOptions: '=',
            removableItemId: '='
        },
        link: function(scope, elem, attrs) {
            var options = scope.removableItemOptions;
            var btn = $(elem).find(options.trigger);
            if (btn.length > 0) {
                btn.click(function(event) {
                    if (options.confirm) {
                        var instance = showModal();
                        instance.result.then(function() {
                            removeItem();
                        });
                    }
                    else {
                        removeItem();
                    }
                    event.preventDefault();
                    return false;
                });
            }

            function showModal() {
                var instance = $uibModal.open({
                    templateUrl: __PathConfig__.template + '/shared/directives/confirm-dialog.html',
                    controller: 'ModalInstanceCtrl'
                });
                return instance;
            }

            function removeItem() {
                var data = scope.removableItemId;
                var promise = options.endpoint(data).$promise;

                if (options.wait) {
                    promise.then(function(result) {
                        elem.html('');
                        toaster.pop(result.success ? 'success' : 'error', result.message);
                    });
                }
                else {
                    elem.html('');
                    toaster.pop('success', 'Removed!');
                }
            }

        },
    };
}
