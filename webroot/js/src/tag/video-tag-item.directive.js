angular.module('app.tag')
        .directive('videoTagItem', videoTagItem);

function videoTagItem() {
    return {
        restrict: 'EA',
        templateUrl: TEMPLATE_URL + '/tag/partials/video-tag-item.html',
        scope: {
            videoTag: '=videoTag'
        },
        controller: ['$scope', '$uibModal', 'PlayerData', 'VideoTagData', 'AuthenticationService', 
                function($scope, $uibModal, PlayerData, VideoTagData, AuthenticationService) {

            $scope.openReportErrorModal = openReportErrorModal;
            $scope.view = view;
            $scope.playerData = PlayerData;
            $scope.videoTagData = VideoTagData;
            $scope.addToPlaylist = addToPlaylist;
            $scope.authData = AuthenticationService.authData;
            
            function openReportErrorModal(videoTag) {
                var modal = $uibModal.open({
                    templateUrl: TEMPLATE_URL + '/tag/partials/report_error_form.html',
                    controller: 'ModalReportErrorController',
                    size: 'lg',
                    resolve: {
                        videoTag: function() {
                            return videoTag;
                        }
                    }
                });
            }
            function addToPlaylist(videoTag) {
                var modal = $uibModal.open({
                    templateUrl: TEMPLATE_URL + '/player/partials/playlist-modal.html',
                    controller: 'ModalPlaylistController',
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
                PlayerData.playVideoTag(videoTag);
            }
            

        }],
        link: function($scope, element, attr) {
            if ($scope.videoTag.provider_id === 'youtube'){
                $scope.videoTag.thumbnail = 'https://i.ytimg.com/vi/'+$scope.videoTag.video_url+'/default.jpg';
            }
            else if ($scope.videoTag.provider_id === 'vimeo'){
                $scope.videoTag.thumbnail = "https://i.vimeocdn.com/video/"+$scope.videoTag.video_url+".jpg";
            }
        }
    };
}

