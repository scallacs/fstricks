var Application = require('./includes/pages.js');
var FormAddVideo = require('./includes/form-add-video.js');
var FormAddTag = require('./includes/form-add-tag.js');
var Util = require('./includes/util.js');

describe('Add tag on video: ', function() {
    var app = new Application();
    var nav = app.topNav();
    var util = new Util();

    var validYoutubeId = "GF6Ct6B1yfM";
//    var videoId = 45;
    var formAddVideoTag;

    beforeAll(function() {
        app.login().then(function() {
            nav.navigateTo('addvideo');
            browser.waitForAngular();
            var videoForm = new FormAddVideo(element(by.id('FormAddVideo')));
            videoForm.changeTab('Youtube').then(function() {
                videoForm.setUrl(validYoutubeId);
                videoForm.submit().then(function() {
                    formAddVideoTag = new FormAddTag(element(by.id('FormAddVideoTag')));
                });
            });
        });
    });

    it('Should be possible to create a tag', function() {
        formAddVideoTag.increaseBeginTime();
        formAddVideoTag.decreaseBeginTime();

        formAddVideoTag.increaseEndTime();
        formAddVideoTag.decreaseEndTime();

        expect(formAddVideoTag.isValid()).toBe(false);

        formAddVideoTag.setRider('Torstein');
        expect(formAddVideoTag.isValid()).toBe(false);

        formAddVideoTag.setCategory('snowboard kicker');
        expect(formAddVideoTag.isValid()).toBe(false);

        formAddVideoTag.setTag('double backflip');
        expect(formAddVideoTag.isValid()).toBe(true);

        formAddVideoTag.submit().then(function() {
            browser.waitForAngular();

            it('It should be possible to remove the newly created tag', function() {
                formAddVideoTag.remove().then(function() {

                });
            });
        });

    });

    describe('RIDER', function() {

        function getRiderForm() {
            return element(by.id('FormAddRider'));
        }

        beforeEach(function() {
//            getRiderForm().element(by.css('button[ng-click="cancel()"]')).click();
        });

        it('Should be possible to add a new rider with the plus button', function() {

            formAddVideoTag.showRiderForm().then(function() {
                var formAddRider = new util.form(element(by.id('FormAddRider')));

                formAddRider.fill([
                    {model: 'rider.firstname', value: 'Yep', clear: true},
                    {model: 'rider.lastname', value: 'Lastname', clear: true},
                    {model: 'rider.nationality', value: 'fr'}
                ]);


                formAddRider.submit().then(function() {

                });
            });
        });

        it('Should be possible to add a new rider when searching', function() {

            formAddVideoTag.setRider('newrider lastname');
            var formAddRider = new util.form(getRiderForm());
            expect(formAddRider.read('rider.firstname')).toBe('newrider');
            expect(formAddRider.read('rider.lastname')).toBe('lastname');

            formAddRider.fill([
                {model: 'rider.nationality', value: 'fr'}
            ]);
            formAddRider.submit().then(function() {

            });
        });
//        TODO
//        it('Should NOT BE possible to add an existing rider', function() {
//
//            formAddVideoTag.showRiderForm().then(function() {
//                var formAddRider = new util.form(getRiderForm());
//
//                formAddRider.fill([
//                    {model: 'rider.firstname', value: 'torstein', clear: true},
//                    {model: 'rider.lastname', value: 'HoRgmo', clear: true},
//                    {model: 'rider.nationality', value: 'no'}
//                ]);
//                // TODO 
//                expect(formAddRider.isValid()).toBe(false);
//            });
//        });
//        TODO
//        it('Should BE possible to select an existing rider', function() {
//
//            formAddVideoTag.showRiderForm().then(function() {
//                var formAddRider = new util.form(getRiderForm());
//
//                formAddRider.fill([
//                    {model: 'rider.firstname', value: 'torstein', clear: true},
//                    {model: 'rider.lastname', value: 'HoRgmo', clear: true},
//                ]);
//                
//                var existingRiderBtn = element(by.css('[ng-click="selectExistingRider(rider)"]'));
//                expect(existingRiderBtn.isPresent()).toBe(true);
//                
//                existingRiderBtn.click(function(){
//                    // TODO Assert that rider is selected
//                });
//            });
//        });

    });

});