angular.module('shared', ['ui.bootstrap', 'app.config'])
    .filter('imageUrl', imageUrl)
    .filter('sportIconUrl', sportIconUrl)
    .filter('sportImageUrl', sportImageUrl);

function imageUrl(){
    return function(input) {
        return __PathConfig__.webroot + 'img/' + input;
    };
}
function sportIconUrl(){
    return function(input) {
        return __PathConfig__.webroot + 'img/sports/' + input + '.png';
    };
}
function sportImageUrl(){
    return function(input) {
        return __PathConfig__.webroot + 'img/sports/homepage/' + input + '.jpg';
    };
}
