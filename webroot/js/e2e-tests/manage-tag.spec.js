var Application = require('./includes/pages.js');
var FormAddVideo = require('./includes/form-add-video.js');
var FormAddTag = require('./includes/form-add-tag.js');
var Util = require('./includes/util.js');

describe('Manage tags: ', function() {
    var app = new Application();
    var nav = app.topNav();
    var util = new Util();

    beforeAll(function() {
        app.login().then(function() {
            nav.navigateTo('dashboard');
            browser.waitForAngular();
        });
    });

    it('Should be possible to edit a tag', function() {
       // TODO  
    });

    it('Should be possible to remove a tag not validated', function() {
        // TODO 
    });

});