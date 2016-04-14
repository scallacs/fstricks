angular.module('app.tag')
        .controller('AddVideoTagController', AddVideoTagController);

AddVideoTagController.$inject = ['$scope', '$state', '$stateParams', 'VideoTagData', 'VideoEntity', 'VideoTagEntity', 'PlayerData', 'SharedData', 'AuthenticationService', 'EditionTag'];

function AddVideoTagController($scope, $state, $stateParams, VideoTagData, VideoEntity, VideoTagEntity, PlayerData, SharedData, AuthenticationService, EditionTag) {
//    $scope.editionTag = new EditionTag(AuthenticationService.getCurrentUser().id, {
//        add: VideoTagEntity.add,
//        edit: VideoTagEntity.edit,
//        delete: VideoTagEntity.delete
//    });
    SharedData.showCategories = false;
    $scope.editionTag = new EditionTag(AuthenticationService.getCurrentUser().id, {}, 'default', {
        min_duration: 2,
        max_duration: 40,
        similar_tag_limit_ratio: 0.6
    });
    $scope.editionTag
            .onApiCall('add', function (data) {
                return $scope.editionTag._form.submit(VideoTagEntity.add(data).$promise);
            })
            .onApiCall('edit', function (data) {
                return $scope.editionTag._form.submit(VideoTagEntity.edit(data).$promise);
            })
            .onApiCall('delete', function (data) {
                return $scope.editionTag._form.submit(VideoTagEntity.delete(data.id).$promise);
            });

    init();

    function init() {
        PlayerData.showEditionMode();
        PlayerData.showListTricks = false;
        VideoTagData.reset();
        VideoTagData.getLoader()
                .setFilter('with_pending', true)
                .setFilter('video_id', $stateParams.videoId);
        VideoEntity.view({id: $stateParams.videoId}, function (video) {
            $scope.video = video;
            $scope.editionTag.setVideo($scope.video);
            //PlayerData.setVideo(video);
            PlayerData.data.provider = video.provider_id;
            PlayerData.data.duration = video.duration;
            // When data are loaded we set in the editor the tag id to edit
            var loader = VideoTagData.getLoader();
            loader.setMode('append')
                    .loadAll()
                    .then(function () {
                        var data = loader.data;
                        if ($stateParams.tagId) {
                            console.log("Searching for tag " + $stateParams.tagId + " to edit among " + data.items.length + " items");
                            console.log(data);
                            for (var i = 0; i < data.items.length; i++) {
                                var item = data.items[i];
                                if (item.id == $stateParams.tagId) { // @warning $stateParams is a string
                                    console.log("Tag to edit found!");
                                    $scope.editionTag.fromVideoTag(item);
                                    PlayerData.playVideoTag($scope.editionTag.fromVideoTag(item)._video_tag);
                                    SharedData.pageLoader(false);
                                    return;
                                }
                            }
                            console.log("Cannot find tag to edit: " + $stateParams.tagId);
                        }

                        VideoTagData.setCurrentTag($scope.editionTag._video_tag);
                        playVideo(video);
                    });
        }, onError);
    }

    function onError(error) {
        console.log("Error viewing this tag");
        console.log(error);
        $state.go('notfound');
    }


    function playVideo(video, repeat) {
        PlayerData.stopLooping();
        return PlayerData.loadVideo(video.provider_id, {video_url: video.video_url})
                .finally(function () {
                    SharedData.pageLoader(false);
                })
                .catch(onError);
    }
}
