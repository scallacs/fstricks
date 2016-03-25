angular.module('app.admin')
        .controller('VideoTagsController', VideoTagsController)
        .controller('VideoTagIndexController', VideoTagIndexController)
        .controller('VideoTagEditController', VideoTagEditController);

function VideoTagsController() {

}

VideoTagIndexController.$inject = ['$scope', 'AdminApiFactory', 'SharedData', 'toaster', 'PaginateDataLoader'];
function VideoTagIndexController($scope, AdminApiFactory, SharedData, toaster, PaginateDataLoader) {
    $scope.removeOptions = {trigger: '.btn-remove-item', endpoint: AdminApiFactory.endpoint('VideoTags', 'delete').save, confirm: true, wait: false};
    $scope.refreshUsers = refreshUsers;
    $scope.isSearchCollapsed = true;
    $scope.search = {
        status: {'pending': true, 'rejected': false, 'validated': false, 'blocked': false},
        sports: {},
        user: null,
        order: 'modified'
    };
    $scope.orders = [
        {code: 'modified', label: 'Modified'},
        {code: 'created', label: 'created'},
        {code: 'best', label: 'best'}
    ];

    $scope.computeRatio = computeRatio;
    $scope.validateVideoTag = validateVideoTag;
    $scope.rejectVideoTag = rejectVideoTag;
    $scope.blockVideoTag = blockVideoTag;
    $scope.submitSearch = submitSearch;
    $scope.loadMore = loadMore;

    $scope.videoTags = [];

    SharedData.onReady(function() {
        $scope.sports = SharedData.sports;
        angular.forEach(SharedData.sports, function(data) {
            $scope.search.sports[data.id] = true;
        });
    });

    var api = AdminApiFactory.api();
    var dataLoader = PaginateDataLoader.create(AdminApiFactory.endpoint('VideoTags', 'index').get);
    dataLoader.setMode('append');

    submitSearch($scope.search);

    function submitSearch(search) {
        updateFilters(search);
        dataLoader
                .startLoading()
                .then(function(results) {
                    $scope.videoTags = results.items;
                    SharedData.pageLoader(false);
                });
    }

    function loadMore() {
        dataLoader.loadNextPage();
    }

    function updateFilters(s) {
        console.log(s);
        dataLoader.init();
        if (s.user) {
            dataLoader.setFilter('user_id', s.user.id);
        }
        var selected = [];
        angular.forEach(s.status, function(isSelected, name) {
            if (isSelected) {
                selected.push(name);
            }
        });
        dataLoader.setFilter('status', selected.join());

        var selected = [];
        var allSelected = true;
        angular.forEach(s.sports, function(isSelected, sportId) {
            if (isSelected) {
                selected.push(sportId);
            }
            allSelected = allSelected && isSelected;
        });
        if (!allSelected) {
            dataLoader.setFilter('sports', selected.join());
        }
        
        dataLoader.setFilter('order', $scope.search.order);
    }

    function computeRatio(videoTag) {
        var total = videoTag.count_fake + videoTag.count_accurate;
        if (total === 0) {
            return 0;
        }
        return videoTag.count_accurate * 100 / (videoTag.count_fake + videoTag.count_accurate);
    }

    function refreshUsers(term) {
        if (term.length >= 2) {
            api.query('Users', 'search', {q: term})
                    .then(function(users) {
                        $scope.users = users;
                    });
        }
    }

    function validateVideoTag(videoTag) {
        _changeStatusVideoTag(videoTag, 'validated');
    }

    function rejectVideoTag(videoTag) {
        _changeStatusVideoTag(videoTag, 'rejected');
    }
    function blockVideoTag(videoTag) {
        _changeStatusVideoTag(videoTag, 'blocked');
    }

    function _changeStatusVideoTag(videoTag, status) {
        api.save('VideoTags', 'edit', {_id: videoTag.id, status: status})
                .then(function(results) {
                    if (results.success) {
                        videoTag.status = status;
                        toaster.pop('success', results.message);
                    }
                    else {
                        toaster.pop('failure', results.message);
                    }
                });
    }
}

VideoTagEditController.$inject = ['$scope', 'SharedData', '$stateParams', 'AdminApiFactory', 'VideoEntity', 'EditionTag', '$state', 'VideoTagData', 'PlayerData'];
function VideoTagEditController($scope, SharedData, $stateParams, AdminApiFactory, VideoEntity, EditionTag, $state, VideoTagData, PlayerData) {
    SharedData.pageLoader(false);
    $scope.user = false;

    var id = $stateParams.videoTagId;

    EditionTag.prototype.callApi = function(name, params) {
        switch (name) {
            case 'delete':
                params = {_id: params.id};
                break;
            case 'edit':
                params._id = params.id;
                break;
        }
        return this._apiMap[name](params);
    };

    $scope.editionTag = new EditionTag(null, {
        'edit': AdminApiFactory.endpoint('VideoTags', 'edit').save,
        'add': AdminApiFactory.endpoint('VideoTags', 'add').save,
        'delete': AdminApiFactory.endpoint('VideoTags', 'delete').save
    }, 'admin', {
        min_duration: 2,
        max_duration: 40, 
        similar_tag_limit_ratio: 0.6
    });
//
////    PlayerData.showEditionMode();
////    PlayerData.showListTricks = false;
////    VideoTagData.reset();
////    VideoTagData.getLoader()
////            .setFilter('with_pending', true)
////            .setFilter('video_id', $stateParams.videoId);
//
    var videoTagsEndpoint = AdminApiFactory.endpoint('VideoTags', 'view', id);
    videoTagsEndpoint.get().$promise
            .then(function(result) {
                console.log(result);
                $scope.video = {
                    video_url: result.video_url,
                    id: result.video_id,
                    provider_id: result.provider_id,
                    duration: parseInt(result.video_duration)
                };
                $scope.editionTag.fromVideoTag(result);
                $scope.editionTag.setVideo($scope.video);
                
                VideoTagData.getLoader().add(result);
                VideoTagData.setCurrentTag(result);
                PlayerData.data.duration = $scope.video.duration;

                PlayerData.playVideoTag(result);

                if (result.user_id) {
                    loadUser(result.user_id);
                }

                SharedData.pageLoader(false);
            })
            .catch(function() {
                // TODO
//               $state.go('notfound');
            });

    function loadUser(id) {
        var usersEndpoint = AdminApiFactory.endpoint('Users', 'view', id).get;
        usersEndpoint().$promise.then(function(result) {
            console.log(result);
            $scope.user = result;
        });
    }
    ;

    $scope.$on('on-video-tag-remove', function() {
        $state.$go('videotags.index');
    });
}

