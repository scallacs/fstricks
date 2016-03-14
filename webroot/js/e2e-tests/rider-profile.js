var Application = require('./includes/pages.js');

describe('Rider profile: ', function() {

    var btnEditProfile, formAddRider, btnSaveRider, btnCancel;

    var application = new Application();

    beforeEach(function() {
        application.login().then(function() {
            browser.get('/profile');
            btnEditProfile = element(by.id('buttonEditProfile'));
        });
    });

    function goToEdition() {
        return btnEditProfile.click().then(function() {
            browser.waitForAngular();
            expect(btnEditProfile.isPresent()).toBe(true);
            formAddRider = element(by.id("FormAddRider"));
            btnSaveRider = formAddRider.element(by.css('.btn[type="submit"]'));
            btnCancel = formAddRider.element(by.css('.btn[type="button"]'));
            expect(btnSaveRider.isPresent()).toBe(true);
            expect(btnCancel.isPresent()).toBe(true);
            expect(formAddRider.isPresent()).toBe(true);
        });
    }

    it('should display the edit profile button', function() {
        expect(btnEditProfile.isPresent()).toBe(true);
    });

    it('should display the edit form when edit profile btn is clicked', function() {
        goToEdition().then(function() {
            it('should return to view profile when clicking on cancel', function() {
                btnCancel.click().then(function() {
                    browser.waitForAngular();
                    expect(btnEditProfile.isPresent()).toBe(true);
                });
            });
        });
    });

    it('should save profile', function() {
        goToEdition().then(function() {
            btnSaveRider.click().then(function() {
                browser.waitForAngular();
                expect(btnEditProfile.isPresent()).toBe(true);
            });
        });
    });

});