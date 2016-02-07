/*
 * Module for generating fake spot and testing
 */
angular.module('AdminModule',  ['CommonModule', 'ngResource'])


.factory('GeneratorEntity', function($resource) {
    //var url = '/sys/MediaTagTricks/:action/:id';
    return $resource(WEBROOT + '/Spots/generate_cluster.json', {}, {
        generate: {method: 'POST'}
    });
})
.factory('AdminSpotEntity', function($resource) {
    var url = WEBROOT_FULL + '/admin/Spots/:action/:id.json';
      return $resource(url, {id: '@id', action: '@action'}, {
        add: {
            method: 'POST', 
            params: {action: 'add', id: null},
            isArray: false
        }
    });
})
.factory('SpotEntity', function($resource) {
    var url = WEBROOT + '/admin/Spots/:action/:id.json';
    //var url = '/sys/MediaTagTricks/:action/:id';
    return $resource(url, {id: '@id', action: '@action'}, {
        latest: {
            method: 'GET', 
            params: {action: 'latest', id: null},
            isArray: true
        },
        del: {
            method: 'GET', 
            params: {action: 'del'},
            isArray: false
        },
        index: {
            method: 'GET', 
            params: {action: 'index', id: null},
            isArray: true
        },        
        add: {
            method: 'POST', 
            params: {action: 'add', id: null},
            isArray: false
        },       
        byTag: {
            method: 'GET', 
            params: {action: 'tag'},
            isArray: true
        },
        all: {
            method: 'GET', 
            params: {'action': 'all', id: null},
            isArray: true
        },
        view: {
            method: 'GET', 
            params: {action: 'view'},
            isArray: false
        },
        delete: {
            method: 'DELETE', 
            params: {action: 'delete'}
        }
    });
})

.factory('SpotsTagEntity', function($resource) {
    var url = WEBROOT + '/SpotsTags/:action/:id.json';
    //var url = '/sys/MediaTagTricks/:action/:id';
    return $resource(url, {id: '@id', action: '@action'}, {
        trending: {
            method: 'GET', 
            params: {action: 'trending', id: null},
            isArray: true
        },        
        latest: {
            method: 'GET', 
            params: {action: 'latest', id: null},
            isArray: true
        }        
    });
})

.controller('SpotsController', ['$filter', '$scope',  '$location', 'SpotEntity',
    function($filter, $scope, $location, SpotEntity){
        
    function updateSpots(){
        SpotEntity.latest({}, function(results){
            $scope.spots = results;
        });
    }
    // =========================================================================
    // Init
    function initData(){
        $scope.spots = [];
        updateSpots();
    }
    
    function init(){
        initData();
    }
    init();
    
    // =========================================================================
    // Scope functions
    $scope.updateSpots = function(){
        updateSpots();
    };
    $scope.deleteSpot = function(index){
        // Delete spot
        var spot = $scope.spots[index];
        SpotEntity.del({id: spot.id}, function(result){
            if (result.success){
                $scope.spots.splice(index, 1);
            }
        });
    };
    
}]);


angular.module('AdminModule').controller('GeneratorController', 
['$filter', '$scope',  '$location', 'GeneratorEntity', 'SpotEntity', 'SpotsTagEntity', 'AdminSpotEntity',
    function($filter, $scope, $location, GeneratorEntity, SpotEntity, SpotsTagEntity, AdminSpotEntity){
        
        function randomNumber(min, max){
            return (Math.random() * (max-min)) + min;
        }
        
        function init(){
            $scope.requests = [];
            $scope.tags = ["Working", "Happy", "Work", "Fun", "Weather", "Surf", "Snow", "Great", "lol", "Top", "Again",
                "Sad", "Party", "Anger", "Thursty", "Week end", "end", "Welcome", "Try", "mad", "love", "in love", "heart",
                "heart break", "friends", "friend", "Never", "Paris", "Je suis charilie", "Hard", "Android", "Studio", 
                "Music", "Football", "Sport", "Ski", "Peuf", "PowPow", "Reason", "Queen", "Hollande", "France", "Pull", "Casque", 
                "Chair", "TV", "serie", "GOT", "Game Of Thrones", "Entourage", "Blindspot", "Six feed under", "Computer",
                "Money", "Bank", "Fail", "car", "race", "Rage", "Screen", "Window", "Windows", "Kangaroo", "Australia", "Picture",
                "Facebook", "Governement", "Under", "Presure", "Rider", "Ride", "Candide", "Thovex", "Kevin Rolland", "But", "Old",
                "Dead", "Death", "Finish", "Restart"];
            $scope.options = {
                frequency: 1,
                center_latitude: 0,
                center_longitude: 0,
                width: 10,
                height: 10
            };
            $scope.isRunning = false;
            $scope.requests = [];
        }
        init();
        
        function timeoutGenerate(){
            setTimeout(function(){generate();}, (1/$scope.options.frequency) * 1000);
        }
        
        function generate(){
            var data = {};
            var longitude = {
                min: $scope.options.center_longitude - $scope.options.width,
                max: $scope.options.center_longitude + $scope.options.width
            };
            var latitude = {
                min: $scope.options.center_latitude - $scope.options.height,
                max: $scope.options.center_latitude + $scope.options.height
            };
            
            data.longitude = randomNumber(longitude.min, longitude.max);
            data.latitude = randomNumber(latitude.min, latitude.max);
            var tagList = [];
            var nbTags = randomNumber(1, 7) | 0;
            for (var i = 0; i < nbTags; i++){
                tagList[i] = ($scope.tags[randomNumber(0, $scope.tags.length -1) | 0]);
            }
            data.tag_string = tagList.join();
            data.anonymous = 0;
            data.user_id = randomNumber(0, 100);
            data.category_id = randomNumber(1,4);
            
            var request = {
                startDate: new Date(),
                endDate: null,
                status: 'pending',
                data: data,
                result: {}
            };
            $scope.requests[$scope.requests.length] = request;
            AdminSpotEntity.add(data, function(result){
                request.result = result;
                request.status = result.success ? 'success' : 'failure';
                console.log(result);
            }, function(){
                request.status = 'error';
            });
            if ($scope.isRunning){
                timeoutGenerate();
            }
        }
        
        $scope.stop = function(){
            $scope.isRunning = false;
        };
        
        $scope.run = function(){
            $scope.isRunning = true;
            timeoutGenerate();
        };
        $scope.clearLogs = function(){
            $scope.requests = [];
        };
        
        
        $scope.prefilledCoordinates = [ 
            {
                center_latitude: 46.0000,
                center_longitude: 2,
                width: 3,
                height: 3,
                frequency: 1,
                name: 'France'
            },
            {
                center_latitude: 50.0000,
                center_longitude: 14.5,
                width: 10,
                height: 10,
                frequency: 1,
                name: 'Europe'
            }
        ];
        
        $scope.setCenterCoordinate = function(data){
            $scope.options = data;
        };
}]);
        
   