angular.module('shared', ['app.config', 'ui.bootstrap'])
    .filter('imageUrl', imageUrl)
    .filter('sportIconUrl', sportIconUrl);

function imageUrl(){
    return function(input) {
        return WEBROOT_FULL + '/img/' + input;
    };
}
function sportIconUrl(){
    return function(input) {
        return WEBROOT_FULL + '/img/sports/' + input + '.png';
    };
}
