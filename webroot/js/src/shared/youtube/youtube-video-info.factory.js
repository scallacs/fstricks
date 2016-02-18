angular.module('shared.youtube')
        .factory('YoutubeItem', function($q) {

            function YoutubeItem(item) {
                this._item = item;
            }

            YoutubeItem.prototype = {
                duration: duration,
                thumbnailUrl: thumbnailUrl,
                snippet: snippet,
                contentDetails: contentDetails,
                title: title,
                description: description,
                publishedAt: publishedAt
            };
            function contentDetails() {
                return this._item.contentDetails;
            }
            function snippet() {
                return this._item.snippet;
            }
            function duration() {
                return this._item.snippet.contentDetails.duration;
            }
            function thumbnailUrl(size) {
                this._item.snippet.thumbnails[size].url;
            }
            function title() {
                return this.snippet().title;
            }
            function description() {
                return this.snippet().description;
            }
            function publishedAt() {
                return this.snippet().publishedAt;
            }

        })
        .factory('YoutubeVideoInfo', function($q, $http) {
            var API_KEY = "AIzaSyDYwPzLevXauI-kTSVXTLroLyHEONuF9Rw";


            function YoutubeVideoInfo() {
                this._query = null;
                this._parts = [];
                this._videoIds = [];
                return this;
            }

            YoutubeVideoInfo.prototype.load = load;
            YoutubeVideoInfo.prototype.setParts = setParts;
            YoutubeVideoInfo.prototype.addPart = addPart;
            YoutubeVideoInfo.prototype.addVideo = addVideo;
            YoutubeVideoInfo.prototype.setVideos = setVideos;
            YoutubeVideoInfo.prototype.exists = exists;
            YoutubeVideoInfo.prototype.extractVideoIdFromUrl = extractVideoIdFromUrl;
//            YoutubeVideoInfo.prototype.then = then;
            YoutubeVideoInfo.prototype.computeUrl = computeUrl;

            return YoutubeVideoInfo;

            function load() {
                var that = this;
                
                var defer = $q.defer();
                // todo change 
                $.ajax({
                    async: false,
                    type: 'GET',
                    url: that.computeUrl(),
                    success: callbackSuccess,
                    error: function() {
                        defer.reject();
                    }
                });
                this._query = defer.promise;
                return this._query;
//                $http.defaults.headers.common['Authorization'] = undefined;
//                this._query = $http({
//                    type: 'GET',
//                    url: this.computeUrl(),
//                    headers: {
//                        Authorization: undefined
//                    }
//                }).then(callbackSuccess);
//                return this;

                function callbackSuccess(data){
                    that._items = data;
                    defer.resolve(data);
                }
            }

            function addVideo(id) {
                this._videoIds.push(id);
                return this;
            }

            function setVideos(ids) {
                this._videoIds = ids;
                return this;
            }
//
//            function then(callback) {
//                return this._query.then(callback);
//            }

            function setParts(parts) {
                this._parts = parts;
            }
            function addPart(part) {
                this._parts.push(part);
                return this;
            }

            function extractVideoIdFromUrl(url) {
                var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
                var match = url.match(regExp);
                return (match && match[7].length == 11) ? match[7] : false;
            }

            function computeUrl() {
                var url = "https://www.googleapis.com/youtube/v3/videos?id=" + this._videoIds.join() +
                        "&key=" + API_KEY;
                if (this._parts.length > 0) {
                    url += "&part=" + this._parts.join();
                }
                return url;
            }

            function exists() {
                return this._data.items.length > 0;
            }
//            function convertTime(duration) {
//                var a = duration.match(/\d+/g);
//
//                if (duration.indexOf('M') >= 0 && duration.indexOf('H') == -1 && duration.indexOf('S') == -1) {
//                    a = [0, a[0], 0];
//                }
//
//                if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1) {
//                    a = [a[0], 0, a[1]];
//                }
//                if (duration.indexOf('H') >= 0 && duration.indexOf('M') == -1 && duration.indexOf('S') == -1) {
//                    a = [a[0], 0, 0];
//                }
//
//                duration = 0;
//
//                if (a.length == 3) {
//                    duration = duration + parseInt(a[0]) * 3600;
//                    duration = duration + parseInt(a[1]) * 60;
//                    duration = duration + parseInt(a[2]);
//                }
//
//                if (a.length == 2) {
//                    duration = duration + parseInt(a[0]) * 60;
//                    duration = duration + parseInt(a[1]);
//                }
//
//                if (a.length == 1) {
//                    duration = duration + parseInt(a[0]);
//                }
//                return duration;
//            }
        });

