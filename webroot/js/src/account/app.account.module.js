angular.module('app.account', [
    'ngResource',
    'ngRoute',
    'ngMessages',
    'satellizer',
    'MessageCenterModule',
    'app.config',
    'app.core',
    'shared.form'])
        .run(Run)
        .config(ConfigRoute)
        .config(ConfigSocialApi)
        .controller('SettingsController', SettingsController)
        .controller('UserLoginController', UserLoginController)
        .controller('SignupController', SignupController);



// TODO move
function Run() {
//    $FB.init(Config.api.facebook);
}


ConfigRoute.$inject = ['$routeProvider'];
function ConfigRoute($routeProvider) {
    $routeProvider
            .when('/settings', {
                templateUrl: 'js/src/account/partials/settings.html',
                controller: 'SettingsController'
            })
            .when('/login', {
                templateUrl: 'js/src/account/partials/login.html',
                controller: 'UserLoginController'
            })
            .when('/signup', {
                templateUrl: 'js/src/account/partials/signup.html',
                controller: 'SignupController'
            })
}
;

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

SettingsController.$inject = ['$scope', 'SharedData', 'messageCenterService', 'AuthenticationService', 'UserEntity', 'PlayerData']
function SettingsController($scope, SharedData, messageCenterService, AuthenticationService, UserEntity, PlayerData) {

    AuthenticationService.requireLogin();

    $scope.data = {};
    $scope.password = '';
    $scope.removeAccount = removeAccount;
    $scope.isFormDeleteAccountLoading = false;
    $scope.isSociaLogin = isSocialLogin;
    $scope.data.user = AuthenticationService.getCurrentUser();

    SharedData.loadingState = 0;
    PlayerData.hide();

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

UserLoginController.$inject = ['$scope', '$auth', 'SharedData', 'messageCenterService', '$location', 'AuthenticationService', 'PlayerData'];
function UserLoginController($scope, $auth, SharedData, messageCenterService, $location,
        AuthenticationService, PlayerData) {
    // create a message to display in our view
    PlayerData.hide();
    $scope.authenticate = authenticate;
    $scope.login = login;

    messageCenterService.removeShown();
    SharedData.loadingState = 0;

    function authenticate(provider) {
        var promise = $auth.authenticate(provider, {provider: provider});
        promise.then(successCallback);

        function successCallback(response) {
            response = response.data;
            $scope.$parent.isAuthed = response.success;

            if (response.success) {
                response.data.provider = provider;
                AuthenticationService.setCredentials(response.data);
                $location.path(SharedData.previousPage);
            }
        }
    }


    function login(data) {
        var promise = AuthenticationService.login(data.email, data.password);
        $scope.loginForm.submit(promise).then(callback);

        function callback(response) {
            var isLogin = response.success;
            $scope.$parent.isAuthed = isLogin;
        }
    }
}

SignupController.$inject = ['$scope', '$location', 'PlayerData', 'SharedData',
    'messageCenterService', 'AuthenticationService']
function SignupController($scope, $location, PlayerData, SharedData,
        messageCenterService, AuthenticationService) {

    $scope.signup = signup;
    
    SharedData.loadingState = 0;
    
    PlayerData.hide();
    messageCenterService.removeShown();
    

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

