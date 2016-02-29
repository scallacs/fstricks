angular.module('app.player')
        .directive('playlistForm', function() {
            return {
                restrict: 'EA',
                templateUrl: 'js/src/player/partials/playlist-form.html',
                scope: {
                    playlistOrigin: '=playlist'
                },
                link: function(scope, elem, attr) {
                    scope.playlist = {
                        status: 'public',
                        id: false
                    };
                    scope.$watch('playlistOrigin', function() {
                        console.log(scope.playlistOrigin);
                        scope.playlist = angular.copy(scope.playlistOrigin);
                    });
                },
                controller: ['$scope', 'PlaylistEntity', function($scope, PlaylistEntity) {
                    $scope.availableStatus = [
                        {code: 'public', name: 'Public', icon: 'world'},
                        {code: 'private', name: 'Private', icon: 'private'}
                    ];

                    $scope.save = save;
                    $scope.cancel = cancel;

                    function save(playlist) {
                        var method = playlist.id ? PlaylistEntity.edit : PlaylistEntity.add;
                        $scope.addPlaylistForm.submit(method(playlist).$promise)
                                .then(function(response) {
                                    if (response.success) {
                                        if (!playlist.id) {
                                            playlist.id = response.data.playlist_id;
                                            playlist.count_tags = 0;
                                            playlist.created = new Date(); 
                                        }
                                        $scope.$emit('on-playlist-saved', playlist);
                                    }
                                });
                    }

                    function cancel() {
                        $scope.$emit('on-playlist-form-cancel');
                    }
                }]
            };

        });