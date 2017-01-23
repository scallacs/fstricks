exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        '../signup.spec.js',
        '../login.spec.js',
        '../add-video.spec.js',
        '../settings.spec.js',
        '../navigation.spec.js',
        '../playlists.spec.js',
        '../add-tag.spec.js',
        '../manage-tag.spec.js',
        '../rider.spec.js',
    ],
    defaultTimeoutInterval: 40000,
    multiCapabilities: [
        {
            browserName: 'chrome'
        },
        // @warnign: do not parallize because DB will not work
//        {
//            browserName: 'firefox'
//        }
//        {
//            'browserName': 'internet explorer',
//            'platform': 'ANY',
//            'version': '11'
//        }
    ],
    baseUrl: 'http://dev.fstricks.localhost/', // TODO use config
//    onPrepare: function() {
//// implicit and page load timeouts
//        browser.manage().timeouts().pageLoadTimeout(40000);
//        browser.manage().timeouts().implicitlyWait(25000);
//
//        // for non-angular page
//        browser.ignoreSynchronization = true;
//
//        // sign in before all tests
//
//    }
}