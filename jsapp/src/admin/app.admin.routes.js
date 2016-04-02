angular.module('app.admin')
        .config(ConfigRouting);

ConfigRouting.$inject = ['$stateProvider'];
function ConfigRouting($stateProvider) {
    'use strict';
    $stateProvider
            .state('home', {
                url: "/",
                controller: 'DashboardController',
                templateUrl: ADMIN_TEMPLATE_URL + "dashboard/partials/home.html"
            })
            .state('logout', {
                url: "/logout",
                controller: 'LogoutController',
//                templateUrl: ADMIN_TEMPLATE_URL + "admin/dashboard/partials/home.html"
            })
            .state("videotag", {
                url: "/video-tag",
                controller: 'VideoTagsController',
                templateUrl: ADMIN_TEMPLATE_URL + "video-tags/partials/template.html"
            })
            .state("videotag.index", {
                url: "/index",
                controller: 'VideoTagIndexController',
                templateUrl: ADMIN_TEMPLATE_URL + "video-tags/partials/index.html",
                data: {
                    pageLoader: true
                }
            })
            .state("videotag.edit", {
                url: "/edit/:videoTagId",
                controller: 'VideoTagEditController',
                templateUrl: ADMIN_TEMPLATE_URL + "video-tags/partials/edit.html",
                data: {
                    pageLoader: true
                }
            })
            .state("otherwise", {
                url: "*path",
                templateUrl: TEMPLATE_URL + "/views/error-not-found.html",
            })
            .state("notfound", {
                url: "*path",
                templateUrl: TEMPLATE_URL + "/views/error-not-found.html"
            });
}