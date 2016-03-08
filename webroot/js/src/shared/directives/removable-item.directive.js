/**
 * Options:
 *  - confirm: true to show a confirm dialog befofore continuing
 *  - waitResponse: true if we want to wait request result before deleting this item
 *  - trigger: 
 */

angular.module('shared')
        .factory('RemoveItemEntity', RemoveItemEntity)
        .directive('removableItem', removableItem);


RemoveItemEntity.$inject = ['$resource'];
function RemoveItemEntity($resource) {
    var url = API_BASE_URL + '/:controller/delete/:id.json';
    return $resource(url, {id: '@id', controller: '@controller'}, {
        delete: {
            isArray: false,
            method: 'POST'
        }
    });
}


removableItem.$inject = ['$uibModal', 'RemoveItemEntity', 'toaster'];
function removableItem($uibModal, RemoveItemEntity, toaster) {

    return {
        restrict: 'A',
        scope: {
            removableItemOptions: '=',
            removableItemId: '@'
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
                    templateUrl: TEMPLATE_URL + '/shared/directives/confirm-dialog.html',
                    controller: 'ModalInstanceCtrl'
                });
                return instance;
            }

            function removeItem() {
                if (angular.isObject(scope.removableItemId)) {
                    var data = scope.removableItemId;
                }
                else {
                    var data = {id: scope.removableItemId};
                }
                console.log("Removing item");
                // Wait for server response
                data.controller = options.controller;
                var promise = RemoveItemEntity['delete'](data)
                        .$promise;

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
