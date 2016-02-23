angular.module('app', [
    'ngResource',
    'ui.router',
    'app.core',
    'app.player',
    'app.layout',
    'app.account',
    'app.config',
    'app.rider',
    'app.tag',
    'app.page',
    'toaster'
])
        .config(ConfigRouting)
        .config(ConfigInterceptor)
        .controller('MainController', MainController)
        .run(Run);


function MainController($scope, PlayerData, VideoTagData, SharedData, AuthenticationService, $state, Config) {
    $scope.playerData = PlayerData;
    $scope.videoTagData = VideoTagData;
    $scope.SharedData = SharedData;
    $scope.authData = AuthenticationService.authData;
    $scope.config = Config.website;

    $scope.$on('view-video-tag', function(event, tag) {
        console.log('MainController: Event view-video-tag');
        $scope.$broadcast('view-video-tag-broadcast', tag);
    });

    $scope.$on('on-search-item-selected', function(event, data) {
        // immediate search
        if (data.type === 'partial') {
            console.log("Start partial seach");
            $state.go('videoplayer.search', {
                tagName: data.search
            });
        }
        else if (data.type === 'rider') {
            $state.go('videoplayer.rider', {riderId: data.id});
        }
        else if (data.type === 'tag') {
            $state.go('videoplayer.tag', {tagId: data.id});
        }
    });
}


function Run($rootScope, AuthenticationService, loginModal, $state, SharedData, PlayerData) {

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        console.log('$stateChangeStart: ' + event);
        var requireLogin = toState.data.requireLogin;

        if (requireLogin && !AuthenticationService.isAuthed()) {
            console.log('DENY USER ACCESS FOR THIS LOCATION');
            event.preventDefault();

            var wasLoading = SharedData.loadingState;
            SharedData.pageLoader(false);
            loginModal.open().result
                    .then(function() {
                        if (loginModal.isset()) {
                            console.log("Login success, continuing");
                            SharedData.pageLoader(wasLoading);
                            return $state.go(toState.name, toParams);
                        }
                    })
                    .catch(function() {
                        if (loginModal.isset()) {
                            console.log("Closing modal with catch");
                            return $state.go('videoplayer.home');
                        }
                    });
        }
        else {
            loginModal.dismiss();
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
    $stateProvider.state("notfound", {
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
                    loginModal.open().result
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
