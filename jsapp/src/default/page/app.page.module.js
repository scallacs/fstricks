angular.module('app.page', ['ui.router', 'app.core', 'app.tag', 'app.player'])
        .config(ConfigRoute)
        .controller('PagesController', PagesController)
        .controller('HomeController', HomeController);

ConfigRoute.$inject = ['$stateProvider'];
function ConfigRoute($stateProvider) {
    var baseUrl = __PathConfig__.template + '/page/partials/';
    
    $stateProvider
            .state('faq', {
                url: '/faq',
                templateUrl: baseUrl + 'faq.html',
                controller: 'PagesController',
                data: {
                    requireLogin: false
                }
            })
            .state('contact', {
                url: '/contact',
                templateUrl: baseUrl + '/contact.html',
                controller: 'PagesController',
                data: {
                    requireLogin: false
                }
            })
            .state('gtu', {
                url: '/gtu',
                templateUrl: baseUrl + '/gtu.html',
                controller: 'PagesController',
                data: {
                    requireLogin: false
                }
            })
            .state('privacy_policy', {
                url: '/privacy-policy',
                templateUrl: baseUrl + '/privacy_policy.html',
                controller: 'PagesController',
                data: {
                    requireLogin: false
                }
            })
            .state('home', {
                url: '/',
                templateUrl: baseUrl + '/home.html',
                controller: 'HomeController',
                data: {
                    requireLogin: false,
                    loader: true
                }
            })
            .state('index', {
                url: '/index.html',
                templateUrl: baseUrl + '/home.html',
                controller: 'HomeController',
                data: {
                    requireLogin: false,
                    loader: true
                }
            });
}

function PagesController() {}


HomeController.$inject = ['$scope', 'SharedData', 'VideoTagEntity', 'PlaylistEntity', '$state'];
function HomeController($scope, SharedData, VideoTagEntity, PlaylistEntity, $state) {
    SharedData.pageLoader(false);
    
    VideoTagEntity.trending({}, function(results){
        $scope.videoTags = results;
    });
    
    PlaylistEntity.trending({}, function(results){
        $scope.playlists = results;
    });
    
    $scope.$on('view-video-tag', function(event, data){
        $state.go('videoplayer.realization', {
            videoTagId: data.slug
        });
    });
    
}
