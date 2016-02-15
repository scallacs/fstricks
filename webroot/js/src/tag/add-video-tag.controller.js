angular.module('app.tag')
        .controller('AddVideoTagController', AddVideoTagController);
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
    var SIMILAR_TAG_LIMIT_RATION = 0.6;

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
    $scope.saveVideoTag = saveVideoTag;
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
        event.stopPropagation();
        editVideoTag(tag);
    });
    $scope.$on('view-video-tag-broadcast', function(event, tag) {
        editVideoTag(tag);
    });

    $scope.$on('add-new-tag', addNewTag);
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
                VideoTagData.startLoading().then(function(data) {
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
                VideoTagData.startLoading();
                PlayerData.play(video.video_url).then(function() {
                    addNewTag();
                    SharedData.pageLoader(false);
                });

            }

        });


    }


    function onCurrentTimeUpdate(newVal) {
        //PlayerData.updateCurrentTag();
    }

    // ----------------------------------------------------------------------- */
    //  EDITION FUNCTIONS 
    // ----------------------------------------------------------------------- */
    function addNewTag() {
        PlayerData.showListTricks = false;
        resetEditionTag();
        VideoTagData.setCurrentTag($scope.editionTag);
    }

    function playEditionTag() {
        console.log("Playing edition tag");
        PlayerData.view($scope.editionTag);
    }

    function saveVideoTag(data) {
        var postData = toPostData(data);
        if (data.id > 0) {
            $scope.formAddVideoTag.submit(VideoTagEntity.edit(postData).$promise).then(function(response) {
                if (response.success) {
                    // Copy modifications back in tag
                    var original = $scope.editionTag.original_tag;
                    $scope.editionTag.original_tag = null;
                    angular.copy($scope.editionTag, original);
                    PlayerData.view(original);
                }
            });
        }
        // Create a new tag
        else {
            $scope.formAddVideoTag.submit(VideoTagEntity.add(postData).$promise).then(function(response) {
                if (response.success) {
                    var newTag = angular.copy($scope.editionTag);
                    newTag.id = response.data.video_tag_id;
                    VideoTagData.add(newTag);
                    resetEditionTag($scope.editionTag);
                    PlayerData.view(newTag);
                }
            });
        }
    }

    /**
     * When editing a existing video tag 
     * @param {type} videoTag
     * @returns {undefined}
     */
    function editVideoTag(videoTag) {
        var newTag = angular.copy(videoTag);
        newTag.original_tag = videoTag;
        newTag.range = [newTag.begin, newTag.end];
        newTag.category = {
            id: newTag.category_id,
            category_name: newTag.category_name,
            sport_name: newTag.sport_name
        };
        newTag.tag = {
            id: newTag.tag_id,
            name: newTag.tag_name,
            sport_name: newTag.sport_name,
            category_name: newTag.category_name
        };
        console.log(newTag);
        if (newTag.rider_id) {
            newTag.rider = {
                id: newTag.rider_id,
                display_name: newTag.rider_name,
                nationality: newTag.rider_nationality
            };
        }
        // Set video tag 
        //console.log(newTag);
        $scope.editionTag = newTag;
        playEditionTag();
        console.log(newTag);
        if (!newTag.id) {
            $scope.similarTags = findSimilarTags(newTag.range);
        }
        else{
            $scope.similarTags = [];
        }
    }


    function findSimilarTags(range) {
        console.log('Finding similar tags...');
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
        $scope.editionTag.mode = 'edition';
        $scope.editionTag.id = null;
        $scope.editionTag.video_url = $scope.video.video_url;
        $scope.editionTag.tag_name = null;
        $scope.editionTag.tag_slug = null;
        $scope.editionTag.tag_id = null;
        $scope.editionTag.count_points = 0;
        $scope.editionTag.tag = {};

        if (!angular.isDefined($scope.editionTag.category_id)) {
            $scope.editionTag.category_name = null;
            $scope.editionTag.sport_name = null;
            $scope.editionTag.sport_id = null;
            $scope.editionTag.category_id = null;
        }

        if (!angular.isDefined($scope.editionTag.rider_id)) {
            $scope.editionTag.rider_name = null;
            $scope.editionTag.rider_picture = null;
            $scope.editionTag.rider_id = null;
        }

        $scope.editionTag.provider_id = "youtube";
        if (!angular.isDefined($scope.editionTag.range)) {
            $scope.editionTag.begin = 0;
            $scope.editionTag.end = defaultDuration;
            $scope.editionTag.range = [0, defaultDuration];
        }
    }
    // ----------------------------------------------------------------------- */
    //  RANGE FUNCTIONS 
    // ----------------------------------------------------------------------- */

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
            adaptRange(newValue[1], 1);
            $scope.editionTag.end = $scope.editionTag.range[1];
            PlayerData.seekTo(newValue[1]);
            PlayerData.pause();
        }
        // If we want to create a new tag
        if (VideoTagData.currentTag !== null && !VideoTagData.currentTag.id) {
            $scope.similarTags = findSimilarTags($scope.editionTag.range);
        }
    }

    function addStartRange(value) {
        $scope.editionTag.range = [$scope.editionTag.range[0] + value, $scope.editionTag.range[1]];
    }
    function addEndRange(value) {
        $scope.editionTag.range = [$scope.editionTag.range[0], $scope.editionTag.range[1] + value];
    }
    function setStartRangeNow() {
        $scope.editionTag.range[0] = PlayerData.getCurrentTime();
    }
    function setEndRangeNow() {
        $scope.editionTag.range[1] = PlayerData.getCurrentTime();
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

    // ----------------------------------------------------------------------- */
    //  UI SELECT FUNCTIONS 
    // ----------------------------------------------------------------------- */

    function onRiderSelectedEvent(event, rider) {
//            console.log(rider);
        $scope.showCreateRiderForm = false;
        if (rider !== null) {
            console.log(rider);
            rider.display_name =  rider.firstname + ' ' + rider.lastname;
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
        trick = trick.trim().toLowerCase();
        if (trick.length >= 2) {
            TagEntity.suggest({
                id: trick,
                category_id: tag.category_id,
                sport_id: tag.sport_id,
                count_ref_min: 0
            }, function(results) {
                $scope.suggestedTags = [];
                var exists = false;
                console.log(trick);
                for (var i = 0; i < results.length; i++) {
                    $scope.suggestedTags.push(results[i]);
                    exists = exists || (results[i].name === trick);
                }
                if (!exists) {
                    $scope.suggestedTags.push({
                        is_new: true,
                        name: trick,
                        sport_name: tag.sport_name,
                        category_name: tag.category_name,
                        sport_id: tag.sport_id,
                        category_id: tag.category_id
                    });
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


}
