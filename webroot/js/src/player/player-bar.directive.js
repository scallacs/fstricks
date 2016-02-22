angular.module('app.player')
        .directive('playerBar', playerBar);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function playerBar() {
    return {
        scope: {
            videoTags: '=videoTags',
            duration: '=duration'
        },
        templateUrl: 'js/src/player/partials/player-bar.html',
        controller: function($scope, VideoTagData) {
            $scope.options = {
                popoverTemplateUrl:  'js/src/player/partials/popover-video-tag.html'
            };
            $scope.view = view;
            $scope.computeStyle = computeStyle;
            $scope.videoTagData = VideoTagData;
            
            function view(tag){
                $scope.$emit('view-video-tag', tag);
            }
            
            
            function computeStyle(tag){
                return {
                    width: computeWidth(tag) + "%",
                    marginLeft: computeMargin(tag) + "%"
                };
            }
            
            function computeMargin(tag) {
                var margin = (tag.begin / $scope.duration) * 100;
                return margin;
            }
            function computeWidth(tag) {
                var width = ((tag.end - tag.begin) / $scope.duration) * 100;
                return width;
            }
            
        },
        link: function(scope, elem, attr) {
            
        }
    };

}
