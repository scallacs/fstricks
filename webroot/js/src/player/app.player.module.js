angular.module('app.player', [
    'ui.router',
    'ngMessages',
    'app.core',
    'shared.youtube',
    'shared.vimeo',
    'shared',
    'angularUtils.directives.dirPagination',
    'infinite-scroll',
    'ui.bootstrap',
    'dndLists'
])
        .config(ConfigRoute)
        .controller('AddVideoController', AddVideoController)
        .controller('PlayerController', PlayerController)
        .controller('ViewVideoController', ViewVideoController)
        .controller('ViewTagController', ViewTagController)
        .controller('ViewSportController', ViewSportController)
        .controller('ViewRiderController', ViewRiderController)
        .controller('ViewSearchController', ViewSearchController)
        .controller('ViewRealizationController', ViewRealizationController)
        .controller('ViewValidationController', ViewValidationController)
        .controller('ViewPlaylistController', ViewPlaylistController)
        .controller('DashboardController', DashboardController)
        .controller('ManagePlaylistController', ManagePlaylistController)
        .controller('EditPlaylistController', EditPlaylistController)
        .controller('ModalPlaylistController', ModalPlaylistController);

ConfigRoute.$inject = ['$stateProvider'];
function ConfigRoute($stateProvider) {
    var baseUrl = 'js/src/player/partials/';

    $stateProvider
            .state('addvideo', {
                url: '/video/add',
                views: {
                    viewNavRight: {
                        template: ''//<h2 class="page-title">Add a video</h2>'
                    },
                    '': {
                        templateUrl: baseUrl + 'add-video.html',
                        controller: 'AddVideoController'
                    }
                },
                data: {
                    requireLogin: true,
                    pageLoader: false
                }
            })
            .state('dashboard', {
                url: '/my-tricks',
                controller: 'DashboardController',
                templateUrl: baseUrl + 'dashboard.html',
                data: {
                    requireLogin: true,
                    pageLoader: true
                }
            })
            .state('manageplaylist', {
                url: '/playlist/manage',
                controller: 'ManagePlaylistController',
                templateUrl: baseUrl + 'playlist-manage.html',
                data: {
                    requireLogin: true,
                    pageLoader: true
                }
            })
            .state('editplaylist', {
                url: '/playlist/edit/:playlistId',
                controller: 'EditPlaylistController',
                templateUrl: baseUrl + 'playlist-edit.html',
                data: {
                    requireLogin: true,
                    pageLoader: true
                }
            })
            .state('videoplayer', {
                url: '/player?order',
                views: {
                    viewNavRight: {
                        'template': '<div player-nav></div>'
                    },
                    '': {
                        templateUrl: baseUrl + 'player.html',
                        controller: 'PlayerController'
                    }
                },
                data: {
                    requireLogin: false,
                    pageLoader: true
                }
            })
            .state('videoplayer.sport', {
                url: '/sport/:sportName',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewSportController',
                        templateUrl: baseUrl + 'pick-video.html'
                    }
                }
            })
            .state('videoplayer.video', {
                url: '/video/:videoId',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewVideoController',
                        templateUrl: baseUrl + 'view-video.html'
                    }
                }
            })
            .state('videoplayer.tag', {
                url: '/trick/:tagSlug',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewTagController',
                        templateUrl: baseUrl + 'pick-video.html'
                    }
                }
            })
            .state('videoplayer.realization', {
                url: '/realization/:videoTagId',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewRealizationController'
                    }
                }
            })
            .state('videoplayer.validation', {
                url: '/validation',
                views: {
                    videoPlayerExtra: {
                        templateUrl: baseUrl + 'view-validation.html',
                        controller: 'ViewValidationController'
                    },
                }
            })
            .state('videoplayer.best', {
                url: '/best',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewSearchController',
                        templateUrl: baseUrl + 'pick-video.html'
                    }
                }
            })
            .state('videoplayer.playlist', {
                url: '/playlist/:playlistId?ids',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewPlaylistController',
                        templateUrl: baseUrl + 'playlist-view.html'
                    }
                }
            })
            .state('videoplayer.search', {
                url: '/search?tagName',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewSearchController',
                        templateUrl: baseUrl + 'pick-video.html'
                    }
                }
            })
            .state('videoplayer.rider', {
                url: '/rider/:riderId',
                views: {
                    videoPlayerExtra: {
                        controller: 'ViewRiderController',
                        templateUrl: baseUrl + 'view-rider.html'
                    }
                }
            });
}

