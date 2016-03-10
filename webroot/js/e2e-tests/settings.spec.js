var Application = require('./pages.js');

describe('Settings ', function() {

    var app = new Application();


    var credentialChangePassword = {email: "changepassword@mail.com", password: "test"};
    var credentialDeleteAccount = {email: "tobedeleted@mail.com", password: "test"};


    var changePasswords = [
        {
            success: false,
            btnEnabled: true,
            message: 'Should NOT be possible to change password without the old one',
            oldPassword: 'invalid',
            password: 'testtest',
            passwordConfirm: 'testtest'
        },
        {
            success: false,
            btnEnabled: false,
            message: 'Should NOT be possible to change password if they don\'t match',
            oldPassword: 'test',
            password: 'testtest',
            passwordConfirm: 'testtest2'
        },
        {
            success: false,
            btnEnabled: false,
            message: 'Should NOT be possible to change password if they are too short',
            oldPassword: 'blopblop',
            password: 'test',
            passwordConfirm: 'test'
        },
        {
            success: true,
            btnEnabled: true,
            message: 'Should be possible to change password with the old one',
            oldPassword: 'test',
            password: 'testtest',
            passwordConfirm: 'testtest'
        }
    ];
    var deletePasswords = [
        {
            password: 'invalid',
            success: false,
            message: 'Should not be possible to delete account with an invalid password'
        },
        {
            password: 'test',
            success: true,
            message: 'Should be possible to delete account with a valid password'
        }
    ];
//
    describe('Change password ', function() {

        var form, oldPassword, password, passwordConfirm, btnSave;

        beforeAll(function() {
            app.login(credentialChangePassword).then(function() {
                app.get('/settings');

                var tabLink = element(by.css('li[heading="Change password"] a'));
                tabLink.click().then(function() {
                    form = element(by.id('ChangePasswordForm'));
                    oldPassword = form.element(by.css('input[name="old_password"]'));
                    password = form.element(by.css('input[name="password"]'));
                    passwordConfirm = form.element(by.css('input[name="confirmPassword"]'));
                    btnSave = form.element(by.css('button[type="submit"]'));
                });
            });
        });
        beforeEach(function(){
            oldPassword.clear();
            password.clear();
            passwordConfirm.clear();
        });

        changePasswords.forEach(function(test) {
            it(test.message, function() {
                oldPassword.sendKeys(test.oldPassword);
                password.sendKeys(test.password);
                passwordConfirm.sendKeys(test.passwordConfirm);
                expect(btnSave.isEnabled()).toBe(test.btnEnabled);
                if (test.btnEnabled && btnSave.isEnabled()) {
                    btnSave.click().then(function() {
                        if (test.success) {
                            // TODO
                        }
                    });
                }
            });
        });
    });


    describe('Delete account ', function() {
        var form, password, btnConfirm;

        beforeAll(function() {
            app.login(credentialDeleteAccount).then(function() {
                app.get('/settings');
                var tabLink = element(by.css('li[heading="Delete account"] a'));
                expect(tabLink.isPresent()).toBe(true);
                tabLink.click().then(function() {
                    form = element(by.id('DeleteAccountForm'));
                    expect(form.isPresent()).toBe(true);
                    password = form.element(by.model('password'));
                    btnConfirm = form.element(by.css('button[type="submit"]'));
                });
            });
        });

        beforeEach(function() {
            password.clear();
        });

        deletePasswords.forEach(function(test) {
            it(test.message, function() {
                password.sendKeys(test.password);
                expect(btnConfirm.isEnabled()).toBe(true);

                btnConfirm.click().then(function() {
                    if (test.success) {
                        expect(browser.getLocationAbsUrl()).not.toContain('/settings');
                        // TODO test is authed
                    }
                    else {
                        expect(browser.getLocationAbsUrl()).toContain('/settings');
                    }
                });
            });
        });
    });
});