angular.module('app.admin')
        .config(ConfigRouting);

ConfigRouting.$inject = ['$stateProvider'];
function ConfigRouting($stateProvider) {
    'use strict';
    $stateProvider
            .state('video-tags-edit', {
                parent: 'main',
                url: "/video-tags/custom-edit/:id",
                params: {id: null},
                controller: 'VideoTagEditController',
                controllerAs: 'controller',
                templateUrl: __AdminPathConfig__.template + "video-tags/partials/edit.html",
            })
            .state('logout', {
                url: "/logout",
                controller: 'LogoutController',
            }) 
            .state("otherwise", {
                url: "*path",
                templateUrl: __PathConfig__.template + "/views/error-not-found.html",
            })
            .state("notfound", {
                url: "*path",
                templateUrl: __PathConfig__.template + "/views/error-not-found.html"
            });
}