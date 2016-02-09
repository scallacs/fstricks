angular.module('shared')
        .filter('percentage', function() {
    return function(input, total) {
        return (parseInt(input) * 100.0 / total) + '%';
    };
});
