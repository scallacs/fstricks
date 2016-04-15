angular.module('app.admin')
//        .controller('VideoTagsController', VideoTagsController)
        //.controller('VideoTagIndexController', VideoTagIndexController)
        .controller('VideoTagEditController', VideoTagEditController);



VideoTagEditController.$inject = ['$scope', '$location', 'Restangular', 'SharedData', '$stateParams', 'EditionTag', '$state', 'VideoTagData', 'PlayerData'];
function VideoTagEditController($scope, $location, Restangular, SharedData, $stateParams, EditionTag, $state, VideoTagData, PlayerData) {
    var restApi = Restangular.setBaseUrl(__AdminAPIConfig__.baseUrl);
    
    SharedData.pageLoader(false);
    $scope.user = false;
    var id = $stateParams.id;

    var editionTag = new EditionTag(null, {}, 'admin', {
        min_duration: 2,
        max_duration: 40, 
        similar_tag_limit_ratio: 0.6
    });
    
    editionTag
        .onApiCall('add', function(data){
            return editionTag._form.submit(restApi.all('video-tags').customPOST(data));
        })
        .onApiCall('edit', function(data){
            return editionTag._form.submit(restApi.one('video-tags', data.id).customPUT(data));
        })
        .onApiCall('delete', function(data){
            return editionTag._form.submit(restApi.one('video-tags', data.id).remove());
        });
        
    $scope.editionTag = editionTag;
    
    restApi
            .one('video-tags', id)
            .get()
            .then(function(result) {
                if (result.statusText) result = result.data; // TODO change quick fix
                $scope.video = {
                    video_url: result.video_url,
                    id: result.video_id,
                    provider_id: result.provider_id,
                    duration: parseInt(result.video_duration)
                };
                $scope.editionTag.fromVideoTag(result);
                $scope.editionTag.setVideo($scope.video);
                
                VideoTagData.getLoader().add(result);
                VideoTagData.setCurrentTag(result);
                PlayerData.data.duration = $scope.video.duration;

                PlayerData.playVideoTag(result);

                if (result.user_id) {
                    loadUser(result.user_id);
                }

                SharedData.pageLoader(false);
            })
            .catch(function() {
               $location.path('/video-tags/list');
            });

    function loadUser(id) {
        restApi.one('users', id).get().then(function(result) {
            console.log(result);
            $scope.user = result;
        });
    }
    
    $scope.$on('on-video-tag-remove', function() {
        $location.path('/video-tags/list');
    });
}

