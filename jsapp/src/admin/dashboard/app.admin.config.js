angular.module('app.admin')
        .config(RestangularProviderConfig);


RestangularProviderConfig.$inject = ['RestangularProvider', '$windowProvider'];
function RestangularProviderConfig(RestangularProvider, $windowProvider) {
    // RESPONSE
    RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response) {
        if (response.status == 401) {
            alert('ok');
            window.location.href = '/make-me-god-please';
//            $windowProvider.$get = ['$window', function($window) {
//                    $window.location.href = '/make-me-god-please';
//                }];
        }
        if (operation === "getList") {
//            var contentRange = response.headers('Content-Range');
//            response.totalCount = contentRange.split('/')[1];
//            console.log(response);
            //var body = response.body();
            response.totalCount = response.data.total;
            data = response.data.items;
        }

        return data;
    });
    // REQUEST
    RestangularProvider.addFullRequestInterceptor(function (element, operation, what, url, headers, params, httpConfig) {
        if (operation === 'getList') {
            params.page = params._page;
            params.limit = params._perPage;

            params.sort = params._sortField || null;
            params.direction = params._sortDir || null;

            delete params._page;
            delete params._perPage;
            delete params._sortField;
            delete params._sortDir;

            if (params._filters) {
                for (var filter in params._filters) {
                    params[filter] = params._filters[filter];
                }
                delete params._filters;
            }
        }
        return {params: params};
    });
}
;
