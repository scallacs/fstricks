angular.module('shared')
        .filter('secondsToHours', function() {
            return function(seconds) {
                var hours = parseInt(seconds / 3600);
                var minutes = parseInt((seconds % 3600) / 60);
                var seconds = seconds % 3600 % 60;
                var decades = parseInt((seconds - parseInt(seconds)) * 10);
                seconds = parseInt(seconds);
                return (hours > 0 ? ((hours < 10 ? '0' : '') + hours + ':') : '') + 
                        (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds
                        + '.' + decades;
            }
        })
        .filter('timestamp', function() {
            return function(timestamp) {
                var date = new Date(timestamp * 1000);
                var datevalues = ('0' + date.getDate()).slice(-2) + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
                return datevalues;
            };
        })
        .filter('timeago', function() {
            return function(timestamp) {
                return jQuery.timeago(timestamp);
            };
        });