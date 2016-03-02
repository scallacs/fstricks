angular.module('shared.youtube')
        .factory('YoutubeItem', function() {

            function YoutubeItem(item) {
                this._item = item;
            }

            YoutubeItem.prototype = {
                duration: duration,
                thumbnail: thumbnail,
                snippet: snippet,
                contentDetails: contentDetails,
                title: title,
                description: description,
                publishedAt: publishedAt,
                provider: provider
            };
            function provider() {
                return 'Youtube';
            }
            function contentDetails() {
                return this._item.contentDetails;
            }
            function snippet() {
                return this._item.snippet;
            }
            function duration() {
                return this._item.snippet.contentDetails.duration;
            }
            function thumbnail(size) {
                return this._item.snippet.thumbnails[size].url;
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

            return {
                create: function(item) {
                    return new YoutubeItem(item);
                }
            };
        })
        .factory('YoutubeVideoInfo', ['$q', 'Config', 'YoutubeItem', function($q, Config, YoutubeItem) {
            var API_KEY = APIS.youtube;
            function YoutubeVideoInfo() {
                this._query = null;
                this._parts = ['id'];
                this._videoIds = [];
                return this;
            }

            YoutubeVideoInfo.prototype.load = load;
            YoutubeVideoInfo.prototype.setParts = setParts;
            YoutubeVideoInfo.prototype.addPart = addPart;
            YoutubeVideoInfo.prototype.addVideo = addVideo;
            YoutubeVideoInfo.prototype.setVideos = setVideos;
            YoutubeVideoInfo.prototype.exists = exists;
            YoutubeVideoInfo.prototype.computeUrl = computeUrl;

            return {
                create: function() {
                    return new YoutubeVideoInfo();
                },
                createItem: function(data){
                    return new YoutubeItem.create(data.items[0]);
                },
                extractIdFromUrl: extractIdFromUrl
            };

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

                function callbackSuccess(data) {
                    that._data = data;
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

            function setParts(parts) {
                this._parts = parts;
            }
            function addPart(part) {
                this._parts.push(part);
                return this;
            }

            function extractIdFromUrl(url) {
                if (!url)
                    return false;
                var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
                var match = url.match(regExp);
                return (match && match[7].length === 11) ? match[7] : false;
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
                return this._data && this._data.items.length > 0;
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
        }]);

