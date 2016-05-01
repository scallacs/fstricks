angular
        .module('app.core')
        .factory('VideoTagData', VideoTagData);

VideoTagData.$inject = ['PaginateDataLoader', 'VideoTagEntity', 'SharedData', '$timeout'];
function VideoTagData(PaginateDataLoader, VideoTagEntity, SharedData, $timeout) {

    var obj = {
        appendFilters: false,
        getLoader: function () {
            return PaginateDataLoader.instance('default', VideoTagEntity.search);
        },
        focusSearchBar: function () {
            console.log("Focussing search bar: ");
            $timeout(function () {
                angular.element('#SearchBar .form-control').triggerHandler('click');
            }, 1);
        },
        filters: [],
        removeSearchFilter: function (filter, triggerUpdate) {
            var i = obj.filters.indexOf(filter);
            obj.filters.splice(i, 1);
            this._removeFilter(filter);
            if (triggerUpdate) {
                this.reload();
            }
        },
        _removeFilter: function (data) {
            if (['playlist', 'tag', 'rider', 'video'].indexOf(data.type) !== -1) {
                this.getLoader().removeFilter(data.type + '_id', data.id);
            } else if (data.type === 'search') {
                this.getLoader().removeFilter(data.type, data.q);
            }
        },
        reload: function () {
            SharedData.pageLoader(true);
            this.getLoader().reload().finally(function () {
                SharedData.pageLoader(false);
            });
        },
        _appendFilter: function (data) {
            if (['playlist', 'tag', 'rider', 'video', 'category', 'sport'].indexOf(data.type) !== -1) {
                this.getLoader().appendFilter(data.type + '_id', data.id);
            } 
            else if (data.type === 'search') {
                this.getLoader().appendFilter('q', data.q);
            }
        },
        addSearchFilter: function (data, triggerUpdate) {
            if (data.active || this.hasSearchFilter(data)) return;
            data.removable = angular.isDefined(data.removable) ? data.removable : true;
            data.active = true;
            this.filters.push(data);
            this._appendFilter(data);
            // Trigger an update if required
            if (triggerUpdate) {
                this.reload();
            }
            return this;
        },
        hasSearchFilter: function(data){
            for (var i = 0; i < this.filters.length; i++){
                if (this.filters[i].id == data.id && this.filters[i].type == data.type) return true;
            }
            return false;
        },
        addPermanentFilter: function (data, triggerUpdate) {
            SharedData.setCurrentSearch(data);
            data.removable = false;
            this.addSearchFilter(data, triggerUpdate);
            return this;
        },
        currentTag: null,
        setCurrentTag: function (tag) {
            this.currentTag = tag;
        },
        reset: function () {
            PaginateDataLoader.instance('default', VideoTagEntity.search).init();
            this.filters = [];
            this.appendFilters = false;
            this.currentTag = null;
        },
        next: function () {
            return this.getItems()[Math.min(this.getItems().length - 1, this._getCurrentIndice() + 1)];
        },
        getItems: function () {
            return this.getLoader().data.items;
        }, hasPrev: function () {
            return this.getItems().length > 0 && obj.currentTag !== null && obj.currentTag.id !== this.getItems()[0].id;
        }, hasNext: function () {
            //console.log(obj.currentTag.id+ ' != ' + this.getItems()[this.getItems().length - 1].id);
            return this.getItems().length > 0 && obj.currentTag !== null && obj.currentTag.id !== this.getItems()[this.getItems().length - 1].id;
        },
        prev: function () {
            return this.getItems()[Math.max(0, this._getCurrentIndice() - 1)];
        },
        findNextTagToPlay: function (playerTime) {
            return this._findTagToPlay(playerTime, 1);
        },
        findPreviousTagToPlay: function (playerTime) {
            return this._findTagToPlay(playerTime, -1);
        },
        _findTagToPlay: function (playerTime, m) {
            for (var i = 0; i < this.getItems().length; i++) {
                if (m * this.getItems()[i].begin > m * playerTime) {
                    console.log("Found next tag: " + this.getItems()[i].id);
                    return this.getItems()[i];
                }
            }
            return null;
        },
        _getCurrentIndice: function () {
            if (obj.currentTag === null) {
                return 0;
            }
            for (var i = 0; i < this.getItems().length; i++) {
                if (this.getItems()[i].id === obj.currentTag.id) {
                    return i;
                }
            }
            return 0;
        }
    };

    obj.getLoader().setResource(VideoTagEntity.search);

    return obj;
}