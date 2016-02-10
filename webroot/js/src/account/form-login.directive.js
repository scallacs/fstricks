angular.module('app.account')
        .directive('formLogin', fomLoginDirective);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function fomLoginDirective() {
    return {
        templateUrl: 'js/src/account/partials/form-login.html',
        controller: function($scope, $auth, messageCenterService, AuthenticationService) {
            $scope.authenticate = authenticate;
            $scope.login = login;
            messageCenterService.removeShown();

            function authenticate(provider) {
                var promise = $auth.authenticate(provider, {provider: provider});
                promise.then(successCallback);

                function successCallback(response) {
                    response = response.data;
                    if (response.success) {
                        response.data.provider = provider;
                        AuthenticationService.setCredentials(response.data);
                        $scope.$emit("user-login-success");
                    }
                }
            }


            function login(data) {
                var promise = AuthenticationService.login(data.email, data.password);
                $scope.loginForm.submit(promise).then(callback);

                function callback(response) {
                    if (response.success) {
                        $scope.$emit("user-login-success");
                    }
                }
            }
        }
    };

}
