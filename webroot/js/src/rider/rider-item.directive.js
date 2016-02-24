angular
        .module('app.rider')
        .directive('riderItem', RiderItem);

function RiderItem() {
    return {
        restrict: 'EA',
        templateUrl: 'js/src/rider/partials/rider-item.html',
        scope: {
            rider: '=rider'
        }
    };
}
