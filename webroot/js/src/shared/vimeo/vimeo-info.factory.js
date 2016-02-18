angular.module('shared.vimeo')
        .factory('VimeoItem', function() {
            var mapSize = {
                default: 0
            };

            function VimeoItem(item) {
                this._item = item;
            }

            VimeoItem.prototype = {
                duration: duration,
                thumbnail: thumbnail,
                title: title,
                description: description,
                publishedAt: publishedAt,
                isPublic: isPublic,
                provider: provider
            };
            
            function provider(){
                return 'Vimeo';
            }
            function isPublic() {
                return this._data.privacy.embed === 'public' 
                        && this._data.privacy.view === 'anybody';
            }
            
            function duration() {
                return this._item.snippet.contentDetails.duration;
            }
            
            function thumbnail(size) {
                
                this._item.pictures.sizes[mapSize[size]].link;
            }
            
            function title() {
                return this._item.name;
            }
            
            function description() {
                return this._item.description;
            }
            
            function publishedAt() {
                return this._item.created_time;
            }
            
            return {
                create: function(item){
                    return new VideoItem(item);
                }
            };
        })
        .factory('VimeoInfo', function($http) {
            function VimeoInfo() {
                this._query = null;
                this._videoIds = [];
                this._exists = null;
                return this;
            }

            VimeoInfo.prototype.load = load;
            VimeoInfo.prototype.addVideo = addVideo;
            VimeoInfo.prototype.setVideos = setVideos;
            VimeoInfo.prototype.exists = exists;
            VimeoInfo.prototype.extractVideoIdFromUrl = extractVideoIdFromUrl;
            VimeoInfo.prototype.computeUrl = computeUrl;

            return VimeoInfo;

            function load() {
                var that = this;
                this._query =  $http.get(this.computeUrl())
                        .success(function(r) {
                            console.log(r);
                            that._data = r;
                        })
                        .error(function(e) {
                            console.log(r);
                        });
                return this._query;
            }

            function addVideo(id) {
                this._videoIds.push(id);
                return this;
            }

            function setVideos(ids) {
                this._videoIds = ids;
                return this;
            }

            function extractVideoIdFromUrl(url) {
                if (!url) return false;
                var regExp = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/
                var match = url.match(regExp);
                return match[5].length > 1 ? match[5] : false;
            }

            function computeUrl() {
                var url = "https://api.vimeo.com/videos/" + this._videoIds.join();
                return url;
            }

            function exists() {
                return this._exists;
            }
        });

