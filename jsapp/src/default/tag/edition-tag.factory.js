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

    function onApiCall(name, fct) {
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
    
    function __getSafeProperty(obj, path){
        var attrs = path.split('.');
        for (var i = 0; i < attrs.length; i++){
            if (!obj) return obj;
            obj = obj[attrs[i]];
        }
        return obj;
    }
    function isDirty() {
        if (!angular.isDefined(this._original) || this._original === null || !this._video_tag.id) {
            return true;
        }
        var a = this._video_tag;
        var b = this._original;
        return a.begin !== b.begin
                || a.end !== b.end
                || a.status !== b.status
                || __getSafeProperty(a, 'rider.id') !== __getSafeProperty(b, 'rider.id')
                || __getSafeProperty(a, 'tag.id') !== __getSafeProperty(b, 'tag.id')
                || __getSafeProperty(a, 'tag.name') !== __getSafeProperty(b, 'tag.name')
                || __getSafeProperty(a, 'tag.category.id') !== __getSafeProperty(b, 'tag.category.id');
        
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
        this._video_tag.tag.id = null;
        this._video_tag.tag.name = null;
        this._video_tag.tag.slug = null;
        return this;
    }

    function hasCategory() {
        return this._video_tag.tag && this._video_tag.tag.category && this._video_tag.tag.category.id;
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
                category: null
            },
            rider: null
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
    function moveForward() {
        var duration = this._video_tag.end - this._video_tag.begin;
        this._extra.range[0] = Math.min(this._video_tag.end, this._video_tag.video.duration - this._config.min_duration);
        this._video_tag.begin = this._extra.range[0];
        this._extra.range[1] = this._video_tag.begin + Math.min(duration, (this._video_tag.video.duration - this._video_tag.begin));
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
            rider_id: __getSafeProperty(this._video_tag, 'rider.id'),
            id: this._video_tag.id,
            status: this._video_tag.status
        };
        if (this._video_tag.tag.is_new) {
            console.log("CREATING NEW TAG:");
            postData.tag = {
                name: this._video_tag.tag.name,
                category_id: this._video_tag.tag.category.id
            };
        }
        else {
            postData.tag_id = this._video_tag.tag.id;
        }
        return postData;
    }

    function toVideoTag() {
        return angular.copy(this._video_tag);
    }

    return EditionTag;
}