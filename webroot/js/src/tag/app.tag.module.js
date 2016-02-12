angular.module('app.tag', ['app.core', 'ui.bootstrap', 'ui.select', 'ui.router', 'ui.slider'])
        .controller('SearchTagController', SearchTagController)
        .controller('ModalReportErrorController', ModalReportErrorController)
        .controller('AddVideoTagController', AddVideoTagController)
        .config(Config);


function Config($stateProvider) {
    var baseUrl = 'js/src/tag/partials/';

    $stateProvider
            .state('addtag', {
                url: '/tag/add/:videoId/:tagId',
                views: {
                    viewNavRight: {
                        'template': '<div player-nav></div>'
                    },
                    '': {
                        templateUrl: baseUrl + 'add-video-tag.html',
                        controller: 'AddVideoTagController'
                    }
                },
                data: {
                    requireLogin: true,
                    pageLoader: true
                }
            });
}

/*
 
 VideoTag
 - begin: 245.5
 - category_name: "jib"
 - count_points: 0
 - end: 248.5
 - id: 96
 - provider_id: "youtube"
 - rider_name: "sebastien toutant"
 - rider_picture: null
 - sport_name: "snowboard"
 - tag_name: "backside 360 in"
 - tag_slug: "backside-360-in"
 - video_id: 113
 - video_url: "hDnGPpHEM6U"
 
 PostData
 - begin
 - end
 - sport_id
 - category_id
 - rider_id [optional]
 */