/*
 * 
 {
 "uri": "/videos/152644113",
 "name": "The Lumineers - \"Ophelia\"",
 "description": "\u201cOphelia\u201d by The Lumineers. From the album Cleopatra,  courtesy of Dualtone Records, 2016\n\nDirector: Isaac Ravishankara\nChoreographer: Jillian Meyers\n\nProducer: Aviv Russ\nExecutive Producer: Jason Colon, Danielle Hinde\nProd. Co: Doomsday Entertainment\n\n1st Assistant Director: Brandeaux Tourville\n\nDirector of Photography: Kevin Phillips\n1st Assistant Camera: Scott Michael Johnson\nSteadicam: Ari Robbins\n\nGaffer: Daniel McNutt\nKey Grip: Lev Abrahamian\n\nProduction Designer: Ali Rubinfeld\nSet Decorator: Grace Alie\n\nStylist: Elise Velasco, Amanda Hall\n\nHair / Makeup: Linda Sammit\n\nGraphic Designer: Nicks Sutton Bell\n\nEditor: Isaac Ravishankara\nAssistant Editor: Dylan Marko Bell\n\nColorist: Aubrey Woodiwiss @ ETC\n\nAdditional VFX: Isaac Ravishankara\n\nShot on location at the Granada Theater in Wilmington, CA\n\n***\nThanks to: Christen Greene, Grant Hathaway, Jeff Mortensen, Danny Madden, Stelth Ulvang, Abe Abraham\n\nSpecial Thanks to Xavier Dolan for a bit of inspiration.\n\nAnd Matt Harfield, we were all thinking about you, friend.",
 "link": "https://vimeo.com/152644113",
 "duration": 161,
 "width": 1920,
 "language": null,
 "height": 1080,
 "embed": {
 "html": "<iframe src=\"https://player.vimeo.com/video/152644113?badge=0&autopause=0&player_id=0\" width=\"1920\" height=\"1080\" frameborder=\"0\" title=\"The Lumineers - "Ophelia"\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>"
 },
 "created_time": "2016-01-22T00:25:55+00:00",
 "modified_time": "2016-02-18T19:39:54+00:00",
 "content_rating": [
 "safe"
 ],
 "license": null,
 "privacy": {
 "view": "anybody",
 "embed": "public",
 "download": false,
 "add": true,
 "comments": "anybody"
 },
 "pictures": {
 "uri": "/videos/152644113/pictures/552699242",
 "active": true,
 "type": "custom",
 "sizes": [
 {
 "width": 100,
 "height": 75,
 "link": "https://i.vimeocdn.com/video/552699242_100x75.jpg?r=pad"
 },
 {
 "width": 200,
 "height": 150,
 "link": "https://i.vimeocdn.com/video/552699242_200x150.jpg?r=pad"
 },
 {
 "width": 295,
 "height": 166,
 "link": "https://i.vimeocdn.com/video/552699242_295x166.jpg?r=pad"
 },
 {
 "width": 640,
 "height": 360,
 "link": "https://i.vimeocdn.com/video/552699242_640x360.jpg?r=pad"
 },
 {
 "width": 960,
 "height": 540,
 "link": "https://i.vimeocdn.com/video/552699242_960x540.jpg?r=pad"
 },
 {
 "width": 1280,
 "height": 720,
 "link": "https://i.vimeocdn.com/video/552699242_1280x720.jpg?r=pad"
 }
 ]
 },
 "tags": [],
 "stats": {
 "plays": 2490
 },
 "metadata": {
 "connections": {
 "comments": {
 "uri": "/videos/152644113/comments",
 "options": [
 "GET"
 ],
 "total": 11
 },
 "credits": {
 "uri": "/videos/152644113/credits",
 "options": [
 "GET",
 "POST"
 ],
 "total": 1
 },
 "likes": {
 "uri": "/videos/152644113/likes",
 "options": [
 "GET"
 ],
 "total": 276
 },
 "pictures": {
 "uri": "/videos/152644113/pictures",
 "options": [
 "GET",
 "POST"
 ],
 "total": 1
 },
 "texttracks": {
 "uri": "/videos/152644113/texttracks",
 "options": [
 "GET",
 "POST"
 ],
 "total": 0
 },
 "related": null
 }
 },
 "user": {
 "uri": "/users/1226386",
 "name": "Isaac Ravishankara",
 "link": "https://vimeo.com/ravishankara",
 "location": "Los Angeles, CA",
 "bio": "had decided to live forever or die in the attempt.\n\nex southerner.\nex mountaineer\nex eagle scout\nex black-belt\nex physicist\nfuture philanthropist\n\nwww.isaacravishankara.com",
 "created_time": "2009-01-29T03:11:52+00:00",
 "account": "plus",
 "pictures": {
 "uri": "/users/1226386/pictures/8824115",
 "active": true,
 "type": "custom",
 "sizes": [
 {
 "width": 30,
 "height": 30,
 "link": "https://i.vimeocdn.com/portrait/8824115_30x30.jpg?r=pad"
 },
 {
 "width": 75,
 "height": 75,
 "link": "https://i.vimeocdn.com/portrait/8824115_75x75.jpg?r=pad"
 },
 {
 "width": 100,
 "height": 100,
 "link": "https://i.vimeocdn.com/portrait/8824115_100x100.jpg?r=pad"
 },
 {
 "width": 300,
 "height": 300,
 "link": "https://i.vimeocdn.com/portrait/8824115_300x300.jpg?r=pad"
 }
 ]
 },
 "websites": [
 {
 "name": null,
 "link": "www.gotisaac.com",
 "description": null
 }
 ],
 "metadata": {
 "connections": {
 "activities": {
 "uri": "/users/1226386/activities",
 "options": [
 "GET"
 ]
 },
 "albums": {
 "uri": "/users/1226386/albums",
 "options": [
 "GET"
 ],
 "total": 0
 },
 "channels": {
 "uri": "/users/1226386/channels",
 "options": [
 "GET"
 ],
 "total": 3
 },
 "feed": {
 "uri": "/users/1226386/feed",
 "options": [
 "GET"
 ]
 },
 "followers": {
 "uri": "/users/1226386/followers",
 "options": [
 "GET"
 ],
 "total": 1820
 },
 "following": {
 "uri": "/users/1226386/following",
 "options": [
 "GET"
 ],
 "total": 35
 },
 "groups": {
 "uri": "/users/1226386/groups",
 "options": [
 "GET"
 ],
 "total": 0
 },
 "likes": {
 "uri": "/users/1226386/likes",
 "options": [
 "GET"
 ],
 "total": 162
 },
 "portfolios": {
 "uri": "/users/1226386/portfolios",
 "options": [
 "GET"
 ],
 "total": 0
 },
 "videos": {
 "uri": "/users/1226386/videos",
 "options": [
 "GET"
 ],
 "total": 41
 },
 "watchlater": {
 "uri": "/users/1226386/watchlater",
 "options": [
 "GET"
 ],
 "total": 18
 },
 "shared": {
 "uri": "/users/1226386/shared/videos",
 "options": [
 "GET"
 ],
 "total": 104
 },
 "pictures": {
 "uri": "/users/1226386/pictures",
 "options": [
 "GET",
 "POST"
 ],
 "total": 1
 }
 }
 },
 "preferences": {
 "videos": {
 "privacy": null
 }
 }
 },
 "app": null,
 "status": "available",
 "embed_presets": null
 }
 */