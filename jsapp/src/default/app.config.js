angular.module('app.config', ['app.account', 'angular-google-analytics'])
        .run(Run)
        .config(ConfigAnalytics);


Run.$inject = ['$rootScope', 'AuthenticationService', 'loginModal', '$state', 'SharedData', 'Analytics', '$location'];
function Run($rootScope, AuthenticationService, loginModal, $state, SharedData, Analytics, $location) {
    AuthenticationService.init();
    SharedData.init();

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
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
                    .then(function () {
                        if (loginModal.isset()) {
                            console.log("Login success, continuing");
                            SharedData.pageLoader(wasLoading);
                            return $state.go(toState.name, toParams);
                        }
                    })
                    .catch(function () {
                        if (loginModal.isset()) {
                            console.log("Closing modal with catch");
                            return $state.go('home');
                        }
                    });
        } else {
            loginModal.dismiss();
        }
        SharedData.pageLoader(toState.data.pageLoader);
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
//        console.log(toState);
        Analytics.trackPage($location.url());
//        Analytics.pageView();
    });
}

ConfigAnalytics.$inject = ['AnalyticsProvider'];
function ConfigAnalytics(AnalyticsProvider) {
    AnalyticsProvider.setAccount({
        tracker: 'UA-75671817-1',
//                name: "fstricks-tracker-1",
//                fields: {
//                    cookieDomain: 'foo.example.com',
//                    cookieName: 'myNewName',
//                    cookieExpires: 20000
//                            // See: [Analytics Field Reference](https://developers.google.com/analytics/devguides/collection/analyticsjs/field-reference) for a list of all fields.
//                },
//                crossDomainLinker: true,
//                crossLinkDomains: ['domain-1.com', 'domain-2.com'],
//        displayFeatures: true,
//        enhancedLinkAttribution: true,
//                select: function (args) {
//                    // This function is used to qualify or disqualify an account object to be run with commands.
//                    // If the function does not exist, is not a function, or returns true then the account object will qualify.
//                    // If the function exists and returns false then the account object will be disqualified.
//                    // The 'args' parameter is the set of arguments (which contains the command name) that will be sent to Universal Analytics.
//                    return true;
//                },
//                set: {
//                    forceSSL: true
//                            // This is any set of `set` commands to make for the account immediately after the `create` command for the account.
//                            // The property key is the command and the property value is passed in as the argument, _e.g._, `ga('set', 'forceSSL', true)`.
//                            // Order of commands is not guaranteed as it is dependent on the implementation of the `for (property in object)` iterator.
//                },
        trackEvent: true,
        trackEcommerce: false
    })
            .logAllCalls(false)
            .setDomainName(__PathConfig__.domain)
            .trackPages(true)// Track all routes (default is true).
            .trackUrlParams(true) // Track all URL query params (default is false).
//            .startOffline(true)
//            .enterDebugMode(true)
            ;
}