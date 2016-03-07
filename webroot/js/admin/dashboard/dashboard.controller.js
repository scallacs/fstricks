angular.module('app.admin')
        .controller('DashboardController', DashboardController);


DashboardController.$inject = ['$scope', 'AdminApiFactory', 'SharedData', 'toaster'];
function DashboardController($scope, AdminApiFactory, SharedData, toaster) {
    
    var api = AdminApiFactory.api();
    
}