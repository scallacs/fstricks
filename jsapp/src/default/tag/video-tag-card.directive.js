angular.module('app.tag')
        .directive('videoTagCard', videoTagCard);

function videoTagCard() {
    return {
        restrict: 'EA',
        templateUrl: __PathConfig__.template + '/tag/partials/video-tag-card.html',
        scope: {
            videoTag: '=',
            options: '='
        },
        controller: ['$scope', '$uibModal', 'PlayerData', 'VideoTagData','AuthenticationService', 
                function($scope, $uibModal, PlayerData, VideoTagData, AuthenticationService) {

            $scope.openReportErrorModal = openReportErrorModal;
            $scope.view = view;
            $scope.playerData = PlayerData;
            $scope.videoTagData = VideoTagData;
            $scope.addToPlaylist = addToPlaylist;
            $scope.authData = AuthenticationService.authData;
            $scope.baseUrl = __PathConfig__.domain;
            
            function openReportErrorModal(videoTag) {
                var modal = $uibModal.open({
                    templateUrl: __PathConfig__.template + '/tag/partials/report_error_form.html',
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
                    templateUrl: __PathConfig__.template + '/player/partials/playlist-modal.html',
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
    // TODO remove duplicate with video-tag-item.directive
        link: function($scope, element, attr) {
            if ($scope.videoTag.video.provider_id === 'youtube'){
                $scope.videoTag.thumbnail = 'https://i.ytimg.com/vi/'+$scope.videoTag.video.video_url+'/mqdefault.jpg';
            }
            else if ($scope.videoTag.video.provider_id === 'vimeo'){
                $scope.videoTag.thumbnail = "https://i.vimeocdn.com/video/"+$scope.videoTag.video.video_url+".jpg";
            }
            
        }
    };
}

