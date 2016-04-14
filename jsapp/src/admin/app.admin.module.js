angular.module('app.admin', [
    'ngResource',
    'ng-admin', 
    'ui.router',
    'app.core',
    'app.player',
    'app.tag',
    'app.rider',
    'toaster',
    'satellizer',
    'shared',
    'ui.bootstrap',
//    'app.account', // Required by form-video-tag !!???
    'toaster',
    'app.admin.util'
])
        .config(ConfigInterceptor)
        .controller('MainAdminController', MainAdminController)
        .controller('LogoutController', LogoutController)
        .run(Run);


MainAdminController.$inject = ['$scope', 'PlayerData', 'VideoTagData', 'SharedData', 'AuthenticationService', '$state', 'Config'];
function MainAdminController($scope, PlayerData, VideoTagData, SharedData, AuthenticationService, $state, Config) {
    $scope.playerData = PlayerData;
    $scope.videoTagData = VideoTagData;
    $scope.SharedData = SharedData;
    $scope.authData = AuthenticationService.authData;
    $scope.config = Config.website;

    $scope.$on('view-video-tag', function(event, tag) {
        console.log('MainAdminController: Event view-video-tag');
        $scope.$broadcast('view-video-tag-broadcast', tag);
    });

    $scope.$on('on-search-item-selected', function(event, data) {
        // immediate search
        if (data.type === 'partial') {
            console.log("Start partial seach");
            $state.go('videoplayer.sport', {
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

Run.$inject = ['$rootScope', 'AuthenticationService', '$state', 'SharedData'];
function Run($rootScope, AuthenticationService, $state, SharedData) {
    AuthenticationService.init();
    SharedData.init();
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        SharedData.currentSearch = {};
        if (toState.redirectTo) {
            event.preventDefault();
            $state.go(toState.redirectTo, toParams);
            return;
        }

//        if (!AuthenticationService.isAuthed()) {
//            console.log('DENY USER ACCESS FOR THIS LOCATION');
//            event.preventDefault();
//            SharedData.pageLoader(false);
//        }

        SharedData.pageLoader(angular.isDefined(toState.data) ?
                toState.data.pageLoader : false);
    });

}
ConfigInterceptor.$inject = ['$httpProvider', '$locationProvider'];
function ConfigInterceptor($httpProvider, $locationProvider) {
    'use strict';
    $locationProvider.html5Mode(true);
    var interceptor = ['$rootScope', '$q', '$injector', '$timeout',
        function(scope, $q, $injector, $timeout) {
            var $http, $state;
//            var loginModal, $http, $state;

            // this trick must be done so that we don't receive
            // `Uncaught Error: [$injector:cdep] Circular dependency found`
            $timeout(function() {
//                loginModal = $injector.get('loginModal');
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
//                    loginModal.open()
//                            .result
//                            .then(function() {
//                                return $http(rejection.config);
//                            })
//                            .catch(function() {
//                                $state.go('home');
//                                deferred.reject(rejection);
//                            });
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


LogoutController.$inject = ['$state', 'AuthenticationService'];
function LogoutController($state, AuthenticationService) {
    AuthenticationService.logout();
    $state.go('home');
}