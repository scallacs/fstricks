angular.module('app.player', [
    'ui.router',
    'ngMessages',
    'app.core',
    'shared.youtube',
    'shared.vimeo',
    'shared',
    'angularUtils.directives.dirPagination',
//    'infinite-scroll',
    'ui.bootstrap',
    'dndLists'
])
        .controller('AddVideoController', AddVideoController)
        .controller('PlayerController', PlayerController)

        .controller('ViewVideoController', ViewVideoController)
        .controller('ViewTagController', ViewTagController)
        .controller('ViewSportController', ViewSportController)
        .controller('ViewRiderController', ViewRiderController)
        .controller('ViewRealizationController', ViewRealizationController)

        .controller('PlaylistPlayerController', PlaylistPlayerController)
        .controller('ViewValidationController', ViewValidationController)
        .controller('StartValidationController', StartValidationController)
        .controller('ViewPlaylistController', ViewPlaylistController)
        .controller('MyTricksController', MyTricksController)
        .controller('ManagePlaylistController', ManagePlaylistController)
        .controller('EditPlaylistController', EditPlaylistController)
        .controller('ModalPlaylistController', ModalPlaylistController);

MyTricksController.$inject = ['$scope', 'PaginateDataLoader', 'SharedData', '$state', 'VideoTagEntity', 'ApiFactory'];
function MyTricksController($scope, PaginateDataLoader, SharedData, $state, VideoTagEntity, ApiFactory) {

    $scope.removeOptions = {
        trigger: '.btn-remove-item',
        endpoint: ApiFactory.endpoint('VideoTags', 'delete').remove,
        confirm: true,
        wait: false
    };

    $scope.workspaces = [
        {id: 'pending', name: "Pendings", removable: true, active: true, filters: {status: 'pending', order: 'modified'}},
        {id: 'rejected', name: "Rejected", active: false, filters: {status: 'rejected,duplicate', order: 'modified'}},
        {id: 'official', name: "Officials", active: false, filters: {status: 'validated', order: 'modified'}},
    ];

    $scope.onWorkspace = onWorkspaceChanged;

    init();

    $scope.$on('view-video-tag', function (event, data) {
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
                    .instance(workspace.id, VideoTagEntity.search)
                    .setFilters(workspace.filters)
                    .setFilter('only_owner', true)
                    .setMode('replace')
                    .setLimit(10);
        }
        $scope.workspaces[0]
                .loader
                .startLoading()
                .then(function () {
                    SharedData.pageLoader(false);
                })
                .catch(function () {
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

    $scope.pageChanged = function (newPage) {
        loadRecentlyTagged(newPage);
    };

    init();

    ServerConfigEntity.rules().then(function (rules) {
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
        promise.then(function (response) {
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

        VideoTagEntity.recentlyTagged({page: page}, function (response) {
            console.log("Set total video: " + response.total);
            $scope.totalVideos = response.total;
            $scope.videoPerPage = response.perPage;
            var items = response.items;
            angular.forEach(items, function (video) {
                var providerFactory = ProviderVideoInfo.get(video.provider_id);
                providerFactory
                        .create()
                        .addPart('snippet')
                        .setVideos([video.video_url])
                        .load()
                        .then(function (data) {
                            video.provider_data = providerFactory.createItem(data);
                        });
            });

            $scope.recentVideos = items;
            videosInCache[page] = items;
        }).$promise.finally(function () {
            $scope.isHistoryLoading = false;
        });
    }

}

PlayerController.$inject = ['$scope', 'PlayerData'];
function PlayerController($scope, PlayerData) {

    $scope.$on('play-video-tag', function (event, tag) {
        event.stopPropagation();
//        $state.transitionTo($state.$current, {realization: tag.id}, {notify: false, reload: false});
        PlayerData.playVideoTag(tag);
        PlayerData.startLooping();
    });

    $scope.$on('on-category-changed', function (event, category) {
        console.log("Received 'on-category-changed'");
    });
}

ViewRealizationController.$inject = ['$scope', 'VideoTagData', '$stateParams', 'PlayerData', 'SharedData', '$state', 'TopSearchMapper'];
function ViewRealizationController($scope, VideoTagData, $stateParams, PlayerData, SharedData, $state, TopSearchMapper) {
    SharedData.setCurrentCategory(null);

    var videoTagId = $stateParams.videoTagId.split('-')[0];

    VideoTagData
            .getLoader()
            .setFilters({video_tag_id: videoTagId})
            .startLoading()
            .then(function (results) {
                if (results.items.length === 1) {
                    var videoTag = results.items[0];
                    $scope.videoTag = videoTag;
                    PlayerData.playVideoTag(videoTag).then(function () {
                        SharedData.pageLoader(false);
                        console.log(videoTag);
                        VideoTagData.addPermanentFilter(TopSearchMapper('tag', videoTag), false);
                    });
                } else {
                    $state.go('notfound');
                }
            })
            .catch(function () {
                $state.go('notfound');
            });
}

ViewTagController.$inject = ['$scope', 'VideoTagData', '$stateParams', 'PlayerData', 'SharedData', 'TopSearchMapper'];
function ViewTagController($scope, VideoTagData, $stateParams, PlayerData, SharedData, TopSearchMapper) {
    SharedData.currentSearch.category = 'Trick';
    SharedData.setCurrentCategory(null);

    VideoTagData.getLoader()
            .setFilters({tag_slug: $stateParams.tagSlug, order: $stateParams.order})
            .startLoading()
            .then(function (results) {
                if (results.items.length > 0) {
                    var firstTag = results.items[0];
                    $scope.tag = firstTag.tag;
                    VideoTagData.addPermanentFilter(TopSearchMapper('tag', firstTag.tag), false);

                    // Auto play if there is only one realization for the trick
                    if (results.items.length === 1) {
                        PlayerData.showTricksMenu(false);
                        PlayerData.playVideoTag(firstTag);
                    }
                }
                // TODO no tags yet
            })
            .finally(function () {
                SharedData.pageLoader(false);
            });

}

ViewSportController.$inject = ['$scope', 'VideoTagData', '$stateParams', 'PlayerData', 'SharedData', 'TopSearchMapper', '$filter'];
function ViewSportController($scope, VideoTagData, $stateParams, PlayerData, SharedData, TopSearchMapper, $filter) {

    var sportSlug = $stateParams.sportSlug;
    var categorySlug = $stateParams.category;

    console.log("Viewing sport: " + sportSlug);
    SharedData.onReady().then(function () {
        var sport = SharedData.getSportBy('slug', sportSlug);
        SharedData.currentSport = sport;

        if (sport){
            var category = SharedData.getCategoryBy('slug', categorySlug);
            SharedData.setCurrentCategory(category);
            if (category) category.sport = sport;
            VideoTagData.addPermanentFilter(category ? TopSearchMapper('category', category) : TopSearchMapper('sport', sport));
        }
        
        VideoTagData
                .getLoader()
                .setOrder($stateParams.order)
                .startLoading()
                .finally(function(){
                    SharedData.pageLoader(false);
                });
    });

}

ViewRiderController.$inject = ['$scope', '$state', 'VideoTagData', '$stateParams', 'PlayerData', 'SharedData', 'RiderEntity', 'TopSearchMapper'];
function ViewRiderController($scope, $state, VideoTagData, $stateParams, PlayerData, SharedData, RiderEntity, TopSearchMapper) {
    
    loadRider();

    function loadRider() {
        RiderEntity
                .profile({id: $stateParams.riderId})
                .$promise
                .then(function (rider) {
                    console.log(rider);
                    SharedData.populateCategory(rider.sports);
                    SharedData.populateCategory(rider.popular_tags);
                    $scope.rider = rider;
                    VideoTagData.addPermanentFilter(TopSearchMapper('rider', rider), true);
                    
                    
                })
                .catch(function () {
                    $state.go('nofound');
                })
                .finally(function(){
                    SharedData.pageLoader(false);
                });
    }

}


ViewPlaylistController.$inject = ['$scope', 'VideoTagData', '$stateParams', 'PlayerData', 'SharedData', 'PlaylistEntity', 'TopSearchMapper', '$state'];
function ViewPlaylistController($scope, VideoTagData, $stateParams, PlayerData, SharedData, PlaylistEntity, TopSearchMapper, $state) {
    
    $scope.playlist = false;

    PlaylistEntity
            .view({id: $stateParams.playlistId})
            .$promise
            .then(function (data) {
                $scope.playlist = data;
//                VideoTagData.addPermanentFilter(TopSearchMapper('playlist', data), false);
            })
            .finally(function () {
                SharedData.pageLoader(false);
            })
            .catch(function () {
                $state.go('notfound');
            });

}

PlaylistPlayerController.$inject = ['$scope', 'VideoTagData', 'PlayerData', 'SharedData', '$stateParams', 'PlaylistItemEntity'];
function PlaylistPlayerController($scope, VideoTagData, PlayerData, SharedData, $stateParams, PlaylistItemEntity) {

//    VideoTagData.update();
    // TODO change
    
    var loader = VideoTagData.getLoader();
    loader.setResource(PlaylistItemEntity.playlist)
            .setFilter('id', $stateParams.playlistId)
            .setMapper(function (input) {
                return input.video_tag;
            })
            .startLoading()
            .then(function () {
                if (loader.getItems().length > 0) {
                    PlayerData.playVideoTag(loader.getItem(0), false).then(function () {
                        SharedData.pageLoader(false);
                    });
                } else {
                    SharedData.pageLoader(false);
                }
            })
            .catch(function () {
                SharedData.pageLoader(false);
            });

    $scope.$on('play-video-tag', function (event, tag) {
        event.stopPropagation();
        PlayerData.playVideoTag(tag);
        PlayerData.startLooping();
    });

}


ViewVideoController.$inject = ['$scope', 'VideoTagData', 'PlayerData', '$stateParams', 'SharedData', '$state', 'TopSearchMapper', 'ProviderVideoInfo'];
function ViewVideoController($scope, VideoTagData, PlayerData, $stateParams, SharedData, $state, TopSearchMapper, ProviderVideoInfo) {

//    SharedData.setCurrentCategory(null);

    $scope.video = {
        id: $stateParams.videoId
    };

    VideoTagData.getLoader()
            .setFilters({video_id: $scope.video.id, order: 'begin_time'})
            .startLoading()
            .then(autoPlayVideo)
            .catch(function () {
                SharedData.pageLoader(false);
            });

    function autoPlayVideo(response) {
        console.log("Autho play video");

        if (response.items.length === 0) {
            console.error("This video has no trick");
        }
        var video = response.extra.video;
        PlayerData.loadVideo(video.provider_id, {
            video_url: video.video_url
        }).finally(function () {
            SharedData.pageLoader(false);
        });
        $scope.videoDuration = video.duration;
        $scope.videoTags = response.items;


        var providerFactory = ProviderVideoInfo.get(video.provider_id);

        providerFactory
                .create()
                .addVideo(video.video_url)
                .addPart('snippet')
                .load()
                .then(function (results) {
                    var item = providerFactory.createItem(results);
                    console.log(item);
                    VideoTagData.addPermanentFilter(TopSearchMapper('video', {title: item.title()}));
                });
    }
}

StartValidationController.$inject = ['SharedData', 'PlayerData'];
function StartValidationController(SharedData, PlayerData) {
    SharedData.pageLoader(false);
}

// TODO add current sport ...
ViewValidationController.$inject = ['$scope', 'VideoTagData', 'PlayerData', 'SharedData', '$state',
    'VideoTagEntity', 'VideoTagAccuracyRateEntity', '$stateParams'];
function ViewValidationController($scope, VideoTagData, PlayerData, SharedData, $state, VideoTagEntity,
        VideoTagAccuracyRateEntity, $stateParams) {
    var skipped = [];
    var sport = SharedData.getSportBy('slug', $stateParams.sportSlug);

    if (!sport) {
        console.log("ERROR: no sport selected for validation. Params: " + $stateParams.sportSlug);
        $state.go('startvalidation');
        return;
    }

    loadNext();

    $scope.rateAccurate = rateAccurate;
    $scope.rateFake = rateFake;
    $scope.skip = skip;

    PlayerData.showTricksMenu(false);

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
        PlayerData.stop();
        SharedData.pageLoader(true);
        loadNext();
    }

    function loadNext() {
        SharedData.pageLoader(true);
        return VideoTagEntity
                .validation({skipped: skipped.join(','), sport_id: sport.id})
                .$promise
                .then(successLoadCallback)
                .catch(function () {
                    $state.go('home');
                });
    }

    function successLoadCallback(tags) {
        VideoTagData.getLoader().data.items = tags;
        if (tags.length === 1) {
            console.log('Auto play video tag');
            PlayerData
                    .playVideoTag(tags[0], true)
                    .finally(function () {
                        SharedData.pageLoader(false);
                    });
        } else {
            VideoTagData.currentTag = null;
            PlayerData.hide();
            SharedData.pageLoader(false);
        }
    }
}

ManagePlaylistController.$inject = ['$scope', 'PlaylistEntity', 'SharedData', 'PaginateDataLoader', 'ApiFactory'];
function ManagePlaylistController($scope, PlaylistEntity, SharedData, PaginateDataLoader, ApiFactory) {
    $scope.removeOptions = {trigger: '.btn-remove-item', endpoint: ApiFactory.endpoint('Playlists', 'delete').remove, confirm: true, wait: false};

    $scope.loader = PaginateDataLoader.instance('playlist', PlaylistEntity.user)
            .setMode('replace');

    $scope.loader
            .startLoading()
            .finally(function () {
                SharedData.pageLoader(false);
            });

}

EditPlaylistController.$inject = ['$scope', 'PaginateDataLoader', 'PlaylistEntity', 'PlaylistItemEntity', 'SharedData', '$stateParams', 'ApiFactory', '$state'];
function EditPlaylistController($scope, PaginateDataLoader, PlaylistEntity, PlaylistItemEntity, SharedData, $stateParams, ApiFactory, $state) {
    var removeEndpoint = ApiFactory.endpoint('PlaylistVideoTags', 'delete').remove;
    $scope.removeOptions = {
        wait: false,
        endpoint: removeEndpoint,
        trigger: '.btn-remove-item',
        confirm: false
    };
    $scope.showEditionForm = false;
    loadPlaylist();
    loadItems();
    $scope.selectedVideoTag = null;
    $scope.onDrop = onDrop;

    function loadPlaylist() {
        PlaylistEntity.view({id: $stateParams.playlistId}).$promise.then(function (data) {
            $scope.playlist = data;
        })
                .catch(function () {
                    $state.go('manageplaylist');
                });
    }

    function loadItems() {
        $scope.loader = PaginateDataLoader.instance('playlist-edit', PlaylistItemEntity.playlist);
        $scope.loader
                .init()
                .setMode('append')
                .setFilter('id', $stateParams.playlistId)
                .setLimit(20) // TODO PARAM
                .startLoading()
                .catch(function () {
                    $state.go('manageplaylist');
                })
                .finally(function () {
                    SharedData.pageLoader(false);
                });
    }

    $scope.$on('on-playlist-form-cancel', function (event) {
        $scope.showEditionForm = false;
        event.stopPropagation();
    });
    $scope.$on('on-playlist-saved', function (event, playlist) {
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
    $scope.toggleForm = function () {
        $scope.showAddPlaylistForm = !$scope.showAddPlaylistForm;
    };
    $scope.addToPlaylist = addToPlaylist;
    $scope.loader = PaginateDataLoader.instance('playlist', PlaylistEntity.user)
            .setMode('replace')
            .setLimit(12);


    $scope.$on('on-playlist-saved', function (event, playlist) {
        // Add the new playlist
        $scope.showAddPlaylistForm = false;
        addToPlaylist(playlist);
        $scope.loader.prepend(playlist);
        $uibModalInstance.close($scope.videoTag);
        console.log($scope.loader.getItems());
    });

    $scope.$on('on-playlist-title-clicked', function (event, playlist) {
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
                .finally(function () {

                });
    }

    function addToPlaylist(playlist) {
        PlaylistItemEntity.add({
            video_tag_id: videoTag.id,
            playlist_id: playlist.id
        }, function (result) {
            if (result.success) {
                playlist.count_tags += 1;
            }
        }, function () {
            // TODO remove playlist
        });
        toaster.pop('success', 'Added to the playlist!');
        ok();
    }
}
