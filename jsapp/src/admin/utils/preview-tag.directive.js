angular.module('app.admin')
        .directive('previewTag', PreviewTagDirective)
        .controller('ModalPreviewTagController', ModalPreviewTagController);

PreviewTagDirective.$inject = ['$uibModal'];
function PreviewTagDirective(modal) {
    return {
        restrict: 'E',
        scope: {entry: '&', text: '@', url: '@'},
        link: function (scope) {
            var entry = scope.entry();
            scope.preview = function () {
                var instance = modal.open({
                    templateUrl: __AdminPathConfig__.template + 'utils/partials/modal-preview-tag.html',
                    controller: 'ModalPreviewTagController',
                    controllerAs: 'modalPreviewTagController',
                    size: 'lg',
                    resolve: {
                        videoTag: function() {
                            return entry.values;
                        }
                    }
                });
            };
        },
        template: '<button class="btn btn-xs btn-primary" ng-click="preview()"><span class="glyphicon glyphicon-play"></span> Preview</button>'
    };
}


ModalPreviewTagController.$inject = ['$scope', '$uibModalInstance', 'videoTag', 'PlayerData'];
function ModalPreviewTagController($scope, $uibModalInstance, videoTag, PlayerData) {

    $scope.videoTag = videoTag;
    $scope.errorReport = {}; 
    
    PlayerData.playVideoTag(videoTag);

    $scope.ok = function () {
        $uibModalInstance.close($scope.videoTag);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
