angular.module('app.tag')
        .directive('formVideoTag', FormVideoTagDirective);

function FormVideoTagDirective() {
    return {
        scope: {
            video: '=video',
            editionTag: '=editionTag'
        },
        templateUrl: TEMPLATE_URL + '/tag/partials/form-video-tag.html',
        controller: FormVideoTagController
    };

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
FormVideoTagController.$inject = ['$scope', '$filter', 'TagEntity', 'RiderEntity', 'SharedData', 'PlayerData',
            'VideoTagData', 'PaginateDataLoader'];
function FormVideoTagController($scope, $filter, TagEntity, RiderEntity, SharedData, PlayerData,
        VideoTagData, PaginateDataLoader) {

    $scope.riderToCreate = {id: null, firstname: '', lastname: '', count_tags: 0};
    var editionTag = $scope.editionTag;
    // -------------------------------------------------------------------------
    // Properties: TODO match with server side
    var MIN_TAG_DURATION = 2;
    var MAX_TAG_DURATION = 40;
    var SIMILAR_TAG_LIMIT_RATIO = 0.6;

    $scope.showCreateRiderForm = false;

    $scope.slider = {
        range: true,
        step: 0.3,
        min: 0,
        values: [0, MIN_TAG_DURATION],
        stop: function(event, ui) {
            if (editionTag.isNew()) {
                updateSimilarTags();
            }
            else {
                $scope.updateSimilarTags = [];
            }
        },
        slide: function(event, ui) {
            changeSliderValues(ui.values, ui.values[1] === ui.value ? 1 : 0);
        }
    };

    $scope.similarTags = [];
    $scope.sports = SharedData.sports;
    $scope.suggestedTags = [];
    $scope.suggestedCategories = [];
    $scope.suggestedRiders = [];
    $scope.showAddFeedback = false;

    // -------------------------------------------------------------------------
    // Functions
    $scope.deleteTag = deleteTag;
    $scope.cancel = cancel;

    $scope.playEditionTag = playEditionTag;
    $scope.saveVideoTag = saveVideoTag;
    $scope.editVideoTag = editVideoTag;
    $scope.addNewTag = addNewTag;
    $scope.refreshSuggestedTags = refreshSuggestedTags;
    $scope.refreshSuggestedCategories = refreshSuggestedCategories;
    $scope.refreshSuggestedRiders = refreshSuggestedRiders;
    $scope.onSelectRider = onSelectRider;

    $scope.addStartRange = addStartRange;
    $scope.addEndRange = addEndRange;
    $scope.setStartRangeNow = setStartRangeNow;
    $scope.setEndRangeNow = setEndRangeNow;
    $scope.loadSimilarTags = loadSimilarTags;
    $scope.selectGroupBySport = selectGroupBySport;

    $scope.$on('play-video-tag', function(event, tag) {
        event.stopPropagation();
        editVideoTag(tag); // TODO check
    });
    $scope.$on('view-video-tag-broadcast', function(event, tag) {
        editVideoTag(tag);
    });

    $scope.$on('add-new-tag', addNewTag);
    $scope.$on('rider-selected', onRiderSelectedEvent);

//    $scope.$watch('editionTag._extra.range', watchEditionTagRange, true);
    $scope.$watch('editionTag._extra.category', function() {
        $scope.suggestedTags = [];
        editionTag.syncCategory();
    });
    $scope.$watch('editionTag._extra.tag', function() {
        editionTag.syncTag();
    });
    $scope.$watch('editionTag._extra.rider', function() {
        editionTag.syncRider();
    });

    init();

    function init() {
        changeSliderValues([0, 10], 1);
    }


    // ----------------------------------------------------------------------- */
    //  EDITION FUNCTIONS 
    // ----------------------------------------------------------------------- */
    function cancel() {
        editionTag.resetOriginal();
    }
    function deleteTag(editionTag) {
        var promise = editionTag.remove();
        if ($scope.formAddVideoTag.submit){
            $scope.formAddVideoTag.submit(promise, 'button[name="button_remove"]');
        }

        promise.then(function(response) {
            if (response.success) {
                VideoTagData.getLoader()
                        .remove(editionTag.getId());
                $scope.$emit('on-video-tag-remove', editionTag.getId());
                addNewTag();
            }
        });
    }

    function updateSimilarTags() {
        $scope.similarTags = findSimilarTags(editionTag._video_tag);
    }

    function addNewTag() {
        $scope.showAddFeedback = false;
        PlayerData.showListTricks = false;
        editionTag.resetTag()
                .setId(null)
                .setVideo($scope.video)
                .moveForward();
        
        updateSimilarTags();
        playEditionTag();
    }

    function playEditionTag() {
        PlayerData.playVideoTag(editionTag._video_tag);
    }

    function saveVideoTag(editionTag) {
        var isNew = editionTag.isNew();

        editionTag.save($scope.formAddVideoTag)
                .then(function(response) {
                    $scope.similarTags = [];

                    // only if new 
                    if (isNew && response.success) {
                        VideoTagData.getLoader().add(editionTag._original);
                        $scope.showAddFeedback = true;
                    }

                    PlayerData.playVideoTag(editionTag._original);
                    $scope.$emit('save-video-tag', editionTag);
                })
                .catch(function() {
                    
                });


    }

    /**
     * When editing a existing video tag 
     * @param {type} videoTag
     * @returns {undefined}
     */
    function editVideoTag(videoTag) {
        $scope.showAddFeedback = false;
        editionTag.fromVideoTag(videoTag);
        playEditionTag();
        editionTag.isNew() ? updateSimilarTags() : $scope.similarTags = [];
    }

    function loadSimilarTags() {
        if (editionTag._apiMap['similar']) {
            var videoTag = editionTag._video_tag;
            PaginateDataLoader.instance('similarTags', editionTag._apiMap['similar'])
                    .init()
                    .setFilter('VideoTag', videoTag)
                    .startLoading()
                    .then(function(data) {
                        $scope.similarTags = data;
                    });
        }
    }

    function findSimilarTags(videoTag) {
        $scope.hasSimilarValidatedTag = false;
        var begin = videoTag.begin;
        var end = videoTag.end;
        console.log('Finding similar tags...');
        var similarTags = [];
        angular.forEach(VideoTagData.getItems(), function(tag) {
            // Contain
            var commonSeconds = Math.min(tag.end, end) - Math.max(tag.begin, begin);
            // Check percentage in common with other tag
            if (commonSeconds > 0) {
                var commonPercents = commonSeconds / (end - begin);
//                console.log("Similar at " + (commonPercents * 100) + "%");
                if (commonPercents >= SIMILAR_TAG_LIMIT_RATIO) { // More than 60% in common
                    if (tag.status === 'validated') {
                        $scope.hasSimilarValidatedTag = true;
                    }
                    similarTags.push(tag);
                }
            }
        });
        console.log('Similar count: ' + similarTags.length);
        return similarTags;
    }

    // ----------------------------------------------------------------------- */
    //  RANGE FUNCTIONS 
    // ----------------------------------------------------------------------- */

//    function watchEditionTagRange(newValue, oldValue) {
//        if (newValue == undefined) {
//            return;
//        }
//        if (oldValue == undefined || newValue[0] !== oldValue[0]) {
//            PlayerData.seekTo(newValue[0]);
//            adaptRange(newValue[0], 0);
//            playEditionTag();
//        }
//        else if (newValue[1] !== oldValue[1]) {
//            adaptRange(newValue[1], 1);
//            PlayerData.seekTo(newValue[1]);
//            PlayerData.pause();
//        }
//    }

    function addStartRange(value) {
        editionTag._extra.range[0] += value;
        changeSliderValues(editionTag._extra.range, 0);
    }
    function addEndRange(value) {
        editionTag._extra.range[1] += value;
        changeSliderValues(editionTag._extra.range, 1);
    }
    function setStartRangeNow() {
        PlayerData.getCurrentTime().then(function(currentTime) {
            editionTag._extra.range[0] = currentTime;
            changeSliderValues(editionTag._extra.range, 0);
        });
    }
    function setEndRangeNow() {
        PlayerData.getCurrentTime().then(function(currentTime) {
            editionTag._extra.range[1] = currentTime;
            changeSliderValues(editionTag._extra.range, 1);
        });
    }

    function changeSliderValues(input, i) {
        var output = getRangeMinMax(input, i);
        console.log("Changing values: " + input[0] + "-" + input[1]);
        editionTag._extra.range[0] = output[0];
        editionTag._video_tag.begin = output[0];
        editionTag._extra.range[1] = output[1];
        editionTag._video_tag.end = output[1];
        if (editionTag._video_tag.provider_id !== null) {
            if (i === 0) {
                playEditionTag();
            }
            else {
                PlayerData.data.end = output[1];
                PlayerData.pause();
                PlayerData.seekTo(output[1] - 0.01); // Prevent vimeo to redirect to the begining of the tag
            }
        }

    }


    /**
     * 
     * @param int newValue
     * @param {0,1} i the time to change (0 => begin, 1 => end)
     */
    function getRangeMinMax(input, i) {
        input[0] = Math.max(0, input[0]);
        var output = input;
        // Left side
        if (i === 1 && input[1] <= MIN_TAG_DURATION) {
            output[1] = MIN_TAG_DURATION;
            output[0] = 0;
            return output;
        }
        // Right side
        else if (i === 0 && (PlayerData.data.duration - input[0]) <= MIN_TAG_DURATION) {
            output[0] = PlayerData.data.duration - MIN_TAG_DURATION;
            output[1] = PlayerData.data.duration;
            return output;
        }
        output[i] = input[i];

        // Range is too small 
        var range = input[1] - input[0];
        if (range < MIN_TAG_DURATION) {
            output[1 - i] = input[i] + (i === 1 ? -MIN_TAG_DURATION : MIN_TAG_DURATION);
        }
        // Range is too big
        else if (range >= MAX_TAG_DURATION) {
            output[1 - i] = input[i] + (i === 1 ? -MAX_TAG_DURATION : MAX_TAG_DURATION);
        }
        return output;
    }

    // ----------------------------------------------------------------------- */
    //  UI SELECT FUNCTIONS 
    // ----------------------------------------------------------------------- */

    function onRiderSelectedEvent(event, rider) {
        $scope.showCreateRiderForm = false;
        editionTag.setRider(rider);
    }
    function refreshSuggestedCategories(term) {
        $scope.suggestedCategories = $filter('searchCategory')(SharedData.categories, term);
    }

    function refreshSuggestedTags(trick) {
        trick = trick.trim().toLowerCase();
        if (trick.length >= 2 && editionTag._extra.category !== null) {
            var categoryId = editionTag._extra.category.category_id;
            var sportId = editionTag._extra.category.sport_id;
            TagEntity.suggest({
                q: trick,
                category_id: categoryId,
                sport_id: sportId,
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
                        sport_name: editionTag._extra.category.sport_name,
                        category_name: editionTag._extra.category.category_name,
                        sport_id: sportId,
                        category_id: categoryId
                    });
                }
            });
        }
    }

    var lastRefreshSuggestedRidersCall = null;
    function refreshSuggestedRiders(name) {
//        if (lastRefreshSuggestedRidersCall !== null && !lastRefreshSuggestedRidersCall.$resolved) {
//            lastRefreshSuggestedRidersCall.$cancelRequest();
//            lastRefreshSuggestedRidersCall = null;
//        }
        if (name.length >= 2) {
            lastRefreshSuggestedRidersCall = RiderEntity.search({
                q: name
            }, function(items) {
                if (items.length === 0) {
                    $scope.suggestedRiders = [{
                            display_name: name,
                            id: null
                        }];
                }
                else {
                    $scope.suggestedRiders = items;
                }
            });
        }
    }

    function onSelectRider(rider) {
        if (rider.id === null) {
            var splitIndice = rider.display_name.trim().indexOf(' ');
            $scope.riderToCreate.firstname = splitIndice > 0 ? rider.display_name.substring(0, splitIndice).trim() : rider.display_name;
            $scope.riderToCreate.lastname = splitIndice > 0 ? rider.display_name.substring(splitIndice + 1).trim() : '';
            $scope.showCreateRiderForm = true; // @warning: MUST show the form after having initialized riderToCreate
        }
    }

    function selectGroupBySport(item) {
        return item.sport_name;
    }
}
