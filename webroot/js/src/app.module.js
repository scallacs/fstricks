angular.module('app', [
    'ngResource',
    'ngRoute',
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
        .controller('MainController', MainController, VideoTagData)
        .run(Run);


function MainController($scope, PlayerData) {
    $scope.$on('$routeChangeStart', function() {
        $scope.isViewLoading = true;
    });
    $scope.$on('$routeChangeSuccess', function() {
        $scope.isViewLoading = false;
    });
    $scope.$on('$routeChangeError', function() {
        $scope.isViewLoading = false;
    });
    
    $scope.playerData = PlayerData;
    $scope.videoTagData = VideoTagData;
}


function Run($rootScope) {
    $rootScope.$on('$locationChangeStart', function() {
        $rootScope.previousPage = location.pathname;
    });
}

function ConfigRouting($routeProvider) {
    'use strict';
    $routeProvider.otherwise({redirectTo: '/'});
}
function ConfigInterceptor($httpProvider) {
    'use strict';
    //$locationProvider.html5Mode(true).hashPrefix('!');

    var interceptor = ['$location', '$rootScope', '$q', '$injector',
        function($location, scope, $q, $injector) {

            function requestError(rejection) {
                console.log(rejection);
                return $q.reject(rejection);
            }

            function responseError(rejection) {
                console.log(rejection);
                var status = rejection.status;
                if (status === 401) {
                    $injector.get('AuthenticationService').logout();
                    $location.path("/login");
                    return;
                }
//                else if (status === 404){
//                    $location.path("/");
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
