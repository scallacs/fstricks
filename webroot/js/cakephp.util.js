

function cakephpFormRemoveError(form){
    $(form).find(".error-message").remove();

    $(form).find(".error").each(function() {
        $(this).removeClass("error");
    });
    
}
/**
 * Append cakephp form validates errors.
 * @param array data : the json data containing the cakephp validation errors
 * @param Object form : the form
 */
function cakephpFormAppendError(data, form) {
    cakephpFormRemoveError(form);
    $.each(data, function(model, errors) {
        $.each(errors, function(fieldName){
            var selector = '[name="data['+ model + '][' + fieldName + ']"]';     
            var element = $(form).find(selector);
            if (element.length > 0){
                var _insert = $(document.createElement('div')).insertAfter(element);    
                _insert.parent().addClass('error');
                _insert.addClass('error-message').text(errors[fieldName]);
            }
            else{
               // alert('Unkown element : ' + selector);
                var _insert = $('<div class="input text error"/>').html('<div class="error-message">' + errors[fieldName] + '</div>');
                $(form).prepend(_insert);
            }
        });
    });
};

function cakephpFormAfterValidate(data, form, options)  {
    if(data.success) {
        cakephpFormRemoveError(form);
        feedbackJsonData(data, options);
        return true;
    } else {
        cakephpFormAppendError(data.validationErrors, form);
        return false;
    }
}


function cakephpGetUrlLastOption(url){    
    var path = url.split('/');
    return path[path.length-1];
}


function cakephpUrl(controller, action, params, plugin, prefix){
    var str = WEBROOT;
    if (prefix){
        str += prefix+'/';
    }
    if (plugin){
        str += plugin+'/';
    }
    str += controller+'/'+action;
    if (params instanceof Array){
        for (var i = 0; i < params.length; i++)
            str += '/'+params[i];        
    }
    else{
        str += '/' + params;
    }
    return str;
}

function cakephpUrlImage(filename){
    if (filename[0] === '/')
        return WEBROOT + filename;
    return WEBROOT + DS + 'img' + DS + filename;
}

function cakephpUrlCss(filename){
    return WEBROOT + DS + 'css' + DS + filename;
}
