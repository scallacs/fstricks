angular.module('app.core')
        .factory('PaginateDataLoader', PaginateDataLoader);

PaginateDataLoader.$inject = ['$q'];
function PaginateDataLoader($q) {

    function PaginateDataLoader(r) {
        this.resource = r;
        this.init();
    }
    PaginateDataLoader.prototype.init = init;
    PaginateDataLoader.prototype.initData = initData;
    PaginateDataLoader.prototype.loadAll = loadAll;
    PaginateDataLoader.prototype.reload = reload;
    PaginateDataLoader.prototype.loadNextPage = loadNextPage;
    PaginateDataLoader.prototype.hasNextPage = hasNextPage;
    PaginateDataLoader.prototype.loadPage = loadPage;
    PaginateDataLoader.prototype.setFilters = setFilters;
    PaginateDataLoader.prototype.updateFilters = updateFilters;
    PaginateDataLoader.prototype.appendFilter = appendFilter;
    PaginateDataLoader.prototype.setFilter = setFilter;
    PaginateDataLoader.prototype.setLimit = setLimit;
    PaginateDataLoader.prototype.remove = remove;
    PaginateDataLoader.prototype.startLoading = startLoading;
    PaginateDataLoader.prototype.setOrder = setOrder;
    PaginateDataLoader.prototype.add = add;
    PaginateDataLoader.prototype.prepend = prepend;
    PaginateDataLoader.prototype.hasData = hasData;
    PaginateDataLoader.prototype.setResource = setResource;
    PaginateDataLoader.prototype.setMapper = setMapper;
    PaginateDataLoader.prototype.setMode = setMode;
    PaginateDataLoader.prototype.getItem = getItem;
    PaginateDataLoader.prototype.getItems = getItems;
    PaginateDataLoader.prototype._onSuccessPageLoad = _onSuccessPageLoad;

    return {
        _instances: {},
        create: function(r) {
            return new PaginateDataLoader(r);
        },
        instance: function(name, r) {
            if (!angular.isDefined(this._instances[name])) {
                this._instances[name] = new PaginateDataLoader(r);
            } else {
                this._instances[name].setResource(r);
            }
            return this._instances[name];
        },
        clear: function() {
            this._instances = {};
        }
    };

    function init() {
        this.filters = {};
        this.initData();
        this.mapper = function(input) {
            return input;
        };
        this.limit = 20; // TODO synchro server
        this.disabled = true;
        this.loading = false;
        //this.resource = null; VideoTagEntity.search; DO NOT RESET
        this.mode = 'append'; // Append to data Other mode: 'replace'
        return this;
    }
    function setMapper(mapper) {
        this.mapper = mapper;
        return this;
    }

    function hasNextPage() {
        return this.mode === 'append' && this.data.total > this.data.items.length;
    }

    function getItem(i) {
        return this.data.items[i];
    }
    function getItems() {
        return this.data.items;
    }

    function setResource(r) {
        this.resource = r;
        return this;
    }

    function setMode(m) {
        this.mode = m;
        return this;
    }

    function setLimit(l) {
        this.limit = l;
        this.setFilter('limit', l);
        return this;
    }

    function hasData() {
        return this.data.items.length > 0;
    }

    function setOrder(value) {
        this.filters.order = value;
        return this;
    }

    function add(tag) {
        this.data.items.push(tag);
        this.data.total += 1;
    }
    // Add item in first position
    function prepend(tag) {
        this.data.items.unshift(tag);
        this.data.total += 1;
    }

    function loadAll() {
        var that = this;
        var deferred = $q.defer();

        this.loadNextPage()
                .then(successCallback)
                .catch(function() {
                    deferred.reject(0);
                });

        return deferred.promise;

        // results contains only the last page
        function successCallback(results) {
            if (that.disabled) {
                deferred.resolve(that.data);
            } else {
                that.loadNextPage().then(successCallback);
            }
        }
    }

    function startLoading() {
        this.disabled = false;
        this.currentPage = 1;
        return this.loadNextPage();
    }

    function loadNextPage() {
        var that = this;
        this.disabled = true;
        var promise = this.loadPage(this.currentPage);
        this.currentPage += 1;
        promise.then(function(data) {
            if (data.items.length < data.perPage) {
                console.log('disabling video tag data loader');
                that.disabled = true;
            } else {
                that.disabled = false;
            }
        });
        return promise;
    }

    function loadPage(page) {
        var that = this;
        console.log('Request page ' + page + ' with filter: ');
        console.log(this.filters);
        //        console.log(that.data.items);
        if (!angular.isDefined(this.cachePage[page])) {
            this.filters.page = page;
            this.loading = true;
            this.cachePage[page] = this.resource(this.filters).$promise;
        }
        this.cachePage[page]
                .then(function(data) {
                    that._onSuccessPageLoad(data)
                })
                .catch(function() {
                    that.disabled = true;
                })
                .finally(function() {
                    that.loading = false;
                });
        return this.cachePage[page];
    }

    function setFilter(name, value) {
        this.filters[name] = value;
        return this;
    }
    function appendFilter(name, value) {
        this.filters[name] = this.filters[name] ? this.filters[name] + ',' + value : value;
        return this;
    }

    function _onSuccessPageLoad(data) {
        this.data.perPage = data.perPage;
        this.data.total = data.total;
        this.data.extra = data.extra;
        var tags = data.items;
        console.log('[Loader] Loading page ' + this.filters.page + ': ' + tags.length + ' item(s)');
        if (this.mode !== 'append') {
            this.data.items = [];
        }

        for (var i = 0; i < tags.length; i++) {
            this.data.items.push(this.mapper(tags[i]));
        }
        console.log('[Loader] ' + this.data.items.length + '/' + data.total + ' items');
//        }
//        else {
//            this.data.items = tags;
//        }
    }

    function setFilters(value) {
        this.init();
        console.log("Setting filters: ");
        console.log(value);
        this.filters = value;
        return this;
    }

    function updateFilters(filters) {
        var self = this;
//        var restrictif = true;
        angular.forEach(filters, function(val, key) {
//            restrictif = restrictif && !this.filters[key];
            self.filters[key] = val;
        });
        return this;
    }

    function initData() {
        this.data = {
            total: 0,
            perPage: null,
            items: []
        };
        this.currentPage = 1;
        this.cachePage = {};
        return this;
    }
    
    function reload(){
        console.log('Reloading with following filters:');
        console.log(this.filters);
        this.initData();
        return this.loadPage(1);
    }

    function remove(id) {
        for (var i = 0; i < this.data.items.length; i++) {
            if (this.data.items[i].id === id) {
                this.data.items.splice(i, 1);
                return;
            }
        }
        console.log("Cannot find item to remove: " + id);
    }
}