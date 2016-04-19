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
        .controller('MainController', MainController)
        .run(Run);

ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance'];
function ModalInstanceCtrl($scope, $uibModalInstance) {
    $scope.ok = function () {
        $uibModalInstance.close('close');
    };
    $scope.cancel = function () {
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
        html2canvasURL: 'js/components/html2canvas/build/html2canvas.min.js'
    };

    $scope.$on('view-video-tag', function (event, tag) {
        console.log('MainController: Event view-video-tag');
        $scope.$broadcast('view-video-tag-broadcast', tag);
    });

    $scope.$on('on-search-item-selected', function (event, data) {
        // immediate search
        if (data.type === 'partial') {
            console.log("Start partial seach");
            $state.go('videoplayer.sport', {
                q: data.search
            });
        } else if (data.type === 'rider') {
            $state.go('videoplayer.rider', {rider_slug: data.slug});
        } else if (data.type === 'tag') {
            $state.go('videoplayer.tag', {tagSlug: data.slug});
        } else if (data.type === 'playlist') {
            $state.go('playlist', {playlistId: data.id});
        }
    });

    $scope.$on('on-playlist-title-clicked', function (event, playlist) {
        $state.go("playlist", {playlistId: playlist.id});
    });
}

Run.$inject = ['$rootScope', 'AuthenticationService', 'loginModal', '$state', 'SharedData', 'VideoTagData', '$stateParams'];
function Run($rootScope, AuthenticationService, loginModal, $state, SharedData, VideoTagData) {
    AuthenticationService.init();
    SharedData.init();

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
        SharedData.setCurrentSearch(null);

        if (toState.redirectTo) {
            event.preventDefault();
            $state.go(toState.redirectTo, toParams);
            return;
        }
        //console.log('$stateChangeStart: ' + event);
        var requireLogin = toState.data ? toState.data.requireLogin : false;

        if (requireLogin && !AuthenticationService.isAuthed()) {
            console.log('DENY USER ACCESS FOR THIS LOCATION');
            event.preventDefault();

            var wasLoading = SharedData.loadingState;
            SharedData.pageLoader(false);
            loginModal.open().result
                    .then(function () {
                        if (loginModal.isset()) {
                            console.log("Login success, continuing");
                            SharedData.pageLoader(wasLoading);
                            return $state.go(toState.name, toParams);
                        }
                    })
                    .catch(function () {
                        if (loginModal.isset()) {
                            console.log("Closing modal with catch");
                            return $state.go('home');
                        }
                    });
        } else {
            loginModal.dismiss();
        }
        SharedData.pageLoader(toState.data ? toState.data.pageLoader : false);

    });
    $rootScope.$on('$stateChangeSuccess',
            function (event, toState, toParams, fromState, fromParams) {
//        if (toState.data && toState.data.player){
                VideoTagData.updateSearch();
//        }
            });

}
