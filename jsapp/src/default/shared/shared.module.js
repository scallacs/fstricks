angular.module('shared', ['app.config', 'ui.bootstrap'])
    .filter('imageUrl', imageUrl);

function imageUrl(){
    return function(input) {
        return WEBROOT_FULL + '/img/sports/' + input + '.png';
    };
}
