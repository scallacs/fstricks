angular.module('app.player')
        .directive('trickList', trickList);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function trickList() {
    return {
        template: 'trick-list.html',
        controller: function($scope) {
            
        },
        link: function(scope, elem, attr, form) {

        }
    };

}
