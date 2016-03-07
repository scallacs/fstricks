angular.module('app.admin')
        .factory('AdminApiResourceFactory', AdminApiResourceFactory)
        .factory('AdminApiFactory', AdminApiFactory)
        .factory('Api', Api);

AdminApiResourceFactory.$inject = ['$resource'];
function AdminApiResourceFactory($resource) {
    return {
        create: function(url, options) {
            url = ADMIN_API_BASE_URL + url;
            return $resource(url, options, {
                'get': {method: 'GET', _id: null},
                'save': {method: 'POST'},
                'query': {method: 'GET', isArray: true, _id: null},
                'remove': {method: 'DELETE', _id: null}
            });
        }
    };
}

AdminApiFactory.$inject = ['Api', 'AdminApiResourceFactory'];
function AdminApiFactory(Api, AdminApiResourceFactory ) {
    return {
        api: function() {
            return new Api();
        },
        endpoint: function(controller, action, id){
            var url = '/' + controller + '/' + action;
            if (angular.isDefined(id)){
                url += '/' + id;
            }
            url += '.json';
            return AdminApiResourceFactory.create(url, {});
        }
    };
}


Api.$inject = ['AdminApiResourceFactory'];
function Api(AdminApiResourceFactory) {

    function Api() {
        this.resource = AdminApiResourceFactory.create('/:controller/:action/:_id.json',
            {_id: '@_id', action: '@action', controller: '@controller'});
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
