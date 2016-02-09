angular.module('app.player')
        .directive('playerContainer', playerContainer);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function playerContainer() {
    return {
        template: 'player-container.html',
        controller: function($scope) {
            
        },
        link: function(scope, elem, attr, form) {

        }
    };

}
