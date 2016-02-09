angular.module('shared')
        .filter('datasize', function() {
    return function(input) {
        if (input > 1024.0) {
            return (input / 1024).toFixed(4) + ' KB';
        } else if (input > 1024 * 1024) {
            return (input / 1024.0 * 1024).toFixed(4) + ' MB';
        }
    };
});