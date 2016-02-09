angular.module('app.tag', ['ngRoute', 'app.core', 'ui.bootstrap', 'ui.select'])
        .controller('SearchTagController', SearchTagController)
        .config(Config);


function Config($routeProvider) {
    var baseUrl = 'js/src/tag/partials/';
    $routeProvider
            .when('/tag/add/:videoId', {
                templateUrl: baseUrl + 'add.html',
                controller: 'AddVideoTagController'
            })
            .when('/tag/edit/:videoId/:tagId', {
                templateUrl: baseUrl + 'add.html',
                controller: 'AddVideoTagController'
            });
}

function SearchTagController($scope, TagEntity) {

    $scope.suggested = [];
    $scope.selected = [];

    $scope.refreshSuggestedTags = loadSuggestedTags;
    $scope.onSelectTag = onSelectTag;
    $scope.tagTransform = tagTransform;

    function onSelectTag($item, $model) {
        $scope.$emit('onSelectedTagUpdated', $scope.selected);
    }

    function onRemoveTag($item, $model) {
        $scope.$emit('onSelectedTagUpdated', $scope.selected);
    }
    function loadSuggestedTags(term) {
        TagEntity.suggest({id: term}, function(results) {
            $scope.suggested = results;
        });
    }
    function tagTransform(term) {
        return {
            isTag: true,
            name: term,
            count_ref: 0,
            id: null
        };

    }

}
