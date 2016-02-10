exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['*.spec.js'],
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