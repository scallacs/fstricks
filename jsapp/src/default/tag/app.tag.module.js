angular.module('app.tag', ['app.core', 'ui.bootstrap', 'ui.select', 'ui.router',
    'ui.slider'
])
        .controller('SearchTagController', SearchTagController)
        .controller('ModalReportErrorController', ModalReportErrorController)
        .config(Config);
Config.$inject = ['$stateProvider'];
function Config($stateProvider) {
    var baseUrl = __PathConfig__.template + '/tag/partials/';

    $stateProvider
            .state('addtag', {
                url: '/tag/add/:videoId/:tagId',
                views: {
                    viewNavRight: {
                        template: '<div player-nav></div>'
                    },
                    '': {
                        templateUrl: baseUrl + 'add-video-tag.html',
                        controller: 'AddVideoTagController'
                    },
                },
                data: {
                    requireLogin: true,
                    pageLoader: true
                }
            });
}

SearchTagController.$inject = ['$scope', 'TagEntity'];
function SearchTagController($scope, TagEntity) {

    $scope.suggested = [];
    $scope.selected = [];

    $scope.refreshSuggestedTags = loadSuggestedTags;
    $scope.onSelectTag = onSelectTag;
    $scope.tagTransform = tagTransform;

    function onSelectTag($item, $model) {
        $scope.$emit('onSelectedTagUpdated', $scope.selected);
    }

//    function onRemoveTag($item, $model) {
//        $scope.$emit('onSelectedTagUpdated', $scope.selected);
//    }
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

ModalReportErrorController.$inject = ['$scope', '$uibModalInstance', 'ErrorReportEntity', 'videoTag'];
function ModalReportErrorController($scope, $uibModalInstance, ErrorReportEntity, videoTag) {

    $scope.videoTag = videoTag;
    $scope.errorReport = {};

    $scope.ok = function() {
        $uibModalInstance.close($scope.videoTag);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.sendReport = function(errorReport) {
        errorReport.video_tag_id = videoTag.id;
        $scope.formReportVideoTagError
                .submit(ErrorReportEntity.post(errorReport).$promise)
                .then(function(response) {
                    if (response.success) {
                        $uibModalInstance.close($scope.videoTag);
                    }
                });
    };
}

