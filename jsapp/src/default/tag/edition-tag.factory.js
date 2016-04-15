angular.module('app.tag')
        .factory('EditionTag', EditionTag);


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
        setRider: setRider,
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
        return  a.begin !== b.begin 
                || a.end !== b.end
                || ((a.tag.id && a.tag.id !== b.tag.id) || (!a.tag.id && a.tag.name !== b.tag.name))
                || a.rider.id !== b.rider.id
                || a.category.id !== b.category.id 
                || a.video.id !== b.video.id
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
        this._video_tag.tag = null;
        return this;
    }

    function hasCategory() {
        return this._video_tag.tag.category.id;
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
        this._video_tag.video = data;
        return this;
    }

    function init() {
        this._original = null;

        this._video_tag = {
            mode: 'edition',
            id: null,
            user_id: this._user_id,
            provider_id: null,
            tag: {
                category: {},
                sport: {},
            },
            rider: {}
        };

        this.setEditabled();

        this._extra = {
            range: [0, 2]
        };
    }

    function hasRider() {
        return this._video_tag.rider && this._video_tag.rider.id;
    }
    function setRider(rider) {
        this._video_tag.rider = rider;
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
        this.setEditabled();
        return this;
    }

    function isEditabled() {
        if (this._editabled === true || this._editabled === false) {
            return this._editabled;
        }
        angular.forEach(this._editabled, function(val) {
            if (val === false) {
                return false;
            }
        });
        return true;
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
    }

    function isNew() {
        return !this._video_tag.id;
    }
    function isFieldEditabled(fieldname) {
        return this._editabled === true
                || (angular.isDefined(this._editabled[fieldname]) && this._editabled[fieldname]);
    }

    function toPostData() {
        var postData = {
            video_id: this._video_tag.video.id,
            begin: this._video_tag.begin,
            end: this._video_tag.end,
            rider_id: this._video_tag.rider.id,
            tag_id: this._video_tag.tag.id,
            id: this._video_tag.id,
            status: this._video_tag.status
        };
        if (this._video_tag.tag.is_new) {
            console.log("CREATING NEW TAG:");
            postData.tag = this._video_tag.tag;
//            postData.tag.category_id = this._extra.category.category_id;
        }
        return postData;
    }

    function toVideoTag() {
        return angular.copy(this._video_tag);
    }

    return EditionTag;
}