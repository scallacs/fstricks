angular.module('app.admin')
        .directive('userItem', userItem);

function userItem() {
    return {
        restrict: 'EA',
        templateUrl: TEMPLATE_URL + '/../admin/users/partials/user-item.html',
        scope: {
            user: '=userItem',
        },
        link: function($scope, element, attr) {
            
        }
    };
}