DashboardController.$inject = ['$scope', 'PaginateDataLoader', 'SharedData', '$state'];
function DashboardController($scope, PaginateDataLoader, SharedData, $state) {

    $scope.workspaces = [
        {id: 'pending', name: "Pendings", active: true, filters: {status: 'pending', order: 'modified'}},
        {id: 'rejected', name: "Rejected", active: false, filters: {status: 'rejected,duplicate', order: 'modified'}},
        {id: 'official', name: "Officials", active: false, filters: {status: 'validated', order: 'modified'}},
    ];

    $scope.onWorkspace = onWorkspaceChanged;

    init();

    $scope.$on('view-video-tag', function(event, data) {
        $state.go('videoplayer.realization', {
            videoTagId: data.id
        });
    });

    function init() {
        //var totalTags = currentUser.count_tags_validated + currentUser.count_tags_rejected;
        //$scope.currentUser = currentUser;
        //$scope.performance = totalTags > 0 
        //    ? (currentUser.count_tags_validated / totalTags) 
        //    : "Not yet";

        for (var i = 0; i < $scope.workspaces.length; i++) {
            var workspace = $scope.workspaces[i];
            workspace.loader = PaginateDataLoader
                    .instance(workspace.id)
                    .setFilters(workspace.filters)
                    .setFilter('only_owner', true)
                    .setMode('replace')
                    .setLimit(10);
        }
        $scope.workspaces[0]
                .loader
                .startLoading()
                .then(function() {
                    SharedData.pageLoader(false);
                })
                .catch(function() {
                    // TODO 
                });
    }

    function onWorkspaceChanged(workspace) {
        workspace.loader.startLoading();
    }
}

AddVideoController.$inject = ['$scope', 'ProviderVideoInfo', '$state', 'VideoEntity', 'VideoTagEntity', 'ServerConfigEntity', 'SharedData'];
function AddVideoController($scope, ProviderVideoInfo, $state,
        VideoEntity, VideoTagEntity, ServerConfigEntity, SharedData) {

    var videosInCache = {};
    $scope.data = {provider_id: null, video_url: null};
    $scope.playerProviders = [];
    $scope.add = add;
    $scope.isFormLoading = false;
    $scope.videoPerPage = 5;
    $scope.totalVideos = 0; // todo
    $scope.isHistoryLoading = false;

    /**
     * false means we still didnt get respnse from the server
     * [] when received
     */
    $scope.recentVideos = false;

    $scope.pageChanged = function(newPage) {
        loadRecentlyTagged(newPage);
    };

    init();

    ServerConfigEntity.rules().then(function(rules) {
        $scope.playerProviders = rules.videos.provider_id.values;
        $scope.data.provider_id = rules.videos.provider_id.values[0].code;
        console.log("Default provider: " + rules.videos.provider_id.values[0].code);
    });

    function init() {
        SharedData.pageLoader(false);
        loadRecentlyTagged(1);
    }

    function add(data) {
        var providerInfo = ProviderVideoInfo.get(data.provider_id);
        if (providerInfo.extractIdFromUrl(data.video_url)) {
            data.video_url = providerInfo.extractIdFromUrl(data.video_url);
        }

        var promise = $scope.addVideoForm.submit(VideoEntity.addOrGet(data).$promise);
        promise.then(function(response) {
            if (response.success) {
                $state.go('addtag', {videoId: response.data.id});
            }
        });
    }

    function loadRecentlyTagged(page) {
        if (videosInCache[page]) {
            $scope.recentVideos = videosInCache[page];
            return;
        }
        $scope.isHistoryLoading = true;

        VideoTagEntity.recentlyTagged({page: page}, function(response) {
            console.log("Set total video: " + response.total);
            $scope.totalVideos = response.total;
            $scope.videoPerPage = response.perPage;
            var items = response.items;
            angular.forEach(items, function(video) {
                var providerFactory = ProviderVideoInfo.get(video.provider_id);
                providerFactory
                        .create()
                        .addPart('snippet')
                        .setVideos([video.video_url])
                        .load()
                        .then(function(data) {
                            video.provider_data = providerFactory.createItem(data);
                        });
            });

            $scope.recentVideos = items;
            videosInCache[page] = items;
        }).$promise.finally(function() {
            $scope.isHistoryLoading = false;
        });
    }

}

