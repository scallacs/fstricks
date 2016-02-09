angular.module('app.video')
        .directive('videoTagItem', videoTagItem);

videoTagItem.$inject = ['PlayerData'];
function videoTagItem(PlayerData) {
    return {
        restrict: 'EA',
        templateUrl: WEBROOT_FULL + '/html/VideoTags/item.html',
        scope: {
            playerData: '=playerData',
            videoTag: '=videoTag',
            editionMode: '@'
        },
        controller: function($scope, $uibModal) {

            $scope.openReportErrorModal = openReportErrorModal;
            $scope.view = view;

            function openReportErrorModal(videoTag) {
                var modal = $uibModal.open({
                    templateUrl: HTML_FOLDER + '/ReportErrors/form.html',
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
                //console.log("EMIT: view-video-tag");
                //$scope.$emit('view-video-tag', videoTag);
                PlayerData.view(videoTag);
            }

        },
        link: function($scope, element) {
            $scope.editionMode = angular.isDefined($scope.editionMode) ? $scope.playerData.editionMode : false;
        }
    };
}

