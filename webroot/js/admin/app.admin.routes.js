angular.module('app.admin')
        .config(ConfigRouting);

ConfigRouting.$inject = ['$stateProvider'];
function ConfigRouting($stateProvider) {
    'use strict';
    $stateProvider
            .state('home', {
                url: "/",
                controller: 'DashboardController',
                templateUrl: TEMPLATE_URL + "/../admin/dashboard/partials/home.html"
            })
            .state("users", {
                url: "/users",
                controller: 'UsersController',
                templateUrl: TEMPLATE_URL + "/../admin/users/partials/template.html"
            })
            .state("users.index", {
                url: "/index",
                controller: 'UserIndexController',
                templateUrl: TEMPLATE_URL + "/../admin/users/partials/index.html"
            })
            .state("videotag", {
                url: "/video-tag",
                controller: 'VideoTagsController',
                templateUrl: TEMPLATE_URL + "/../admin/video-tags/partials/template.html"
            })
            .state("videotag.index", {
                url: "/index",
                controller: 'VideoTagIndexController',
                templateUrl: TEMPLATE_URL + "/../admin/video-tags/partials/index.html",
                data: {
                    pageLoader: true
                }
            })
            .state("otherwise", {
                url: "*path",
                templateUrl: TEMPLATE_URL + "/views/error-not-found.html",
            });
}