PlayerController.$inject = ['$scope', 'PlayerData'];
function PlayerController($scope, PlayerData) {
    PlayerData.showViewMode();
    PlayerData.showListTricks = true;

    $scope.$on('view-video-tag', function(event, tag) {
        event.stopPropagation();
//        $state.transitionTo($state.$current, {realization: tag.id}, {notify: false, reload: false});
        PlayerData.playVideoTag(tag);
    });

//    if (angular.isDefined($stateParams.realization)) {
//        console.log('Realization for player: ' + $stateParams.realization);
//    }
}

ViewRealizationController.$inject = ['VideoTagData', '$stateParams', 'PlayerData', 'SharedData', '$state'];
function ViewRealizationController(VideoTagData, $stateParams, PlayerData, SharedData, $state) {
    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.showListTricks = false;
    VideoTagData
            .getLoader()
            .setFilters({video_tag_id: $stateParams.videoTagId, status: 'rejected,pending,validated'})
            .startLoading()
            .then(function(results) {
                if (results.items.length === 1) {
                    PlayerData.playVideoTag(results.items[0]).then(function() {
                        SharedData.pageLoader(false);
                    });
                }
                else {
                    $state.go('notfound');
                }
            })
            .catch(function() {
                SharedData.pageLoader(false);
            });
}

ViewTagController.$inject = ['VideoTagData', '$stateParams', 'PlayerData', 'SharedData'];
function ViewTagController(VideoTagData, $stateParams, PlayerData, SharedData) {
    PlayerData.showViewMode();
    PlayerData.stop();
    VideoTagData.getLoader().setFilters({tag_slug: $stateParams.tagSlug, order: $stateParams.order});
    VideoTagData.getLoader().startLoading().then(function(results) {
        if (results.length === 1) {
            PlayerData.showListTricks = false;
            PlayerData.playVideoTag(results[0]);
        }
    }).finally(function() {
        SharedData.pageLoader(false);
    });
}

ViewSportController.$inject = ['VideoTagData', '$stateParams', 'PlayerData', 'SharedData'];
function ViewSportController(VideoTagData, $stateParams, PlayerData, SharedData) {
//    console.log("View sport: " + $stateParams.sportName);
    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.showListTricks = true;
    console.log("Viewing sport: " + $stateParams.sportName);
    VideoTagData.getLoader().setFilters({sport_name: $stateParams.sportName, order: $stateParams.order});
    VideoTagData.getLoader().startLoading().finally(function() {
        SharedData.pageLoader(false);
    });
}

ViewRiderController.$inject = ['$scope', 'VideoTagData', '$stateParams', 'PlayerData', 'SharedData', 'RiderEntity'];
function ViewRiderController($scope, VideoTagData, $stateParams, PlayerData, SharedData, RiderEntity) {
    $scope.rider = {id: $stateParams.riderId};

    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.showListTricks = false;
    VideoTagData.getLoader().setFilters({rider_id: $stateParams.riderId, order: $stateParams.order});
    VideoTagData.getLoader().startLoading().finally(function() {
        SharedData.pageLoader(false);
    });

    RiderEntity.profile({id: $stateParams.riderId}, function(rider) {
        console.log(rider);
        $scope.rider = rider;
    });
}

ViewSearchController.$inject = ['VideoTagData', '$stateParams', 'PlayerData', 'SharedData'];
function ViewSearchController(VideoTagData, $stateParams, PlayerData, SharedData) {
    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.showListTricks = true;
    
    
//    console.log($stateParams);
    VideoTagData.reset();
    VideoTagData.getLoader()
            .setOrder($stateParams.order)
            .setFilter('tag_name', $stateParams.tagName)
            .setFilter('sport_id', SharedData.currentSport ? SharedData.currentSport.id : null)
            .startLoading()
            .finally(function() {
                SharedData.pageLoader(false);
            });
}

