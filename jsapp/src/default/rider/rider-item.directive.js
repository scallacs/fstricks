angular
        .module('app.rider')
        .directive('riderItem', RiderItem);

function RiderItem() {
    return {
        restrict: 'EA',
        templateUrl: TEMPLATE_URL + '/rider/partials/rider-item.html',
        scope: {
            rider: '=rider'
        }
    };
}
