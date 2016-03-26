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
        .controller('StartValidationController', StartValidationController)
        .controller('ViewPlaylistController', ViewPlaylistController)
        .controller('DashboardController', DashboardController)
        .controller('ManagePlaylistController', ManagePlaylistController)
        .controller('EditPlaylistController', EditPlaylistController)
        .controller('ModalPlaylistController', ModalPlaylistController);

ConfigRoute.$inject = ['$stateProvider'];
function ConfigRoute($stateProvider) {
    var baseUrl = TEMPLATE_URL + '/player/partials/';

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
                url: '/sport/:sportName/:categoryName',
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
                url: '/validate',
                views: {
                    videoPlayerExtra: {
                        templateUrl: baseUrl + 'view-validation.html',
                        controller: 'ViewValidationController'
                    }
                }
            })
            .state('startvalidation', {
                url: '/start-validation',
                templateUrl: baseUrl + 'start-validation.html',
                controller: 'StartValidationController',
                data: {
                    requireLogin: true,
                    pageLoader: true
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
                url: '/search?q',
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

DashboardController.$inject = ['$scope', 'PaginateDataLoader', 'SharedData', '$state', 'VideoTagEntity', 'ApiFactory'];
function DashboardController($scope, PaginateDataLoader, SharedData, $state, VideoTagEntity, ApiFactory) {

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
                    .instance(workspace.id, VideoTagEntity.search)
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

PlayerController.$inject = ['$scope', 'PlayerData', 'SharedData', 'TopSearchMapper'];
function PlayerController($scope, PlayerData, SharedData, TopSearchMapper) {
    PlayerData.showViewMode();
    PlayerData.showListTricks = true;


    $scope.$on('play-video-tag', function(event, tag) {
        event.stopPropagation();
//        $state.transitionTo($state.$current, {realization: tag.id}, {notify: false, reload: false});
        PlayerData.playVideoTag(tag);
        PlayerData.startLooping();
    });

//    if (angular.isDefined($stateParams.realization)) {
//        console.log('Realization for player: ' + $stateParams.realization);
//    }
}

ViewRealizationController.$inject = ['VideoTagData', '$stateParams', 'PlayerData', 'SharedData', '$state', 'TopSearchMapper'];
function ViewRealizationController(VideoTagData, $stateParams, PlayerData, SharedData, $state, TopSearchMapper) {
    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.showListTricks = false;
    VideoTagData
            .getLoader()
            .setFilters({video_tag_id: $stateParams.videoTagId, status: 'rejected,pending,validated'})
            .startLoading()
            .then(function(results) {
                if (results.items.length === 1) {
                    var videoTag = results.items[0];
                    PlayerData.playVideoTag(videoTag).then(function() {
                        SharedData.pageLoader(false);
                        console.log(videoTag);
                        SharedData.setCurrentSearch(TopSearchMapper['trick'](videoTag));
                    });
                }
                else {
                    $state.go('notfound');
                }
            })
            .catch(function() {
                $state.go('notfound');
            });
}

ViewTagController.$inject = ['VideoTagData', '$stateParams', 'PlayerData', 'SharedData', 'TopSearchMapper'];
function ViewTagController(VideoTagData, $stateParams, PlayerData, SharedData, TopSearchMapper) {
    SharedData.currentSearch.category = 'Trick';
    PlayerData.showViewMode();
    PlayerData.stop();
    VideoTagData.getLoader()
            .setFilters({tag_slug: $stateParams.tagSlug, order: $stateParams.order})
            .startLoading()
            .then(function(results) {
                if (results.items.length > 0) {
                    var firstTag = results.items[0];
                    SharedData.setCurrentSearch(TopSearchMapper['trick'](firstTag));
                    // Auto play if there is only one realization for the trick
                    if (results.items.length === 1) {
                        PlayerData.showListTricks = false;
                        PlayerData.playVideoTag(firstTag);
                    }
                }
            })
            .finally(function() {
                SharedData.pageLoader(false);
            });
}

ViewSportController.$inject = ['VideoTagData', '$stateParams', 'PlayerData', 'SharedData', 'TopSearchMapper', '$filter'];
function ViewSportController(VideoTagData, $stateParams, PlayerData, SharedData, TopSearchMapper, $filter) {
//    console.log("View sport: " + $stateParams.sportName);
    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.showListTricks = true;
    var sportName = $stateParams.sportName;
    var categoryName = $stateParams.categoryName;


    console.log("Viewing sport: " + sportName);
    SharedData.onReady().then(function() {
        var sport = $filter('getSportByName')(SharedData.sports, sportName);
        SharedData.currentSport = sport;
        if (categoryName !== null) {
            SharedData.currentCategory = $filter('getSportByName')(sport.categories, categoryName);
        }
        SharedData.setCurrentSearch(TopSearchMapper['sport']({
            name: sportName,
            category: categoryName
        }));
    });
    VideoTagData.getLoader()
            .setFilters({sport_name: $stateParams.sportName, category_name: $stateParams.categoryName, order: $stateParams.order})
            .startLoading().finally(function() {
        SharedData.pageLoader(false);
    });
}

ViewRiderController.$inject = ['$scope', 'VideoTagData', '$stateParams', 'PlayerData', 'SharedData', 'RiderEntity', 'TopSearchMapper'];
function ViewRiderController($scope, VideoTagData, $stateParams, PlayerData, SharedData, RiderEntity, TopSearchMapper) {
    VideoTagData.reset();
    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.showListTricks = false;

    $scope.rider = {id: $stateParams.riderId};
    VideoTagData.getLoader()
            .setFilters({rider_slug: $stateParams.riderId, order: $stateParams.order})
            .startLoading()
            .finally(function() {
                SharedData.pageLoader(false);
            });

    RiderEntity.profile({id: $stateParams.riderId}, function(rider) {
        console.log(rider);
        $scope.rider = rider;
        SharedData.setCurrentSearch(TopSearchMapper['rider'](rider));
    });
}

ViewSearchController.$inject = ['VideoTagData', '$stateParams', 'PlayerData', 'SharedData', 'TopSearchMapper'];
function ViewSearchController(VideoTagData, $stateParams, PlayerData, SharedData, TopSearchMapper) {
    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.showListTricks = true;

    if ($stateParams.q) {
        SharedData.setCurrentSearch(TopSearchMapper['search']($stateParams.q));
    }
    else {
        SharedData.setCurrentSearch(TopSearchMapper['sport']({
            name: 'all sports'
        }));
    }

//    console.log($stateParams);
    VideoTagData.reset();
    VideoTagData.getLoader()
            .setOrder($stateParams.order)
            .setFilter('tag_name', $stateParams.q)
            .setFilter('sport_id', SharedData.currentSport ? SharedData.currentSport.id : null)
            .startLoading()
            .finally(function() {
                SharedData.pageLoader(false);
            });
}

ViewPlaylistController.$inject = ['$scope', 'VideoTagData', '$stateParams', 'PlayerData', 'SharedData', 'PlaylistItemEntity', 'TopSearchMapper'];
function ViewPlaylistController($scope, VideoTagData, $stateParams, PlayerData, SharedData, PlaylistItemEntity, TopSearchMapper) {
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
                SharedData.setCurrentSearch(TopSearchMapper['playlist']($scope.playlist));
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


ViewVideoController.$inject = ['$scope', 'VideoTagData', 'PlayerData', '$stateParams', 'SharedData', '$state', 'TopSearchMapper', 'ProviderVideoInfo'];
function ViewVideoController($scope, VideoTagData, PlayerData, $stateParams, SharedData, $state, TopSearchMapper, ProviderVideoInfo) {

    PlayerData.showViewMode();
    PlayerData.stop();
    PlayerData.showListTricks = false;
    PlayerData.playMode = 'video';
    PlayerData.stopLooping();

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

    function autoPlayVideo(response) {
        console.log("Autho play video");
        if (response.items.length > 0) {
            var first = response.items[0];
            PlayerData.loadVideo(first.provider_id, {
                video_url: first.video_url
            }).finally(function() {
                SharedData.pageLoader(false);
            });
            $scope.videoDuration = first.video_duration;
            $scope.videoTags = response.items;

        }
        else {
            console.log("This video has no trick");
            $state.go('notfound');
        }

        var video = response.extra.video;

        var providerFactory = ProviderVideoInfo.get(video.provider_id);

        providerFactory
                .create()
                .addVideo(video.video_url)
                .addPart('snippet')
                .load()
                .then(function(results) {
                    var item = providerFactory.createItem(results);
                    console.log(item);
                    SharedData.setCurrentSearch(TopSearchMapper['video']({title: item.title()}));
                });
    }
}

StartValidationController.$inject = ['SharedData'];
function StartValidationController(SharedData) {
    SharedData.pageLoader(false);
}

// TODO add current sport ...
ViewValidationController.$inject = ['$scope', 'VideoTagData', 'PlayerData', 'SharedData', '$state',
    'VideoTagEntity', 'VideoTagAccuracyRateEntity', '$uibModal'];
function ViewValidationController($scope, VideoTagData, PlayerData, SharedData, $state, VideoTagEntity,
        VideoTagAccuracyRateEntity, $uibModal) {
    var skipped = [];

    if (!SharedData.currentSport) {
        $state.go('startvalidation');
        return;
    }

    VideoTagData.reset();
    loadNext();
    PlayerData.showValidationMode();
    PlayerData.showListTricks = false;

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
        PlayerData.stop();
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
            console.log('Auto play video tag');
            PlayerData
                    .playVideoTag(tags[0], true)
                    .finally(function() {
                        SharedData.pageLoader(false);
                    });
        }
        else {
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
            .finally(function() {
                SharedData.pageLoader(false);
            });

}

EditPlaylistController.$inject = ['$scope', 'PaginateDataLoader', 'PlaylistItemEntity', 'SharedData', '$stateParams', 'ApiFactory', '$state'];
function EditPlaylistController($scope, PaginateDataLoader, PlaylistItemEntity, SharedData, $stateParams, ApiFactory, $state) {
    var removeEndpoint = ApiFactory.endpoint('PlaylistVideoTags', 'delete').remove;
    $scope.removeOptions = {
        wait: false,
        endpoint: removeEndpoint,
        trigger: '.btn-remove-item',
        confirm: false
    };
    $scope.showEditionForm = false;
    loadItems();
    $scope.selectedVideoTag = null;
    $scope.onDrop = onDrop;

    function loadItems() {
        $scope.loader = PaginateDataLoader.instance('playlist-edit', PlaylistItemEntity.playlist)
                .init()
                .setMode('append')
                .setFilter('id', $stateParams.playlistId)
//                .setFilter('playlist', true)
                .setLimit(20);

        $scope.loader
                .startLoading()
                .then(function(results) {
                    $scope.playlist = results.extra.playlist;
                })
                .catch(function() {
                    $state.go('manageplaylist');
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
    $scope.loader = PaginateDataLoader.instance('playlist', PlaylistEntity.user)
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
        }, function() {
            // TODO remove playlist
        });
        toaster.pop('success', 'Added to the playlist!');
        ok();
    }
}
