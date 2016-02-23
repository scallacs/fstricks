angular.module('app.player')
        .directive('playerContainer', playerContainer);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function playerContainer($window, $timeout, $rootScope) {
    return {
        templateUrl: 'js/src/player/partials/player-container.html',
        controller: function($scope, PlayerData, VideoTagData) {
            $scope.playerData = PlayerData;
            $scope.videoTagData = VideoTagData;
            $scope.nextTrick = nextTrick;
            $scope.prevTrick = prevTrick;

            function nextTrick() {
                if (VideoTagData.hasNext()) {
                    console.log("Next trick");
                    var tag = VideoTagData.next();
                    if (tag !== null) {
                        $scope.$emit('view-video-tag', tag);
                        PlayerData.playVideoTag(tag);
                    }
                }
            }
            function prevTrick() {
                if (VideoTagData.hasPrev()) {
                    console.log("Prev trick");
                    var tag = VideoTagData.prev();
                    if (tag !== null) {
                        $scope.$emit('view-video-tag', tag);
                        PlayerData.playVideoTag(tag);
                    }
                }
            }

        },
        link: function(scope, element, attr) {
            var w = angular.element($window);
            var header = angular.element('header');

            scope.getWindowDimensions = function() {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };
            scope.$watch(scope.getWindowDimensions, function(newValue, oldValue) {
                applyHeight(newValue);
            }, true);

//            w.bind('resize', function() {
//                scope.$apply();
//            });
            
            // Wait that dom is loaded to resize
            
            $rootScope.$on('notity-player-offset', function(){
                console.log("notity-player-offset");
                applyHeight({
                    h: w.height(),
                    w: w.width()
                });
            });
            
            function applyHeight(newValue){
                element.find('.iframe-wrapper').attr('style', 'height:' + computeHeight(newValue.h, newValue.w) + 'px');
            }
            function computeHeight(h, w) {
                var offsetsContainer = $('.player-offset').outerHeight();
                var offsetH = header.height() + offsetsContainer;
                var maxHeight = (h - offsetH);
                var heigth = (w) * (9 / 16);
                var newHeight = Math.min(heigth, maxHeight);
                console.log("New max height : " + newHeight);
                return newHeight;
            }
        }
    };

}
