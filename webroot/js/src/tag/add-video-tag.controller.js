angular.module('app.tag')
        .controller('AddVideoTagController', AddVideoTagController)
        .factory('EditionTag', EditionTag);

function EditionTag() {

    function EditionTag(userId) {
        this._user_id = userId;
        this.init();
        return this;
    }

    EditionTag.prototype = {
        isNew: isNew,
        hasCategory: hasCategory,
        hasRider: hasRider,
        isFieldEditabled: isFieldEditabled,
        toPostData: toPostData,
        fromVideoTag: fromVideoTag,
        toVideoTag: toVideoTag,
        setId: setId,
        getId: getId,
        init: init,
        syncRider: syncRider,
        setRider: setRider,
        syncCategory: syncCategory,
        syncTag: syncTag,
        setVideo: setVideo,
        resetTag: resetTag,
        allowedToRemove: allowedToRemove,
        resetOriginal: resetOriginal,
        setEditabled: setEditabled,
        save: save,
        isEditabled: isEditabled,
        setStatus: setStatus,
        isDirty: isDirty,
        isValidated: isValidated,
        isOwner: isOwner
    };
    function isOwner() {
        return this._user_id === this._video_tag.user_id;
    }
    function isValidated() {
        return 'validated' === this._video_tag.status;
    }
    function isDirty() {
        if (!angular.isDefined(this._original) || this._original === null || !this._video_tag.id) {
            return true;
        }
        var a = this._video_tag;
        var b = this._original;
        return a.begin !== b.begin || a.end !== b.end
                || a.tag_id !== b.tag_id || a.rider_id !== b.rider_id
                || a.category_id !== b.category_id || a.video_id !== b.video_id;
    }

    function setStatus(val) {
        this._video_tag.status = val;
    }
    function resetOriginal() {
        this.fromVideoTag(this._original);
    }

    function allowedToRemove() {
        return !this.isNew() && !this.isValidated() && this.isOwner();
    }

    function save() {
        angular.copy(this._video_tag, this._original);
    }
    function resetTag() {
        this._extra.tag = null;
        return this;
    }

    function hasCategory() {
        return this._extra.category !== null && this._extra.category.category_id !== null;
    }

    function getId() {
        return this._video_tag.id;
    }

    function setId(id) {
        this._video_tag.id = id;
        this.setEditabled();
        return this;
    }

    function setVideo(data) {
        this._video_tag.video_url = data.video_url;
        this._video_tag.video_id = data.id;
        this._video_tag.provider_id = data.provider_id;
        return this;
    }

    function init() {
        this._original = null;

        this._video_tag = {
            mode: 'edition',
            id: null,
            user_id: this._user_id,
            provider_id: null
        };

        this.setEditabled();

        this._extra = {
            rider: null,
            tag: null,
            category: null,
            range: [0, 2]
        };
    }

    function syncCategory(newVal) {
        console.log("Sync category");
        console.log(this);
        if (this._extra.category !== null) {
            this._video_tag.category_name = this._extra.category.category_name;
            this._video_tag.sport_name = this._extra.category.sport_name;
        }
        else {
            this._video_tag.category_name = null;
            this._video_tag.sport_name = null;
        }
    }
    function syncTag() {
        console.log("SyncTag");
        if (this._extra.tag !== null) {
            this._video_tag.tag_name = this._extra.tag.name;
            this._video_tag.tag_id = this._extra.tag.id;
        }
        else {
            this._video_tag.tag_name = null;
            this._video_tag.tag_id = null;
        }
    }

    function hasRider() {
        return angular.isDefined(this._video_tag.rider_id) && this._video_tag.rider_id !== null;
    }
    function setRider(rider) {
        console.log(rider);
        this._extra.rider = rider;
        if (rider !== null) {
            this._video_tag.rider_name = rider.display_name;
            this._video_tag.rider_id = rider.id;
            this._video_tag.rider_nationality = rider.nationality;
        }
        else {
            this._video_tag.rider_name = null;
            this._video_tag.rider_id = null;
            this._video_tag.rider_nationality = null;
        }
    }
    function syncRider() {
        this.setRider(this._extra.rider);
    }

    function fromVideoTag(videoTag) {
        this._video_tag = angular.copy(videoTag);
        this._original = videoTag;

        this._extra.range = [this._video_tag.begin, this._video_tag.end];
        this._extra.rider = {
            id: this._video_tag.rider_id,
            display_name: this._video_tag.rider_name,
            nationality: this._video_tag.rider_nationality
        };
        this._extra.tag = {
            id: this._video_tag.tag_id,
            name: this._video_tag.tag_name,
            sport_name: this._video_tag.sport_name,
            category_name: this._video_tag.category_name
        };
        this._extra.category = {
            category_id: this._video_tag.category_id,
            category_name: this._video_tag.category_name,
            sport_name: this._video_tag.sport_name,
            sport_id: this._video_tag.sport_id,
        };
        this.setEditabled();
    }

    function isEditabled() {
        if (this._editabled === true || this._editabled === false) {
            return this._editabled;
        }
        angular.forEach(this._editabled, function(val) {
            if (val === true) {
                return true;
            }
        });
        return false;
    }

    function setEditabled() {
        if (this.isNew()) {
            this._editabled = true;
        }
        else if (this.isOwner() && (this._video_tag.status === 'pending' || this._video_tag.status === 'rejected')) {
            this._editabled = true;
        }
        else {
            this._editabled = false;
        }
//        else {
//            this._editabled = {
//                begin: false,
//                end: false,
//                category: false,
//                tag: false,
//                rider: !this.hasRider()
//            };
//        }
    }

    function isNew() {
        return !angular.isDefined(this._video_tag.id) || this._video_tag.id === null;
    }
    function isFieldEditabled(fieldname) {
        return this._editabled === true
                || (angular.isDefined(this._editabled[fieldname]) && this._editabled[fieldname]);
    }

    function toPostData() {
        var postData = {
            video_id: this._video_tag.video_id,
            begin: this._video_tag.begin,
            end: this._video_tag.end,
            rider_id: this._video_tag.rider_id,
            tag_id: this._video_tag.tag_id,
            id: this._video_tag.id
        };
        if (this._extra.tag.is_new) {
            postData.tag = this._extra.tag;
        }
        return postData;
    }

    function toVideoTag() {
        return angular.copy(this._video_tag);
    }

    return EditionTag;
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
AddVideoTagController.$inject = ['$scope', '$filter', '$state', '$stateParams',
    'VideoEntity', 'VideoTagEntity', 'TagEntity', 'RiderEntity', 'SharedData', 'PlayerData',
    'VideoTagData', 'EditionTag', 'AuthenticationService', 'PaginateDataLoader'];
function AddVideoTagController($scope, $filter, $state, $stateParams,
        VideoEntity, VideoTagEntity, TagEntity, RiderEntity, SharedData, PlayerData,
        VideoTagData, EditionTag, AuthenticationService, PaginateDataLoader) {

    PlayerData.showEditionMode();
    $scope.riderToCreate = {id: null, firstname: '', lastname: '', count_tags: 0};

    // -------------------------------------------------------------------------
    // Properties: TODO match with server side
    var MIN_TAG_DURATION = 2;
    var MAX_TAG_DURATION = 40;
    var SIMILAR_TAG_LIMIT_RATIO = 0.6;

    var editionTag = new EditionTag(AuthenticationService.getCurrentUser().id);
    $scope.editionTag = editionTag;

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
        },
        slide: function(event, ui) {
            changeSliderValues(ui.values, ui.values[1] === ui.value ? 1 : 0);
        }
    };

    $scope.video = {video_url: null};

    $scope.similarTags = [];
    $scope.sports = SharedData.sports;
    $scope.suggestedTags = [];
    $scope.suggestedCategories = [];
    $scope.suggestedRiders = [];

    // -------------------------------------------------------------------------
    // Functions
    $scope.deleteTag = deleteTag;
    $scope.cancel = cancel;

    $scope.playEditionTag = playEditionTag;
    $scope.saveVideoTag = saveVideoTag;
    $scope.editVideoTag = editVideoTag;
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
        PlayerData.showListTricks = false;
        VideoTagData.reset();
        VideoTagData.getLoader()
                .setFilter('with_pending', true)
                .setFilter('video_id', $stateParams.videoId);
        VideoEntity.view({id: $stateParams.videoId}, function(video) {
            $scope.video = video;
            PlayerData.data.duration = video.duration;
            // When data are loaded we set in the editor the tag id to edit
            if ($stateParams.tagId) {
                VideoTagData
                        .getLoader()
                        .setMode('append')
                        .loadAll()
                        .then(function(data) {
                            console.log("Searching for tag to edit among " + data.items.length + " items");
                            for (var i = 0; i < data.items.length; i++) {
                                var item = data.items[i];
                                if (item.id == $stateParams.tagId) { // @warning $stateParms is a string
                                    console.log("Tag to edit found!");
                                    editVideoTag(item);
                                    return;
                                }
                            }
                            console.log("Cannot find tag to edit: " + $stateParams.tagId);
                            playVideo(video);
                        })
                        .finally(function() {
                            if (PlayerData.currentTag === null) {
                                addNewTag();
                            }
                            SharedData.pageLoader(false);
                        });
            }
            else {
                VideoTagData.getLoader().startLoading();
                playVideo(video);
            }
        }, onError);


        changeSliderValues([0, 10], 1);
    }

    function playVideo(video) {
        return PlayerData.loadVideo(video.provider_id, {video_url: video.video_url})
                .then(addNewTag)
                .finally(function() {
                    SharedData.pageLoader(false);
                });
        // TODO video does not exists anymore
        //.catch(onVideoNotFound);
    }
    function onError(error) {
        console.log("Error viewing this tag");
        console.log(error);
        $state.go('notfound');
    }

    // ----------------------------------------------------------------------- */
    //  EDITION FUNCTIONS 
    // ----------------------------------------------------------------------- */
    function cancel() {
        editionTag.resetOriginal();
    }
    function deleteTag(editionTag) {
        var promise = $scope.formAddVideoTag.submit(
                VideoTagEntity.delete({id: editionTag.getId()}).$promise,
                'button[name="button_remove"]');

        promise.then(function(response) {
            if (response.success) {
                VideoTagData.getLoader()
                        .remove(editionTag.getId())
                addNewTag();
            }
        });
    }

    function updateSimilarTags() {
        $scope.similarTags = findSimilarTags(editionTag._video_tag);
    }

    function addNewTag() {
        PlayerData.showListTricks = false;
        editionTag.resetTag()
                .setId(null)
                .setVideo($scope.video);
        updateSimilarTags();
        playEditionTag();
    }

    function playEditionTag() {
        PlayerData.playVideoTag(editionTag._video_tag);
    }

    function saveVideoTag(editionTag) {
        var postData = editionTag.toPostData();

        if (!editionTag.isNew()) {
            $scope.formAddVideoTag.submit(VideoTagEntity.edit(postData).$promise).then(function(response) {
                if (response.success) {
                    // Copy modifications back in tag
                    editionTag.save();
                    PlayerData.playVideoTag(editionTag._original);
                }
            });
        }
        // Create a new tag
        else {
            console.log(editionTag);
            $scope.formAddVideoTag.submit(VideoTagEntity.add(postData).$promise).then(function(response) {
                if (response.success) {
                    console.log("Creating a new tag!'");
                    editionTag.setStatus(response.data.status);
                    editionTag.setId(response.data.video_tag_id);
                    $scope.similarTags = [];
                    var newTag = editionTag.toVideoTag();
                    editionTag._original = newTag;
                    VideoTagData.getLoader().add(newTag);
                    PlayerData.playVideoTag(newTag);
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
        editionTag.fromVideoTag(videoTag);
        playEditionTag();
        editionTag.isNew() ? updateSimilarTags() : $scope.similarTags = [];
    }

    function loadSimilarTags() {
        var videoTag = editionTag._video_tag;
        PaginateDataLoader.instance('similarTags', VideoTagEntity.similar)
                .init()
                .setFilter('VideoTag', videoTag)
                .startLoading()
                .then(function(data) {
                    $scope.similarTags = data;
                });
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
                id: trick,
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
        if (lastRefreshSuggestedRidersCall !== null && !lastRefreshSuggestedRidersCall.$resolved) {
            lastRefreshSuggestedRidersCall.$cancelRequest();
            lastRefreshSuggestedRidersCall = null;
        }
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
