var Application = require('./pages.js');

describe('Account signup', function() {

    var app = new Application();
    var nav = app.topNav();

    var crendentials = [
        {
            message: "Should be possible to sign in with this valid user",
            btnEnabled: true,
            success: true,
            data: {
                username: "newuservalid",
                email: "newmail@mail.com",
                password: "testtest",
                passwordConfirm: "testtest"
            }
        },
        {
            btnEnabled: false,
            message: 'Should not be possible to sign in when username is not available',
            data: {
                username: "stef",
                email: "availablemail@mail.com",
                password: "testtest",
                passwordConfirm: "testtest"
            }
        },
        {
            btnEnabled: true,
            success: false,
            message: 'Should not be possible to sign in when email is already used',
            data: {
                username: "availableusername",
                email: "stef@fstricks.com",
                password: "testtest",
                passwordConfirm: "testtest"
            }
        },
        {
            btnEnabled: false,
            success: false,
            message: 'Should not be possible to sign in when password does not match',
            data: {
                username: "availableusername",
                email: "availablemail@mail.com",
                password: "testtest",
                passwordConfirm: "testtest2"
            }
        }
    ];

    var form, submitBtn;

    function fillForm(data) {
        form.element(by.model("user.username")).sendKeys(data.username);
        form.element(by.model("user.email")).sendKeys(data.email);
        form.element(by.model("user.password")).sendKeys(data.password);
        form.element(by.model("confirmPassword")).sendKeys(data.passwordConfirm);
    }

    beforeEach(function() {
        app.get('/signup');
        form = element(by.id('FormSignup'));
        submitBtn = form.element(by.css('button[type="submit"]'));
    });

    describe('Elements', function() {
        it('should have the form', function() {
            expect(form.isPresent()).toBe(true);
        });
    });



    describe('Fill in in form... ', function() {

        crendentials.forEach(function(test) {
            it(test.message, function() {
                fillForm(test.data);

                expect(submitBtn.isEnabled()).toBe(test.btnEnabled);

                if (test.btnEnabled && submitBtn.isEnabled()) {
                    submitBtn.click().then(function() {
                        if (test.success) {
                            expect(browser.getLocationAbsUrl()).not.toContain('/signup');
                        }
                        else {

                            expect(browser.getLocationAbsUrl()).toContain('/signup');
                        }
                    });
                }
            });
        });

    });



});