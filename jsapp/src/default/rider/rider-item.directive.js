angular
        .module('app.rider')
        .directive('riderItem', RiderItem);

function RiderItem() {
    return {
        restrict: 'EA',
        templateUrl: __PathConfig__.template + '/rider/partials/rider-item.html',
        scope: {
            rider: '=rider'
        }
    };
}
