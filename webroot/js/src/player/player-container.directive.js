angular.module('app.player')
        .directive('playerContainer', playerContainer);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function playerContainer($window) {
    return {
        templateUrl: 'js/src/player/partials/player-container.html',
        controller: function($scope, PlayerData, VideoTagData) {
            $scope.playerData = PlayerData;
            $scope.videoTagData = VideoTagData;
        },
        link: function(scope, element, attr) {
            // Player container must not be taller thant the window size
            var w = angular.element($window);
            var header = angular.element('header');
            var playerBar = angular.element('div[player-bar]');
            scope.$watch(function() {
                return {h: w.height()};
            }, function(newValue, oldValue) {
                var offsetH = header.height() + playerBar.height();
                scope.windowHeight = newValue.h;
//                console.log(scope.windowHeight);
                
                scope.resizeWithOffset = function(){
                    var newHeight = (newValue.h - offsetH);
//                    console.log("New max height : " + newHeight);
                    scope.$eval(attr.notifier);
                    return {maxHeight: newHeight + 'px'};
                };

            }, true);

            w.bind('resize', function() {
                scope.$apply();
            });
        }
    };

}
