angular.module('app.admin.util', [])
        .directive('statusButtons', statusButtons);

statusButtons.$inject = ['Restangular', '$state', 'notification'];
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
                var data = {status: status};
                Restangular
                        .setBaseUrl(__AdminAPIConfig__.baseUrl)
                        .one(scope.model, scope.entry.values.id)
                        .customPUT(data)
//                        .get()
//                        .then(function(entry) {
////                            console.log(entry);
//                            var id = scope.entry.values.id;
//                            return entry.data.put();
//                        })
                        .then(function() {
                            scope.entry.values.status = status;
                            notification.log('Changed status to ' + status, {addnCls: 'humane-flatty-success'});
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
        templateUrl: __AdminPathConfig__.template + 'utils/partials/status-buttons.html'
    };
}

