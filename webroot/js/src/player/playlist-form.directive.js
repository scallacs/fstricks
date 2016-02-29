angular.module('app.player')
        .directive('playlistForm', function() {
            return {
                restrict: 'EA',
                templateUrl: 'js/src/player/partials/playlist-form.html',
                scope: {
                    playlist: '='
                },
                controller: function($scope, PlaylistEntity) {
                    $scope.availableStatus = [
                        {code: 'public', name: 'Public', icon: 'world'},
                        {code: 'private', name: 'Private', icon: 'private'}
                    ];

                    $scope.addPlaylist = addPlaylist;

                    if (!$scope.playlist) {
                        $scope.playlist = {
                            status: 'public'
                        };
                    }

                    function addPlaylist(playlist) {
                        $scope.addPlaylistForm.submit(PlaylistEntity.add(playlist).$promise)
                                .then(function(response) {
                                    if (response.success) {
                                        $scope.$emit('on-playlist-save', response);
                                    }
                                });
                    }
                }
            };

        });