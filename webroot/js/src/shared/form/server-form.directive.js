angular.module('shared.form')
        .directive('serverForm', serverForm);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
serverForm.$inject = ['toaster'];
function serverForm(toaster) {
    var loader = $('<img class="form-loader" src="' + WEBROOT_FULL + '/img/ajax_loader.gif" alt="Loading..."/>');
    return {
        require: 'form',
        link: function(scope, elem, attr, form) {
            form._pending = false;
            form._submitBtnSelector = null;

            form.pending = function(val) {
                form._pending = val;
                if (form._submitBtnSelector === null) {
                    form._submitBtnSelector = 'button[type="submit"],input[type="submit"]';
                }
                
                if (val) {
                    elem.find('fieldset').attr('disabled', 'disabled');
                    elem.find(form._submitBtnSelector).prepend(loader.clone());
                }
                else {
                    elem.find('fieldset').removeAttr('disabled');
                    elem.find(form._submitBtnSelector).find('.form-loader').remove();
                }
            };

            form.submit = function(promise, selector) {
                form._submitBtnSelector = angular.isDefined(selector) ? selector : null;
//                console.log("Call server form submit");
                if (form._pending) {
                    return;
                }
                form.pending(true);
                promise
                        .then(successCallback)
                        .finally(finallyCallback);

                return promise;

                function finallyCallback() {
                    form.pending(false);
                }
                function successCallback(results) {
                    console.log(results);
                    if (angular.isDefined(results.status) && angular.isDefined(results.statusText)) {
                        results = results.data;
                    }
                    if (!results.success) {
                        form.setValidationErrors(results.validationErrors);
                    }
                    var statusText = results.success ? 'success' : 'warning';
                    toaster.pop(statusText, results.message);
                }
            };

            form.setValidationErrors = function(models) {
                console.log(models);
                angular.forEach(models, function(errors) {
                    _setValidationErrors(errors);
                });
            };

            function _setValidationErrors(serverErrors) {
                console.log("Setting validation errors (" + serverErrors.length + ")");
                console.log(serverErrors);
                angular.forEach(serverErrors, function(errors, field) {
                    var errorString = Object.keys(errors).map(function(k) {
                        return errors[k];
                    }).join(', ');
                    if (form[field] !== undefined) {
                        form[field].$setValidity('server', false);
                        form[field].$error.server = errorString;
                        console.log(form.$name + "." + field + ": " + errorString);
                    }
                    else {
                        console.log(form.$name + "." + field + ": " + errorString);
                    }
                });
            }
            ;
        }
    };

}
