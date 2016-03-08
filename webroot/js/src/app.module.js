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
        .controller('ModalInstanceCtrl', ModalInstanceCtrl)
        .controller('MainController', MainController)
        .run(Run);

ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance'];
function ModalInstanceCtrl($scope, $uibModalInstance) {
    $scope.ok = function() {
        $uibModalInstance.close('close');
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}

MainController.$inject = ['$scope', 'PlayerData', 'VideoTagData', 'SharedData', 'AuthenticationService', '$state', 'Config'];
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
                q: data.search
            });
        }
        else if (data.type === 'rider') {
            $state.go('videoplayer.rider', {riderId: data.slug});
        }
        else if (data.type === 'tag') {
            $state.go('videoplayer.tag', {tagSlug: data.slug});
        }
        else if (data.type === 'playlist') {
            $state.go('videoplayer.playlist', {playlistId: data.id});
        }
    });

    $scope.$on('on-playlist-title-clicked', function(event, playlist) {
        $state.go("videoplayer.playlist", {playlistId: playlist.id});
    });
}

Run.$inject = ['$rootScope', 'AuthenticationService', 'loginModal', '$state', 'SharedData'];
function Run($rootScope, AuthenticationService, loginModal, $state, SharedData) {
    AuthenticationService.init();
    SharedData.init();

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        SharedData.currentSearch = {};

        if (toState.redirectTo) {
            event.preventDefault();
            $state.go(toState.redirectTo, toParams);
            return;
        }
        //console.log('$stateChangeStart: ' + event);
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
                            return $state.go('home');
                        }
                    });
        }
        else {
            loginModal.dismiss();
        }
        SharedData.pageLoader(toState.data.pageLoader);
    });

}

ConfigRouting.$inject = ['$stateProvider'];
function ConfigRouting($stateProvider) {
    'use strict';
    $stateProvider
//            .state('home', {
//                url: "/",
//                redirectTo: 'videoplayer.best'
//            })
            .state("otherwise", {
                url: "*path",
                templateUrl: "js/src/views/error-not-found.html",
                data: {
                    requireLogin: false
                }
            })
            .state("notfound", {
                url: "*path",
                templateUrl: "js/src/views/error-not-found.html",
                data: {
                    requireLogin: false
                }
            });
}

ConfigInterceptor.$inject = ['$httpProvider', '$locationProvider'];
function ConfigInterceptor($httpProvider, $locationProvider) {
    'use strict';
    //$locationProvider.html5Mode(true).hashPrefix('!');
    $locationProvider.html5Mode(true);

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
                    loginModal.open()
                            .result
                            .then(function() {
                                return $http(rejection.config);
                            })
                            .catch(function() {
                                $state.go('home');
                                deferred.reject(rejection);
                            });
//                    alert('ok');
                }
//                else if (status === 404){
//                }
                else if (status >= 500) {
                    alert('This functinality is not available for now, try again later.');
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
