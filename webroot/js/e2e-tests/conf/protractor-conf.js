exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        '../signup.spec.js',
//        '../login.spec.js',
//        '../add-video.spec.js',
//        '../settings.spec.js',
//        '../navigation.spec.js',
//        '../playlists.spec.js',
//        '../add-tag.spec.js',
        '../manage-tag.spec.js',
    ],
    defaultTimeoutInterval: 40000,
    multiCapabilities: [
        {
            browserName: 'chrome'
        },
//        {
//            browserName: 'firefox'
//        },
//        {
//            'browserName': 'internet explorer',
//            'platform': 'ANY',
//            'version': '11'
//        }
    ],
    baseUrl: 'http://localhost:8082/Tricker/',
    onPrepare: function() {
// implicit and page load timeouts
        browser.manage().timeouts().pageLoadTimeout(40000);
        browser.manage().timeouts().implicitlyWait(25000);

        // for non-angular page
        browser.ignoreSynchronization = true;

        // sign in before all tests

    }
}