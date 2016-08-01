angular.module('app.tag')
        .directive('videoTagItem', videoTagItem);

function videoTagItem() {
    return {
        restrict: 'EA',
        template: '<div ng-include="getContentUrl()"></div>',
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
        link: function($scope, element, attr) {
            if (!attr.mode) attr.mode = 'item';
            if (!attr.thumbnailSize) attr.thumbnailSize = '';
            if ($scope.videoTag.video.provider_id === 'youtube'){
                $scope.videoTag.thumbnail = 'https://i.ytimg.com/vi/'+$scope.videoTag.video.video_url+'/'+attr.thumbnailSize+'default.jpg';
            }
            else if ($scope.videoTag.video.provider_id === 'vimeo'){
                $scope.videoTag.thumbnail = "https://i.vimeocdn.com/video/"+$scope.videoTag.video.video_url+".jpg";
            }
            $scope.getContentUrl = function() {
                 return __PathConfig__.template + '/tag/partials/video-tag-'+attr.mode+'.html';
            };
        }
    };
}

