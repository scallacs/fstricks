angular.module('app.admin.util', [])
        .directive('statusButtons', statusButtons);

function statusButtons(Restangular, $state, notification) {
    'use strict';

    return {
        restrict: 'E',
        scope: {
            status: "&",
            entry: "&",
            model: "@"
        },
        controller: ['$scope', function($scope){
            $scope.mapCssStatus = {
                validated: 'btn-success',
                accepted: 'btn-success',
                rejected: 'btn-danger',
                deleted: 'btn-danger',
                pending: 'btn-default'
            };
        }],
        link: function(scope, element, attrs) {
            scope.entry = scope.entry();
            scope.status = scope.status();
//            console.log(scope.model);
//            console.log(scope.status);
//            console.log(scope.entry);
            removeStatus(scope.entry.values.status);

            scope.computeCssClass = function (status){
                return scope.mapCssStatus[status];
            };

            scope.updateStatus = function(status) {
                Restangular
                        .setBaseUrl(ADMIN_API_BASE_URL)
                        .one(scope.model, scope.entry.values.id)
                        .get()
                        .then(function(entry) {
//                            console.log(entry);
                            entry.data.status = status;
                            return entry.data.put();
                        })
                        .then(function() {
                            scope.entry.values.status = status;
                            notification.log('Review ' + status, {addnCls: 'humane-flatty-success'});
                        })
                        .catch(function() {
                            notification.log('A problem occurred, please try again', {addnCls: 'humane-flatty-error'}) && console.error(e);
                        });
            }

            function removeStatus(status) {
                scope.choices = scope.status;
                scope.choices.splice(scope.choices.indexOf(status), 1);
            }
        },
        templateUrl: ADMIN_TEMPLATE_URL + 'utils/partials/status-buttons.html'
    };
}

statusButtons.$inject = ['Restangular', '$state', 'notification'];
