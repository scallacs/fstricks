angular.module('app.page', ['ui.router'])
        .config(ConfigRoute)
        .controller('PagesController', PagesController);

ConfigRoute.$inject = ['$stateProvider'];
function ConfigRoute($stateProvider) {
    var baseUrl = 'js/src/page/partials/';
    
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
            });
}

function PagesController() {
    
}
