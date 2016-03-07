angular.module('app.admin')
        .controller('UsersController', UsersController)
        .controller('UserIndexController', UserIndexController);

function UsersController() {

}

UserIndexController.$inject = ['$scope', 'AdminApiFactory', 'SharedData', 'toaster', 'PaginateDataLoader'];
function UserIndexController($scope, AdminApiFactory, SharedData, toaster, PaginateDataLoader) {
    $scope.removeOptions = {trigger: '.btn-remove-item', controller: 'Users', confirm: true, wait: false};

    $scope.users = [];

    var dataLoader = PaginateDataLoader.create(AdminApiFactory.endpoint('Users', 'index').get);
    dataLoader
            .startLoading()
            .then(function(results) {
                $scope.users = results.items;
                SharedData.pageLoader(false);
            });

}