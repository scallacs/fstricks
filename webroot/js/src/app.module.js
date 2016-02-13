angular.module('app', [
    'ngResource',
    'ui.router',
    'app.core',
    'app.player',
    'app.layout',
    'app.account',
    'app.rider',
    'app.tag',
    'app.page'
])
        .config(ConfigRouting)
        .config(ConfigInterceptor)
        .controller('MainController', MainController)
        .run(Run);


function MainController($scope, PlayerData, VideoTagData, SharedData, AuthenticationService) {
    $scope.playerData = PlayerData;
    $scope.videoTagData = VideoTagData;
    $scope.SharedData = SharedData;

    $scope.authData = AuthenticationService.authData;
}


function Run($rootScope, AuthenticationService, loginModal, $state, messageCenterService, SharedData) {

    messageCenterService.removeShown();

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        var requireLogin = toState.data.requireLogin;

        if (requireLogin && !AuthenticationService.isAuthed()) {
            console.log('DENY USER ACCESS FOR THIS LOCATION');
            event.preventDefault();
            loginModal()
                    .then(function() {
                        return $state.go(toState.name, toParams);
                    })
                    .catch(function() {
                        return $state.go('videoplayer.home');
                    });
        }
        SharedData.pageLoader(toState.data.pageLoader);
    });

}

function ConfigRouting($stateProvider) {
    'use strict';
    $stateProvider.state("otherwise", {
        url: "*path",
        templateUrl: "js/src/views/error-not-found.html",
        data: {
            requireLogin: false
        }
    });
}
function ConfigInterceptor($httpProvider) {
    'use strict';
    //$locationProvider.html5Mode(true).hashPrefix('!');

    var interceptor = ['$rootScope', '$q', '$injector', '$timeout',
        function(scope, $q, $injector, $timeout) {
            var loginModal, $http, $state;

            // this trick must be done so that we don't receive
            // `Uncaught Error: [$injector:cdep] Circular dependency found`
            $timeout(function() {
                loginModal = $injector.get('loginModal');
                $http = $injector.get('$http');
                $state = $injector.get('$state');
            });

            function requestError(rejection) {
                console.log(rejection);
                return $q.reject(rejection);
            }

            function responseError(rejection) {
                console.log(rejection);
                var status = rejection.status;
                var deferred = $q.defer();
                if (status === 401) {
                    $injector.get('AuthenticationService').logout();
                    loginModal()
                            .then(function() {
                                deferred.resolve($http(rejection.config));
                            })
                            .catch(function() {
                                $state.go('videoplayer.home');
                                deferred.reject(rejection);
                            });
                    return;
                }
//                else if (status === 404){
//                }
                else if (status >= 500) {
                    alert('Sorry but we have a few issues right now. This functinality is not available, try again later.');
                    return;
                }
                return $q.reject(rejection);
            }

            return {
                request: function(config) {
                    return config;
                },
                responseError: responseError,
                requestError: requestError,
                response: function(response) {
                    return response;
                }
            };
        }];
    $httpProvider.interceptors.push(interceptor);
}
