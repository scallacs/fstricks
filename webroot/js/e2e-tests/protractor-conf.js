exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['*.spec.js'],
    defaultTimeoutInterval: 25000,
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
    baseUrl: 'http://localhost:8000/Tricker/',
}