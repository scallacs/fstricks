angular.module('shared.form')
        .directive('serverForm', serverForm);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
serverForm.$inject = ['messageCenterService'];
function serverForm(messageCenterService) {
    var loader = $('<img class="form-loader" src="' + WEBROOT_FULL + '/img/ajax_loader.gif" alt="Loading..."/>');
    return {
        require: 'form',
        link: function(scope, elem, attr, form) {
            form._pending = false;

            form.pending = function(val) {
                form._pending = val;
                if (val) {
                    elem.find('fieldset').attr('disabled', 'disabled');
                    elem.find('button[type="submit"],input[type="submit"]').prepend(loader.clone());
                }
                else {
                    elem.find('fieldset').removeAttr('disabled');
                    elem.find('button[type="submit"],input[type="submit"]').find('.form-loader').remove();
                }
            };

            form.submit = function(promise) {
//                console.log("Call server form submit");
                if (form._pending) {
                    return;
                }
                messageCenterService.removeShown();
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
                    if (!results.success) {
                        form.setValidationErrors(results.validationErrors);
                    }
                    var statusText = results.success ? 'success' : 'warning';
//                    messageCenterService.add(statusText,
//                            '<span class="glyphicon glyphicon-'+statusText+'"/></span> ' + results.message, 
//                            {status: messageCenterService.status.shown});
                    messageCenterService.add(statusText, results.message, 
                            {status: messageCenterService.status.shown});
                }
            };

            form.setValidationErrors = function(models) {
                console.log(models);
                angular.forEach(models, function(errors){
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
            };
        }
    };

}
