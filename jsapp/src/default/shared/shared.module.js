angular.module('shared', ['ui.bootstrap', 'app.config'])
    .filter('imageUrl', imageUrl)
    .filter('sportIconUrl', sportIconUrl);

function imageUrl(){
    return function(input) {
        return __PathConfig__.webroot + '/img/' + input;
    };
}
function sportIconUrl(){
    return function(input) {
        return __PathConfig__.webroot + '/img/sports/' + input + '.png';
    };
}
