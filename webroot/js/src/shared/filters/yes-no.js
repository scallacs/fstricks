angular.module('shared')
        .filter('yesNo', function() {
    return function(input) {
        return input ? 'yes' : 'no';
    };
});