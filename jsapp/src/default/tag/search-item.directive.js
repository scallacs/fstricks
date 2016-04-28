angular.module('app.tag')
        .directive('searchItem', tagItem);

function tagItem() {
    return {
        restrict: 'EA',
        templateUrl: __PathConfig__.template + '/tag/partials/search-item.html',
        scope: {
            searchItem: '='
        },
        controller: [
            '$scope', 'VideoTagData',
            function ($scope, VideoTagData){
                $scope.videoTagData = VideoTagData;
            }
        ]
    };
}

