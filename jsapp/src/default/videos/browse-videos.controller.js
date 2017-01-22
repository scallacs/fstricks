angular.module('app.videos')
        .controller('BrowseVideosController', BrowseVideosController);

BrowseVideosController.$inject = ['$scope', '$state', '$stateParams', 'ApiFactory', 'SharedData', 'PaginateDataLoader'];

function BrowseVideosController($scope, $state, $stateParams, ApiFactory, SharedData, PaginateDataLoader) {
    
    var endpoint = ApiFactory
            .endpoint('Videos', 'index')
            .paginate();
    $scope.loader = PaginateDataLoader
            .setMode('replace')
            .setLimit(16); // TODO param
    /*
            .instance('browse-videos', endpoint)
            .then(function (data) {
                
            })
            .finally(function () {
                SharedData.pageLoader(false);
            })
            .catch(function () {
                $state.go('notfound');
            });*/
}
