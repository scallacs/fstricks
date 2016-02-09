angular.module('shared.youtube')
    .factory('YoutubeVideoInfo', function() {

    return {
        duration: duration,
        info: contentDetails,
        exists: exists,
        data: data,
        extractVideoIdFromUrl: extractVideoIdFromUrl,
        snippet: snippet
    };

    function extractVideoIdFromUrl(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length == 11) ? match[7] : false;
    }

    function getUrl(videoUrl) {
        return "https://www.googleapis.com/youtube/v3/videos?id=" + videoUrl +
                "&key=AIzaSyDYwPzLevXauI-kTSVXTLroLyHEONuF9Rw&part=snippet,contentDetails";
    }
    function exists(videoUrl, callback) {
        var url = getUrl(videoUrl);
        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function(data) {
                if (data.items.length > 0) {
                    callback(true);
                }
                else {
                    callback(false);
                }
            },
            error: function() {
                callback(false);
            }
        });
    }
    function data(videoUrl, callback) {
        var url = getUrl(videoUrl);
        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function(data) {
                callback(data);
            },
            error: function() {
                callback(null);
            }
        });
    }
    function contentDetails(videoUrl, callback) {
        var url = getUrl(videoUrl);
        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function(data) {
                if (data.items.length > 0) {
                    var contentDetails = data.items[0].contentDetails;
                    callback(contentDetails);
                }
                else {
                    callback(null);
                }
            },
            error: function() {
                callback(null);
            }
        });
    }
    function snippet(videoUrl, callback) {
        var url = getUrl(videoUrl);
        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function(data) {
                if (data.items.length > 0) {
                    var snippet = data.items[0].snippet;
                    callback(snippet);
                }
                else {
                    callback(null);
                }
            },
            error: function() {
                callback(null);
            }
        });
    }
    function duration(videoUrl, callback) {
        var url = getUrl(videoUrl);
        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function(data) {
                if (data.items.length > 0) {
                    console.log(data);
                    var contentDetails = data.items[0].contentDetails;
                    callback(convertTime(contentDetails.duration));
                }
                else {
                    callback(null);
                }
            },
            error: function() {
                callback(null);
            }
        });


    }
    function convertTime(duration) {
        var a = duration.match(/\d+/g);

        if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
            a = [0, a[0], 0];
        }

        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
            a = [a[0], 0, a[1]];
        }
        if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
            a = [a[0], 0, 0];
        }

        duration = 0;

        if (a.length == 3) {
            duration = duration + parseInt(a[0]) * 3600;
            duration = duration + parseInt(a[1]) * 60;
            duration = duration + parseInt(a[2]);
        }

        if (a.length == 2) {
            duration = duration + parseInt(a[0]) * 60;
            duration = duration + parseInt(a[1]);
        }

        if (a.length == 1) {
            duration = duration + parseInt(a[0]);
        }
        return duration;
    }
});

