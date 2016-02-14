angular.module('app.tag')
        .directive('videoTagItem', videoTagItem);

videoTagItem.$inject = ['PlayerData'];
function videoTagItem(PlayerData) {
    return {
        restrict: 'EA',
        templateUrl: 'js/src/tag/partials/video-tag-item.html',
        scope: {
            videoTag: '=videoTag',
            editionMode: '@'
        },
        controller: function($scope, $uibModal, PlayerData, VideoTagData) {

            $scope.openReportErrorModal = openReportErrorModal;
            $scope.view = view;
            $scope.playerData = PlayerData;
            $scope.videoTagData = VideoTagData;

            function openReportErrorModal(videoTag) {
                var modal = $uibModal.open({
                    templateUrl: 'js/src/tag/partials/report_error_form.html',
                    controller: 'ModalReportErrorController',
                    size: 'lg',
                    resolve: {
                        videoTag: function() {
                            return videoTag;
                        }
                    }
                });
            }

            function view(videoTag) {
                $scope.$emit("view-video-tag", videoTag);
                PlayerData.view(videoTag);
            }

        },
        link: function($scope, element) {
            $scope.editionMode = angular.isDefined($scope.editionMode) ? $scope.playerData.editionMode : false;
        }
    };
}

