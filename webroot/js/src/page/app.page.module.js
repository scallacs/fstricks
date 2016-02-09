angular.module('app.page', [])
        .config(ConfigRoute)
        .controller('PagesController', PagesController);

ConfigRoute.$inject = ['$routeProvider'];
function ConfigRoute($routeProvider) {
    var baseUrl = 'js/src/page/partials/';
    $routeProvider
            .when('/faq', {
                templateUrl: baseUrl + 'faq.html',
                controller: 'PagesController'
            })
            .when('/contact', {
                templateUrl: baseUrl + '/contact.html',
                controller: 'PagesController'
            });
}

function PagesController($scope, SharedData, PlayerData) {
    PlayerData.hide();
    SharedData.loadingState = 0;
}
