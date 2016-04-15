angular.module('app.account')
        .directive('formChangePassword', formChangePasswordDirective);

formChangePasswordDirective.$inject = ['UserEntity'];
function formChangePasswordDirective(UserEntity) {
    return {
        templateUrl: __PathConfig__.template + '/account/partials/form-change-password.html',
        link: function(scope, element, attrs) {
            scope.changePassword = changePassword;
            scope.hasToken = angular.isDefined(attrs.token);

            function changePassword(data) {
                if (scope.hasToken) {
                    data.token = attrs.token;
                    var promise = UserEntity.resetPassword(data).$promise;
                }
                else {
                    var promise = UserEntity.changePassword(data).$promise;
                }
                scope.changePasswordForm
                        .submit(promise)
                        .then(function(response) {
                            if (response.success) {
                                scope.user = {};
                                scope.changePasswordForm.$setPristine();
                                scope.$emit("change-password-success");
                            }
                        });
            }
        }
    };

}