function AddVideoTagController($scope, $filter,
        $stateParams, VideoEntity, VideoTagEntity, TagEntity, SharedData, PlayerData,
        messageCenterService, RiderEntity, VideoTagData, VideoTagEntity) {

    PlayerData.showEditionMode();
    PlayerData.onCurrentTimeUpdate = onCurrentTimeUpdate;

    // -------------------------------------------------------------------------
    // Properties: TODO match with server side
    var MIN_TAG_DURATION = 2;
    var MAX_TAG_DURATION = 40;

    $scope.slider = {
        step: 0.5
    };
    $scope.showCreateRiderForm = false;

    $scope.video = {video_url: null};
    $scope.editionTag = {};
    $scope.similarTags = [];
    $scope.isFormLoading = false;
    $scope.sports = SharedData.sports;
    $scope.suggestedTags = [];
    $scope.suggestedCategories = [];
    $scope.suggestedRiders = [];

    // -------------------------------------------------------------------------
    // Functions
    $scope.playEditionTag = playEditionTag;
    $scope.addVideoTag = addVideoTag;
    $scope.editVideoTag = editVideoTag;
    $scope.refreshSuggestedTags = refreshSuggestedTags;
    $scope.onSelectTrick = onSelectTrick;
    $scope.onRemoveTrick = onRemoveTrick;

    $scope.refreshSuggestedCategories = refreshSuggestedCategories;
    $scope.onSelectCategory = onSelectCategory;
    $scope.onRemoveCategory = onRemoveCategory;

    $scope.refreshSuggestedRiders = refreshSuggestedRiders;
    $scope.onSelectRider = onSelectRider;
    $scope.onRemoveRider = onRemoveRider;

    $scope.addStartRange = addStartRange;
    $scope.addEndRange = addEndRange;
    $scope.setStartRangeNow = setStartRangeNow;
    $scope.setEndRangeNow = setEndRangeNow;

    init();

    $scope.$on('view-video-tag', function(event, tag) {
        editVideoTag(tag);
    });

    $scope.$on('add-new-tag', function(event) {
        console.log('add-new-tag event');
        PlayerData.showListTricks = false;
        addNewTag();
    });
    $scope.$on('rider-selected', onRiderSelectedEvent);
    $scope.$watch('editionTag.range', watchEditionTagRange);


    function init() {
        PlayerData.showListTricks = false;
        VideoTagData.reset();
        VideoTagData.setFilter('video_id', $stateParams.videoId);

        VideoEntity.view({id: $stateParams.videoId}, function(video) {
            $scope.video = video;
            PlayerData.data.duration = video.duration;
            // When data are loaded we set in the editor the tag id to edit
            // TODO change
            if ($stateParams.tagId) {
                VideoTagData.loadNextPage().then(function(data) {
                    console.log(data);
                    // Find tag id 
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].id == $stateParams.tagId) {
                            editVideoTag(data[i]);
                            PlayerData.view(data[i]).then(function() {
                                SharedData.pageLoader(false);
                            });
                            return;
                        }
                    }
                });
            }
            else {
                VideoTagData.loadNextPage();
                PlayerData.play(video.video_url).then(function() {
                    addNewTag();
                    SharedData.pageLoader(false);
                });

            }

        });


    }

    function addNewTag() {
        resetEditionTag();
        console.log($scope.editionTag);
        PlayerData.currentTag = $scope.editionTag;
    }

    function onCurrentTimeUpdate(newVal) {
        //PlayerData.updateCurrentTag();
    }

    function watchEditionTagRange(newValue, oldValue) {
        if (newValue == undefined) {
            return;
        }
        if (oldValue == undefined || newValue[0] !== oldValue[0]) {
//                PlayerData.seekTo(newValue[0]);
            adaptRange(newValue[0], 0);
            $scope.editionTag.begin = $scope.editionTag.range[0];
            playEditionTag();
        }
        else if (newValue[1] !== oldValue[1]) {
            PlayerData.seekTo(newValue[1]);
            PlayerData.pause();
            adaptRange(newValue[1], 1);
            $scope.editionTag.end = $scope.editionTag.range[1];
        }
        // If we want to create a new tag
        if ($scope.edtionTag && !$scope.edtionTag.id) {
            $scope.similarTags = findSimilarTags($scope.editionTag.range);
        }
    }
    function onRiderSelectedEvent(event, rider) {
//            console.log(rider);
        $scope.showCreateRiderForm = false;
        if (rider !== null) {
            $scope.editionTag.rider = rider;
            $scope.editionTag.rider_name = rider.display_name;
            $scope.editionTag.rider_picture = rider.rider_picture;
            $scope.editionTag.rider_id = rider.id;
        }
        else {
            $scope.editionTag.rider = null;
            $scope.editionTag.rider_name = null;
            $scope.editionTag.rider_id = null;
            $scope.editionTag.rider_picture = null;
        }
    }
    function refreshSuggestedCategories(term) {
        $scope.suggestedCategories = $filter('searchCategory')(SharedData.categories, term);
    }

    function refreshSuggestedTags(trick) {
        var tag = $scope.editionTag;
        if (trick.length >= 2) {
            TagEntity.suggest({
                id: trick,
                category_id: tag.category_id,
                sport_id: tag.sport_id
            }, function(results) {
                $scope.suggestedTags = [{
                        is_new: true,
                        name: trick,
                        sport_name: tag.sport_name,
                        category_name: tag.category_name,
                        sport_id: tag.sport_id,
                        category_id: tag.category_id
                    }];
                for (var i = 0; i < results.length; i++) {
                    $scope.suggestedTags.push(results[i]);
                }
            });
        }
    }

    function refreshSuggestedRiders(name) {
        if (name.length >= 2) {
            RiderEntity.search({
                q: name
            }, function(results) {
//                console.log(results);
                $scope.suggestedRiders = results.data;
            });
        }
    }

    function addVideoTag(data) {
        messageCenterService.removeShown();
        $scope.isFormLoading = true;

        var postData = toPostData(data);

        if (data.id) {
            $scope.formAddVideoTag.submit(VideoTagEntity.edit(postData).$promise).$promise.then(function(response) {
                $scope.isFormLoading = false;
                if (response.success) {
                    messageCenterService.add('success', response.message, {
                        timeout: 3000,
                        status: messageCenterService.status.shown
                    });
                    resetEditionTag();
                }
            });
        }
        else {
            $scope.formAddVideoTag.submit(VideoTagEntity.add(postData).$promise).then(function(response) {
                $scope.isFormLoading = false;
                if (response.success) {
                    messageCenterService.add('success', response.message, {
                        timeout: 3000,
                        status: messageCenterService.status.shown
                    });
                    var newTag = angular.copy($scope.editionTag);
                    newTag.id = response.data.id;
                    VideoTagData.add(newTag);
                    resetEditionTag($scope.editionTag);
                }
                else {
                    messageCenterService.add('warning', response.message, {
                        status: messageCenterService.status.shown
                    });
                }
            });
        }
    }

    function playEditionTag() {
        console.log("Playing edition tag");
        PlayerData.view($scope.editionTag);
    }

    function addStartRange(value) {
        $scope.editionTag.range = [$scope.editionTag.range[0] + value, $scope.editionTag.range[1]];
    }
    function addEndRange(value) {
        $scope.editionTag.range = [$scope.editionTag.range[0], $scope.editionTag.range[1] + value];
    }
    function setStartRangeNow() {
        adaptRange($scope.$parent.getCurrentPlayerTime(), 0);
    }
    function setEndRangeNow() {
        adaptRange($scope.$parent.getCurrentPlayerTime(), 1);
    }

    /**
     * 
     * @param int newValue
     * @param {0,1} i the time to change (0 => begin, 1 => end)
     */
    function adaptRange(newValue, i) {
        if (i === 1 && newValue <= MIN_TAG_DURATION) {
            $scope.editionTag.range[1] = MIN_TAG_DURATION;
            $scope.editionTag.range[0] = 0;
            return;
        }
        else if (i === 0 && (PlayerData.data.duration - newValue) <= MIN_TAG_DURATION) {
            $scope.editionTag.range[0] = PlayerData.data.duration - MIN_TAG_DURATION;
            $scope.editionTag.range[1] = PlayerData.data.duration;
            return;
        }

        $scope.editionTag.range[i] = newValue;
        if (($scope.editionTag.range[1] - $scope.editionTag.range[0]) < MIN_TAG_DURATION) {
            $scope.editionTag.range[1 - i] = $scope.editionTag.range[i] + (i === 1 ? -MIN_TAG_DURATION : MIN_TAG_DURATION);
        } else if (($scope.editionTag.range[1] - $scope.editionTag.range[0]) >= MAX_TAG_DURATION) {
            $scope.editionTag.range[1 - i] = $scope.editionTag.range[i] + (i === 1 ? -MAX_TAG_DURATION : MAX_TAG_DURATION);
        }
    }

    function findSimilarTags(range) {
        var SIMILAR_TAG_LIMIT_RATION = 0.6;                // TODO global variable
        var similarTags = [];
        angular.forEach(VideoTagData.data, function(tag) {
            // Contain
            var commonSeconds = Math.min(tag.end, range[1]) - Math.max(tag.begin, range[0]);
            // Check percentage in common with other tag
            if (commonSeconds > 0) {
                var commonPercents = commonSeconds / (range[1] - range[0]);
//                console.log("Similar at " + (commonPercents * 100) + "%");
                if (commonPercents >= SIMILAR_TAG_LIMIT_RATION) { // More than 60% in common
                    similarTags.push(tag);
                }
            }
        });
        console.log('Similar count: ' + similarTags.length);
        return similarTags;
    }

    function onSelectRider($item) {
        $scope.editionTag.rider_name = $item.display_name;
        $scope.editionTag.rider_id = $item.id;
    }
    function onRemoveRider() {
        $scope.editionTag.rider_name = 'Unknown rider';
        $scope.editionTag.rider_id = null;
    }
    function onSelectTrick($item) {
//        console.log($item);
        $scope.editionTag.tag_name = $item.name;
        $scope.editionTag.tag_id = $item.id;
        // TODO check that tag has all wanted fields
        console.log($item);
        $scope.editionTag.tag = $item;
    }
    function onRemoveTrick() {
        $scope.editionTag.tag_name = 'Define the trick';
        $scope.editionTag.tag_id = null;
    }
    function onSelectCategory($item) {
        $scope.editionTag.sport_name = $item.sport_name;
        $scope.editionTag.sport_id = $item.sport_id;
        $scope.editionTag.category_name = $item.category_name;
        $scope.editionTag.category_id = $item.category_id;
    }
    function onRemoveCategory() {
        $scope.editionTag.category_name = '';
        $scope.editionTag.sport_name = '';
        $scope.editionTag.sport_id = null;
        $scope.editionTag.category_id = null;
    }

    function editVideoTag(videoTag) {
        videoTag.range = [videoTag.begin, videoTag.end];
        videoTag.category = {
            id: videoTag.category_id,
            category_name: videoTag.category_name,
            sport_name: videoTag.sport_name
        };
        videoTag.tag = {
            id: videoTag.tag_id,
            name: videoTag.tag_name,
            sport_name: videoTag.sport_name,
            category_name: videoTag.category_name,
        };
        if (videoTag.rider_id) {
            videoTag.rider = {
                id: videoTag.rider_id,
                display_name: videoTag.rider_name,
                nationality: videoTag.rider_nationality
            };
        }
        //console.log(videoTag);
        $scope.editionTag = videoTag;
    }


    /**
     * Convert the EditionTag to a PostData
     * @param EditionTag data
     * @returns 
     */
    function toPostData(editionTag) {
        var postData = {
            video_id: $stateParams.videoId,
            begin: editionTag.begin,
            end: editionTag.end,
            rider_id: editionTag.rider_id,
            tag_id: editionTag.tag_id,
            id: editionTag.id
        };
        if (editionTag.tag.is_new) {
            postData.tag = editionTag.tag;
        }
        return postData;
    }

    function resetEditionTag() {
        var defaultDuration = (MAX_TAG_DURATION - MIN_TAG_DURATION) / 2;
        $scope.editionTag = {
            mode: 'edition',
            id: null,
            begin: 0,
            end: defaultDuration,
            video_url: $scope.video.video_url,
            tag_name: null,
            tag_slug: null,
            tag_id: null,
            tag: {},
            sport_name: null,
            category_name: null,
            sport_id: null,
            category_id: null,
            rider_name: null,
            rider_picture: null,
            rider_id: null,
            provider_id: "youtube",
            count_points: 0,
            // ---
            range: [0, 0]
        };

        $scope.editionTag.range[1] = defaultDuration;
    }
}


