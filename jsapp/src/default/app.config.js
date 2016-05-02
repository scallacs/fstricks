angular.module('app.config', ['app.account'])
        .run(Run);


Run.$inject = ['$rootScope', 'AuthenticationService', 'loginModal', '$state', 'SharedData'];
function Run($rootScope, AuthenticationService, loginModal, $state, SharedData) {
    AuthenticationService.init();
    SharedData.init();

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        SharedData.setCurrentSearch(null);

        if (toState.redirectTo) {
            event.preventDefault();
            $state.go(toState.redirectTo, toParams);
            return;
        }
        //console.log('$stateChangeStart: ' + event);
        var requireLogin = toState.data ? toState.data.requireLogin : false;

        if (requireLogin && !AuthenticationService.isAuthed()) {
            console.log('DENY USER ACCESS FOR THIS LOCATION');
            event.preventDefault();

            var wasLoading = SharedData.loadingState;
            SharedData.pageLoader(false);
            loginModal.open().result
                    .then(function() {
                        if (loginModal.isset()) {
                            console.log("Login success, continuing");
                            SharedData.pageLoader(wasLoading);
                            return $state.go(toState.name, toParams);
                        }
                    })
                    .catch(function() {
                        if (loginModal.isset()) {
                            console.log("Closing modal with catch");
                            return $state.go('home');
                        }
                    });
        }
        else {
            loginModal.dismiss();
        }
        SharedData.pageLoader(toState.data.pageLoader);
    });

}