ViewPlaylistController.$inject = ['$scope', 'VideoTagData', '$stateParams', 'PlayerData', 'SharedData', 'PlaylistItemEntity'];
function ViewPlaylistController($scope, VideoTagData, $stateParams, PlayerData, SharedData, PlaylistItemEntity) {
    PlayerData.stop();
    VideoTagData.reset();
    PlayerData.showViewMode();
    PlayerData.showListTricks = false;
    PlayerData.playMode = 'playlist';
    $scope.playlist = false;

    var loader = VideoTagData.getLoader();
    if ($stateParams.playlistId) {
        loader.setResource(PlaylistItemEntity.playlist)
                .setFilter('id', $stateParams.playlistId);
    }
    else if ($stateParams.ids) {
        loader.setFilter('video_tag_ids', $stateParams.ids);
    }

    loader.startLoading()
            .then(function() {
                $scope.playlist = loader.data.extra.playlist;
            })
            .finally(function() {
                SharedData.pageLoader(false);
            });

    $scope.startPlaylist = startPlaylist;

    function startPlaylist() {
        if (VideoTagData.getItems().length > 0) {
            PlayerData.playVideoTag(VideoTagData.getItems()[0], false);
        }
    }
}


ViewVideoController.$inject = ['$scope', 'VideoTagData', 'PlayerData', '$stateParams', 'SharedData', '$state'];
function ViewVideoController($scope, VideoTagData, PlayerData, $stateParams, SharedData, $state) {

    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.onCurrentTimeUpdate = onCurrentTimeUpdate;
    PlayerData.showListTricks = false;
    PlayerData.playMode = 'video';
    $scope.video = {
        id: $stateParams.videoId
    };

    VideoTagData.getLoader()
            .setFilters({video_id: $stateParams.videoId, order: 'begin_time'})
            .startLoading()
            .then(autoPlayVideo)
            .catch(function() {
                SharedData.pageLoader(false);
            });

    // TODO only for first page

    function onCurrentTimeUpdate(newVal) {
        PlayerData.updateCurrentTag(newVal);
    }

    function autoPlayVideo(response) {
        console.log("Autho play video");
        if (response.items.length > 0) {
            var first = response.items[0];
            PlayerData.loadVideo({
                provider: first.provider_id,
                video_url: first.video_url
            }).finally(function() {
                SharedData.pageLoader(false);
            });
            $scope.videoDuration = first.video_duration;
            $scope.videoTags = response.items;
//                YoutubeVideoInfo.snippet(response[0].video_url, function(data) {
//                    //console.log(data);
//                    if (data !== null) {
//                        PlayerData.title = data.title;
//                    }
//                    else {
//                        PlayerData.title = '';
//                    }
//                });
        }
        else {
            console.log("This video has no trick");
            $state.go('notfound');
        }
    }
}

// TODO add current sport ...
ViewValidationController.$inject = ['$scope', 'VideoTagData', 'PlayerData', 'SharedData', '$state', 'VideoTagEntity', 'VideoTagAccuracyRateEntity'];
function ViewValidationController($scope, VideoTagData, PlayerData, SharedData, $state, VideoTagEntity, VideoTagAccuracyRateEntity) {
    var skipped = [];

    PlayerData.stop();
    PlayerData.showValidationMode();
    PlayerData.showListTricks = false;
    VideoTagData.reset();
    VideoTagData.mode = 'validation';
    loadNext();

    $scope.rateAccurate = rateAccurate;
    $scope.rateFake = rateFake;
    $scope.skip = skip;

    function rateAccurate() {
        $scope.isButtonsLoading = true;
        VideoTagAccuracyRateEntity.accurate({
            video_tag_id: VideoTagData.currentTag.id
        });
        skipped.push(VideoTagData.currentTag.id);
        toNextTag();
    }

    function rateFake() {
        VideoTagAccuracyRateEntity.fake({
            video_tag_id: VideoTagData.currentTag.id
        });
        skipped.push(VideoTagData.currentTag.id);
        toNextTag()
    }

    function skip() {
        VideoTagAccuracyRateEntity.skip({
            video_tag_id: VideoTagData.currentTag.id
        });
        skipped.push(VideoTagData.currentTag.id);
        PlayerData.pause();
        toNextTag();
    }

    function toNextTag() {
        PlayerData.pause();
        SharedData.pageLoader(true);
        loadNext();
    }

    function loadNext() {
        SharedData.pageLoader(true);
        return VideoTagEntity
                .validation({skipped: skipped.join(','), sport_id: SharedData.currentSport ? SharedData.currentSport.id : null})
                .$promise
                .then(successLoadCallback)
                .catch(function() {
                    $state.go('home');
                });
    }

    function successLoadCallback(tags) {
        VideoTagData.getLoader().data.items = tags;
        if (tags.length === 1) {
            PlayerData
                    .playVideoTag(tags[0], true)
                    .finally(function() {
                        SharedData.pageLoader(false);
                    });
        }
        else {
            VideoTagData.currentTag = null;
            SharedData.pageLoader(false);
        }
    }
}