function SearchTagController($scope, TagEntity) {

    $scope.suggested = [];
    $scope.selected = [];

    $scope.refreshSuggestedTags = loadSuggestedTags;
    $scope.onSelectTag = onSelectTag;
    $scope.tagTransform = tagTransform;

    function onSelectTag($item, $model) {
        $scope.$emit('onSelectedTagUpdated', $scope.selected);
    }

    function onRemoveTag($item, $model) {
        $scope.$emit('onSelectedTagUpdated', $scope.selected);
    }
    function loadSuggestedTags(term) {
        TagEntity.suggest({id: term}, function(results) {
            $scope.suggested = results;
        });
    }
    function tagTransform(term) {
        return {
            isTag: true,
            name: term,
            count_ref: 0,
            id: null
        };

    }

}

function ModalReportErrorController($scope, $uibModalInstance, ErrorReportEntity,
        videoTag, messageCenterService) {

    $scope.videoTag = videoTag;
    $scope.feedback = null;
    $scope.errorReport = {};

    $scope.ok = function() {
        messageCenterService.removeShown();
        $uibModalInstance.close($scope.videoTag);
    };

    $scope.cancel = function() {
        messageCenterService.removeShown();
        $uibModalInstance.dismiss('cancel');
    };

    $scope.sendReport = function(errorReport) {
        messageCenterService.removeShown();
        errorReport.video_tag_id = videoTag.id;
        $scope.formReportVideoTagError
                .submit(ErrorReportEntity.post(errorReport).$promise)
                .then(function(response) {
                    if (response.success) {
                        $uibModalInstance.close($scope.videoTag);
                    }
                });
    };
}
