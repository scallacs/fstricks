angular.module('app.page', [])
        .config('ConfigRoute', ConfigRoute)
        .controller('PagesController', PagesController);

ConfigRoute.$inject = ['$routeProvider'];
function ConfigRoute($routeProvider) {
    $routeProvider
            .when('/faq', {
                templateUrl: HTML_FOLDER + '/Pages/faq.html',
                controller: 'PagesController'
            })
            .when('/contact', {
                templateUrl: HTML_FOLDER + '/Pages/contact.html',
                controller: 'PagesController'
            });
}

function PagesController($scope, SharedData, PlayerData) {
    PlayerData.hide();
    SharedData.loadingState = 0;
}
