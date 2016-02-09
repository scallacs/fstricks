angular
        .module('app.rider', ['ng-flow', 'ngRoute'])
        .config(ConfigRouting)
        .controller('RiderProfileController', RiderProfileController);

ConfigRouting.$inject = ['$routeProvider'];
function ConfigRouting($routeProvider) {
    $routeProvider
            .when('/profile/:riderId', {
                templateUrl: HTML_FOLDER + 'Riders/profile.html',
                controller: 'RiderProfileController'
            })
            .when('/profile', {
                templateUrl: HTML_FOLDER + 'Riders/profile.html',
                controller: 'RiderProfileController'
            });
}

RiderProfileController.$inject = ['$scope', '$routeParams', 'AuthenticationService', 'SharedData', 'RiderEntity', 'VideoTagData', 'PlayerData', '$location'];
function RiderProfileController($scope, $routeParams, AuthenticationService, SharedData, RiderEntity, VideoTagData, PlayerData, $location) {
    if (!$routeParams.riderId) {
        AuthenticationService.requireLogin();
    }

    SharedData.profileLoaded = false;
    PlayerData.hide();
    // =========================================================================
    // Properties
    $scope.SharedData = SharedData;
    $scope.editionMode = false;
    $scope.isCurrentUserProfile = false;
    $scope.rider = {id: null};
    $scope.hasRiderProfile = hasRiderProfile;
    $scope.$on("rider-selected", function(event, rider) {
        if (rider === null) {
            cancelEditionMode();
        }
        else {
            //               console.log(rider);
            $scope.editionMode = false;
            $scope.rider = rider;
        }
    });
    $scope.$watch("rider.id", function(val) {
        if (val > 0) {
            SharedData.loadingState = 0;
        }
    });
    // =========================================================================
    // Init
    function loadProfile(riderId) {
        RiderEntity.profile({id: riderId}, function(rider) {
            $scope.rider = rider;
            $scope.profileLoaded = true;
        }, function() {
            $location.path("/");
        });
//                        .$promise.finally(function() {
//                    SharedData.loadingState = 0;
//                });
    }

    function init() {
        var riderId = null;
        if ($routeParams.riderId) {
            riderId = $routeParams.riderId;
        }
        loadProfile(riderId);
    }
    init();
    // =========================================================================
    // Form
    function hasRiderProfile() {
        return $scope.rider.firstname != null;
    }
    // =========================================================================
    // scope

    $scope.startEditionMode = function() {
        $scope.editionMode = true;
    };
    function cancelEditionMode() {
        $scope.editionMode = false;
    }

    $scope.isEditabled = function() {
        return !hasRiderProfile() || $scope.rider.user_id === AuthenticationService.getCurrentUser().id;
    };
    $scope.viewVideos = function() {
        PlayerData.show();
        VideoTagData.setFilter('rider_id', $scope.rider.id);
        VideoTagData.setOrder('created');
        VideoTagData.loadNextPage();
    };
}
