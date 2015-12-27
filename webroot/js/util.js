
$.log = $.fn.log = function(o) {

    window.console && console.log ?
            console.log.apply(console, !!arguments.length ? arguments : [this])
            : opera && opera.postError
            && opera.postError(o || this);

    $.log.cache = $.log.cache || [];
    $.log.cache[$.log.cache.length] = arguments.length > 1 ? arguments : o || this;
    return $.log.cache.length - 1;

};

$.fn.outerHTML = function(s) {
    return (s)
            ? this.before(s).remove()
            : $('<p>').append(this.eq(0).clone()).html();
}

function isset(obj, properties){
    if (typeof obj !== 'object'){
        return false;
    }
    var props = properties.split('.');
    try{
        for (var i = 0; i < props.length; i++){
            obj = obj[props[i]];
            if (typeof obj === "undefined") return false;
        }
        return obj !== null;
    } catch (e){ 
        return false;
    }
}

function userNotice(message) {
    new jBox('Notice', {
        content: message,
        animation: {
            open: 'slide:top',
            close: 'slide'
        },
        // fade: options.feebackDuration,
        closeButton: true
    });
}
function displayObject(obj) {
    var props = "{\n";
    for (var prop in obj) {
        props += "\t" + prop + " => ";
        if (typeof obj[prop] === "object") {
            displayObject += displayObject(obj[prop]);
        }
        else if (typeof obj[prop] === "function") {
            props += "function";
        }
        else {
            props += obj[prop];
        }
        props += "\n";
    }
    return props + "\n}";
}
function ucfirst(str) {
    str += '';
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
}

function isScrolledIntoView(elem) {
    if ($(elem).length === 0)
        return false;
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function loadAjax(url, selector, successCallback) {
    $.EasyAjaxAction({
        url: url,
        dataType: 'html',
        target: selector,
        loader: selector,
        onSuccess: successCallback
    });
}
function loadJsonBackground(url, actionSuccess) {
    $.EasyAjaxAction({
        url: url,
        dataType: 'json',
        onSuccess: function(serverData, element) {
            actionSuccess(serverData, element);
        },
        autoFeedback: false,
        loader: false
    });
}

function convertToSlug(Text) {
    return Text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
            ;
}


function initFormActionType(form) {
    $(":submit", form).click(function() {
        if ($(this).attr('name')) {
            form.remove('input[name="form_action"]');
            $(form).append(
                    $("<input type='hidden'>").attr({
                name: 'form_action',
                value: $(this).attr('name')})
                    );
        }
    });
}


String.prototype.toHHMMSS = function() {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}

var youtubePlayerId = null;
var youtubePlayer = null;
function loadYoutubeIframeAPI(){
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}


function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}