angular.module('app', [
    'ngResource',
    'ui.router',
    'app.core',
    'app.player',
    'app.layout',
    'app.account',
    'app.config',
    'app.config.api',
    'app.rider',
    'app.tag',
    'app.page',
    'app.routes',
    'toaster',
    'viewhead'
])
        .controller('ModalInstanceCtrl', ModalInstanceCtrl)
        .controller('MainController', MainController);

ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance'];
function ModalInstanceCtrl($scope, $uibModalInstance) {
    $scope.ok = function() {
        $uibModalInstance.close('close');
    }; 
    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };
}

MainController.$inject = ['$scope', 'PlayerData', 'VideoTagData', 'SharedData', 'AuthenticationService', '$state'];
function MainController($scope, PlayerData, VideoTagData, SharedData, AuthenticationService, $state) {
    $scope.playerData = PlayerData;
    $scope.videoTagData = VideoTagData;
    $scope.SharedData = SharedData;
    $scope.authData = AuthenticationService.authData;
    $scope.config = __WebsiteConfig__;
    $scope.PathConfig = __PathConfig__;
//    $scope.seo = Seo;
    $scope.feedbackOptions = {
        ajaxURL: __APIConfig__.baseUrl + 'feedbacks/send.json',
        html2canvasURL : 'js/components/html2canvas/build/html2canvas.min.js'
    };

    $scope.$on('view-video-tag', function(event, tag) {
        console.log('MainController: Event view-video-tag');
        $scope.$broadcast('view-video-tag-broadcast', tag);
    });

    $scope.$on('on-search-item-selected', function(event, data) {
        // immediate search
        if (data.type === 'search') {
            console.log("Start partial seach");
            $state.go('videoplayer.sport', {
                q: data.q
            });
        }
        else if (data.type === 'rider') {
            $state.go('videoplayer.rider', {riderId: data.slug});
        }
        else if (data.type === 'tag') {
            $state.go('videoplayer.tag', {tagSlug: data.slug});
        }
        else if (data.type === 'playlist') {
            $state.go('playlist', {playlistId: data.id});
        }
    });

    $scope.$on('on-playlist-title-clicked', function(event, playlist) {
        $state.go("playlist", {playlistId: playlist.id});
    });
}
