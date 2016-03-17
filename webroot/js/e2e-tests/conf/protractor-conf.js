exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
//        '../signup.spec.js',
//        '../login.spec.js',
//        '../add-video.spec.js',
//        '../settings.spec.js',
//        '../navigation.spec.js',
        '../playlists.spec.js',
//        '../add-tag.spec.js',
    ],
    defaultTimeoutInterval: 40000,
    multiCapabilities: [{
            browserName: 'chrome'
        },
//  {
//        browserName: 'firefox'
//  },
//  {
//        browserName: 'explorer'
//  }
    ],
    baseUrl: 'http://localhost:8082/Tricker/',
}