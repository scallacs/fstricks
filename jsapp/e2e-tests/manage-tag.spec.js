var Application = require('./includes/pages.js');
var FormAddVideo = require('./includes/form-add-video.js');
var FormAddTag = require('./includes/form-add-tag.js');
var VideoTagItem = require('./includes/video-tag-item.js');
var Util = require('./includes/util.js');

describe('Manage tags: ', function() {
    var app = new Application();
    var nav = app.topNav();
    var util = new Util();

    beforeAll(function() {
        app.login();
    });

    beforeEach(function() {
        nav.navigateTo('mytricks');
    });

    it('Should be possible to change tabs', function() {
        var tabs = new util.tabs(element(by.id('TabsetVideoTags')));
        tabs.change('Rejected');
        browser.waitForAngular();
        tabs.change('Officials');
        browser.waitForAngular();
        tabs.change('Pendings');
    });

    it('Should be possible to remove a tag not validated', function() {
        var videoTagItem = new VideoTagItem(element.all(by.css('.item-video-tag')).get(0));
        videoTagItem.openOptionLinkByCss('.btn-remove-item').then(function() {
            var dialog = new util.modalDialog();
            browser.sleep(1000);
            dialog.ok().then(function() {

            });
        });
    });

    it('Should be possible to edit a tag', function() {
        var videoTagItem = new VideoTagItem(element.all(by.css('.item-video-tag')).get(1));
        videoTagItem.openOptionLinkByState('addtag').then(function() {
            app.assertLocation('addtag');
        });
    });


});