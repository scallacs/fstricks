angular.module('app.core')
        .factory('ApiResourceFactory', ApiResourceFactory)
        .factory('Api', Api)
        .factory('ApiFactory', ApiFactory);

ApiResourceFactory.$inject = ['$resource'];
function ApiResourceFactory($resource) {
    return {
        create: function(url, options) {
            return $resource(url, options, {
                'get': {method: 'GET', _id: null},
                'save': {method: 'POST'},
                'query': {method: 'GET', isArray: true, _id: null},
                'remove': {method: 'DELETE'}
            });
        }
    };
}


Api.$inject = [];
function Api() {

    function Api(r) {
        this.resource = r;
    }

    Api.prototype.get = get;
    Api.prototype.save = save;
    Api.prototype.query = query;
    Api.prototype.paginate = paginate;
    Api.prototype.remove = remove;

    return Api;


    function _call(resource, type, controller, action, extra) {
        var params = {
            controller: controller,
            action: action
        };
        if (angular.isDefined(extra)) {
            angular.extend(params, extra);
        }
        return resource[type](params).$promise;
    }

    function get(controller, action, extra) {
        return _call(this.resource, 'get', controller, action, extra);
    }
    function save(controller, action, extra) {
        return _call(this.resource, 'save', controller, action, extra);
    }
    function query(controller, action, extra) {
        return _call(this.resource, 'query', controller, action, extra);
    }
    function paginate(controller, action, extra) {
        return _call(this.resource, 'paginate', controller, action, extra);
    }
    function remove(controller, action, extra) {
        return _call(this.resource, 'remove', controller, action, extra);
    }
}


ApiFactory.$inject = ['Api', 'ApiResourceFactory'];
function ApiFactory(Api, ApiResourceFactory ) {
    return {
        api: function() {
            return new Api(ApiResourceFactory.create(API_BASE_URL + '/:controller/:action/:_id.json', {_id: '@_id', action: '@action', controller: '@controller'}));
        },
        endpoint: function(controller, action, id, extra){
            var url = API_BASE_URL + '/' + controller + '/' + action;
            url += angular.isDefined(id) ? '/' + id : '/:_id';
            url += '.json';
            if (!angular.isDefined(extra)){
                extra = {};
            }
            console.log("Creating endpoint: " + url);
            return ApiResourceFactory.create(url, extra);
        }
    };
}
