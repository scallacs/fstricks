angular.module('app.account', [
    'ngResource',
    'ui.router',
    'ngMessages',
    'satellizer',
    'MessageCenterModule',
    'app.config',
    'app.core',
    'shared.form'])
        .run(Run)
        .config(ConfigRoute)
        .config(ConfigSocialApi)
        .service('loginModal', loginModal)
        .controller('LoginModalController', LoginModalController)
        .controller('SettingsController', SettingsController)
        .controller('UserLoginController', UserLoginController)
        .controller('SignupController', SignupController);



// TODO move
function Run() {
//    $FB.init(Config.api.facebook);
}


ConfigRoute.$inject = ['$stateProvider'];
function ConfigRoute($stateProvider) {
    $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'js/src/account/partials/login.html',
                controller: 'UserLoginController',
                data: {
                    requireLogin: false
                }
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'js/src/account/partials/signup.html',
                controller: 'SignupController',
                data: {
                    requireLogin: false
                }
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'js/src/account/partials/settings.html',
                controller: 'SettingsController',
                data: {
                    requireLogin: true
                }
            });
}

function ConfigSocialApi($authProvider, Config) {
    $authProvider.facebook({
        clientId: Config.api.facebook,
        url: WEBROOT_FULL + '/users/facebook_login.json',
        redirectUri: WEBROOT_FULL
    });

    $authProvider.withCredentials = true;
    $authProvider.tokenRoot = null;
    $authProvider.cordova = false;
    $authProvider.baseUrl = '/';
//    $authProvider.loginUrl = WEBROOT_FULL + 'users/login';
//    $authProvider.signupUrl = WEBROOT_FULL + 'users/signup';
//    $authProvider.unlinkUrl = WEBROOT_FULL + 'users/unlink';
    $authProvider.tokenName = 'token';
    $authProvider.tokenPrefix = '';//'satellizer';
    $authProvider.authHeader = 'Authorization';
    $authProvider.authToken = 'Bearer';
    $authProvider.storageType = 'localStorage';
//    $authProvider.google({
//        clientId: 'Google Client ID'
//    });
//    $authProvider.instagram({
//        clientId: 'Instagram Client ID'
//    });
}

SettingsController.$inject = ['$scope', 'SharedData', 'messageCenterService', 'AuthenticationService', 'UserEntity']
function SettingsController($scope, SharedData, messageCenterService, AuthenticationService, UserEntity) {

    $scope.data = {};
    $scope.password = '';
    $scope.removeAccount = removeAccount;
    $scope.isFormDeleteAccountLoading = false;
    $scope.isSociaLogin = isSocialLogin;
    $scope.data.user = AuthenticationService.getCurrentUser();

    function isSocialLogin() {
        return AuthenticationService.getCurrentUser().provider !== null;
    }

    function removeAccount(password) {
        $scope.isFormDeleteAccountLoading = true;
        messageCenterService.removeShown();
        UserEntity.removeAccount({password: password}, function(response) {
            if (response.success) {
                messageCenterService.add('success', response.message, {status: messageCenterService.status.next});
                $scope.$parent.logout();
            }
            else {
                messageCenterService.add('danger', response.message, {status: messageCenterService.status.shown});
            }
            $scope.isFormDeleteAccountLoading = false;
        }, function() {

            $scope.isFormDeleteAccountLoading = false;
        });
    }
}

function UserLoginController($scope, $state) {

    $scope.$on("user-login-success", function() {
        console.log("On user-login-success");
        $state.go('home');
    });

}

SignupController.$inject = ['$scope', '$location', 'SharedData',
    'messageCenterService', 'AuthenticationService']
function SignupController($scope, $location, SharedData,
        messageCenterService, AuthenticationService) {

    $scope.signup = signup;

    function signup(data) {
        var promise = $scope.signupForm.submit(AuthenticationService.signup(data));
        promise.then(successCallback);

        function successCallback(response) {
            if (response.success) {
                $scope.$parent.isAuthed = true;
                messageCenterService.add('success', response.message, {status: messageCenterService.status.shown});
                $location.path('/');
            }
            else {
                messageCenterService.add('danger', response.message, {status: messageCenterService.status.shown});
                formManager.setErrors(response.validationErrors.Users);
            }
        }
    }
}

function loginModal($uibModal) {

    return function() {
        var instance = $uibModal.open({
            templateUrl: 'js/src/account/partials/login_modal.html',
            controller: 'LoginModalController',
            controllerAs: 'LoginModalController'
        });
        return instance.result;
    };
}

function LoginModalController($scope) {

    this.cancel = $scope.$dismiss;

    $scope.$on("user-login-success", function(event) {
        console.log("Modal on user-login-success");
        $scope.$close();
    });

}