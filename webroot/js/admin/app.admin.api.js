angular.module('app.admin')
        .factory('AdminApiFactory', AdminApiFactory);

AdminApiFactory.$inject = ['Api', 'ApiResourceFactory'];
function AdminApiFactory(Api, ApiResourceFactory ) {
    return {
        api: function() {
            return new Api(ApiResourceFactory.create(ADMIN_API_BASE_URL + '/:controller/:action/:_id.json', {_id: '@_id', action: '@action', controller: '@controller'}));
        },
        endpoint: function(controller, action, id){
            var url = ADMIN_API_BASE_URL + '/' + controller + '/' + action;
            if (angular.isDefined(id)){
                url += '/' + id;
            }
            url += '.json';
            return ApiResourceFactory.create(url, {});
        }
    };
}