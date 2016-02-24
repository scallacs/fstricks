angular.module('app.account')
        .directive('formLogin', formLoginDirective);

function formLoginDirective() {
    return {
        templateUrl: 'js/src/account/partials/form-login.html',
        controller: ['$scope', '$auth', 'AuthenticationService', function($scope, $auth, AuthenticationService) {
            $scope.authenticate = authenticate;
            $scope.login = login;

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
        }]
    };

}
