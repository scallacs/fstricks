angular.module('app.tag', ['app.core', 'ui.bootstrap', 'ui.select', 'ui.router',
    'ui.slider'
])
        .controller('SearchTagController', SearchTagController)
        .controller('ModalReportErrorController', ModalReportErrorController)
        .factory('EditionTag', EditionTag) 
        .config(Config);

Config.$inject = ['$stateProvider'];
function Config($stateProvider) {
    var baseUrl = TEMPLATE_URL + '/tag/partials/';

    $stateProvider
            .state('addtag', {
                url: '/tag/add/:videoId/:tagId',
                views: {
                    viewNavRight: {
                        template: '<div player-nav></div>'
                    },
                    '': {
                        templateUrl: baseUrl + 'add-video-tag.html',
                        controller: 'AddVideoTagController'
                    },
                },
                data: {
                    requireLogin: true,
                    pageLoader: true
                }
            });
}

SearchTagController.$inject = ['$scope', 'TagEntity'];
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

ModalReportErrorController.$inject = ['$scope', '$uibModalInstance', 'ErrorReportEntity', 'videoTag'];
function ModalReportErrorController($scope, $uibModalInstance, ErrorReportEntity, videoTag) {

    $scope.videoTag = videoTag;
    $scope.errorReport = {};

    $scope.ok = function() {
        $uibModalInstance.close($scope.videoTag);
    };

    $scope.cancel = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.sendReport = function(errorReport) {
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


function EditionTag() {

    function EditionTag(userId, apiMap, role, config) {
        this._user_id = userId;
        this.init();
        this._apiMap = apiMap;
        this._role = role ? role : 'user';
        this._config = config;
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
        isOwner: isOwner,
        remove: remove,
        callApi: callApi,
        hasApi: hasApi,
        moveForward: moveForward,
        onApiCall: onApiCall
    };

    function onApiCall(name, fct){
        this._apiMap[name] = fct;
        return this;
    }

    function remove() {
        return this.callApi('delete', {id: this.getId()});
    }
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
//        console.log(a);console.log(b);
        return a.begin !== b.begin || a.end !== b.end
                || ((a.tag_id && a.tag_id !== b.tag_id) || (!a.tag_id && a.tag_name !== b.tag_name))
                || a.rider_id !== b.rider_id
                || a.category_id !== b.category_id 
                || a.video_id !== b.video_id
                || a.status !== b.status;
    }

    function setStatus(val) {
        this._video_tag.status = val;
    }
    function resetOriginal() {
        this.fromVideoTag(this._original);
    }

    function allowedToRemove() {
        return !this.isNew() && ((!this.isValidated() && this.isOwner()) || this._role === 'admin');
    }

    function callApi(name, param) {
        return this._apiMap[name](param);
    }
    function hasApi(name) {
        return this._apiCall[name] == true;
    }

    function save() {
        var self = this;
        if (this.isNew()) {
            var promise = this.callApi('add', this.toPostData());
            promise
                    .then(function(response) {
                        if (response.success) {
                            console.log("Creating a new tag!'");
                            self.setStatus(response.data.status);
                            self.setId(response.data.video_tag_id);
                            self._original = self.toVideoTag();
                        }
                    });
            return promise;
        }
        else {
            var promise = this.callApi('edit', this.toPostData());
            promise.then(function(response) {
                if (response.success) {
                    angular.copy(self._video_tag, self._original);
                }
            });
            return promise;
        }
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
        this._video_tag.video_duration = data.duration;
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
    
    function moveForward(){
        var duration = this._video_tag.end - this._video_tag.begin;
        this._extra.range[0] = Math.min(this._video_tag.end, this._video_tag.video_duration - this._config.min_duration);
        this._video_tag.begin = this._extra.range[0];
        this._extra.range[1] = this._video_tag.begin + Math.min(duration, (this._video_tag.video_duration - this._video_tag.begin));
        this._video_tag.end = this._extra.range[1];
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
            sport_name: this._video_tag.sport_name
        };
        this.setEditabled();
        return this;
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
        if (this.isNew() || this._role === 'admin') {
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
            console.log("CREATING NEW TAG:");
            console.log(this._extra.category);
            postData.tag = this._extra.tag;
            postData.tag.category_id = this._extra.category.category_id;
        }
        return postData;
    }

    function toVideoTag() {
        return angular.copy(this._video_tag);
    }

    return EditionTag;
}