ManagePlaylistController.$inject = ['$scope', 'PlaylistEntity', 'SharedData', 'PaginateDataLoader'];
function ManagePlaylistController($scope, PlaylistEntity, SharedData, PaginateDataLoader) {
    $scope.removeOptions = {trigger: '.btn-remove-item', 'controller': 'Playlists', confirm: true, wait: false};

    $scope.loader = PaginateDataLoader.instance('playlist')
            .setResource(PlaylistEntity.user)
            .setMode('replace');

    $scope.loader
            .startLoading()
            .finally(function() {
                SharedData.pageLoader(false);
            });

}

EditPlaylistController.$inject = ['$scope', 'PaginateDataLoader', 'PlaylistItemEntity', 'SharedData', '$stateParams'];
function EditPlaylistController($scope, PaginateDataLoader, PlaylistItemEntity, SharedData, $stateParams) {
    $scope.removeOptions = {wait: false, controller: 'PlaylistVideoTags', trigger: '.btn-remove-item', confirm: false};
    $scope.showEditionForm = false;
    loadItems();
    $scope.selectedVideoTag = null;
    $scope.onDrop = onDrop;

    function loadItems() {
        $scope.loader = PaginateDataLoader.instance('playlist-edit')
                .init()
                .setResource(PlaylistItemEntity.playlist)
                .setMode('append')
                .setFilter('id', $stateParams.playlistId)
//                .setFilter('playlist', true)
                .setLimit(20);

        $scope.loader
                .startLoading()
                .then(function(results) {
                    $scope.playlist = results.extra.playlist;
                })
                .finally(function() {
                    SharedData.pageLoader(false);
                });
    }

    $scope.$on('on-playlist-form-cancel', function(event) {
        $scope.showEditionForm = false;
        event.stopPropagation();
    });
    $scope.$on('on-playlist-saved', function(event, playlist) {
        $scope.playlist = playlist;
        $scope.showEditionForm = false;
        event.stopPropagation();
    });
//    $scope.$on('on-item-removed', function(event, playlist) {
//        $scope.playlist = playlist;
//        $scope.showEditionForm = false;
//        event.stopPropagation();
//    });

    function onDrop(event, $index, item, type, external) {
        PlaylistItemEntity.edit({
            playlist_id: $scope.playlist.id,
            video_tag_id: item.id,
            position: $index
        });
        return item;
    }
}

ModalPlaylistController.$inject = ['$scope', '$uibModalInstance', 'PlaylistEntity', 'PlaylistItemEntity',
    'videoTag', 'toaster', 'PaginateDataLoader'];
function ModalPlaylistController($scope, $uibModalInstance, PlaylistEntity, PlaylistItemEntity,
        videoTag, toaster, PaginateDataLoader) {
    $scope.videoTag = videoTag;
    $scope.playlists = [];
    $scope.showAddPlaylistForm = false;
    $scope.ok = ok;
    $scope.cancel = cancel;
    $scope.toggleForm = function() {
        $scope.showAddPlaylistForm = !$scope.showAddPlaylistForm;
    };
    $scope.addToPlaylist = addToPlaylist;
    $scope.loader = PaginateDataLoader.instance('playlist')
            .setResource(PlaylistEntity.user)
            .setMode('replace')
            .setLimit(12);


    $scope.$on('on-playlist-saved', function(event, playlist) {
        $scope.showAddPlaylistForm = false;
        addToPlaylist(playlist);
        $scope.loader.prepend(playlist);
        $uibModalInstance.close($scope.videoTag);
    });

    $scope.$on('on-playlist-title-clicked', function(event, playlist) {
        event.stopPropagation();
        console.log('on-playlist-title-clicked');
        addToPlaylist(playlist);
    });

    loadPlaylists();

    function ok() {
        $uibModalInstance.close($scope.videoTag);
    }
    function cancel() {
        $uibModalInstance.dismiss('cancel');
    }

    function loadPlaylists() {
        $scope.loader
                .startLoading()
                .finally(function() {

                });
    }

    function addToPlaylist(playlist) {
        PlaylistItemEntity.add({
            video_tag_id: videoTag.id,
            playlist_id: playlist.id
        }, function(result) {
            if (result.success) {
                playlist.count_tags += 1;
            }
        }, function(){
            // TODO remove playlist
        });
        toaster.pop('success', 'Added to the playlist!');
        ok();
    }
}
