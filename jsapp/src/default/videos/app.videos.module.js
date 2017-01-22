angular.module('app.videos', ['app.core', 'ui.bootstrap', 'ui.select', 'ui.router',
    'ui.slider'
])
        .config(Config);

Config.$inject = ['$stateProvider'];
function Config($stateProvider) {
    var baseUrl = __PathConfig__.template + '/videos/partials/';

    $stateProvider
            .state('browse_video', {
                url: '/videos/browse',
                templateUrl: baseUrl + 'browse-videos.html',
                controller: 'BrowseVideosController',
                data: {
                    requireLogin: false,
                    pageLoader: true
                }
            });
}