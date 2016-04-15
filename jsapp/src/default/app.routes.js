angular.module('app.routes', [])
        .config(ConfigRouting);

ConfigRouting.$inject = ['$stateProvider'];
function ConfigRouting($stateProvider) {
    'use strict';
    $stateProvider
            .state("otherwise", {
                url: "*path",
                templateUrl: __PathConfig__.template + "views/error-not-found.html",
                data: {
                    requireLogin: false
                }
            })
            .state("notfound", {
                url: "*path",
                templateUrl: __PathConfig__.template + "views/error-not-found.html",
                data: {
                    requireLogin: false
                }
            });
}
