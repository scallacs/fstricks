angular.module('CommonModule').filter('camelCase', function() {
    return function(str) {
        str = str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
        str[0] = str.charAt(0).toUpperCase();
        return str;
    };
});