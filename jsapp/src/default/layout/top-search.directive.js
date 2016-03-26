angular.module('app.layout')
        .factory('TopSearchMapper', TopSearchMapper)
        .directive('topSearch', topSearchDirective);

TopSearchMapper.$inject = ['SharedData'];
function TopSearchMapper(SharedData) {
    return {
        rider: function(data) {
            data.title = data.firstname + ' ' + data.lastname;
            data.sub_title = ' (' + data.nationality + ')';
            data.points = data.count_tags;
            data.type = 'rider';
            data.category = 'Rider';
            return data;
        },
        tag: function(data) {
            data.title = data.name;
            data.sub_title = data.sport_name + ' ' + data.category_name;
            data.points = data.count_ref;
            data.type = 'tag';
            data.category = 'Trick';
            return data;
        },
        trick: function(data) {
            data.title = data.tag_name;
            data.sub_title = data.sport_name + ' ' + data.category_name;
            data.points = data.count_ref;
            data.type = 'tag';
            data.category = 'Trick';
            return data;
        },
        playlist: function(data) {
            data.sub_title = '';
            data.points = data.count_points;
            data.type = 'playlist';
            data.category = 'Playlist';
            return data;
        },
        video: function(data) {
            data.sub_title = '';
            data.type = 'video';
            data.category = 'Video';
            return data;
        },
        sport: function(data) {
            data.title = data.name;
            data.sub_title = (data.category ? data.category: '');
            data.type = 'sport';
            data.category = 'Best of';
            return data;
        },
        search: function(q) {
            var search = {
                picture: false,
                points: false,
                title: null,
                sub_title: null,
                type: 'partial',
                category: 'Trick',
                search: q
            };
            if (SharedData.currentSport) {
                search.sport_id = SharedData.currentSport.id;
                search.sub_title = SharedData.currentSport.name;
            }
            else {
                search.sub_title = 'any sports';
            }
            search.title = "* " + q + " *";
            return search;
        }
    };
}
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
topSearchDirective.$inject = ['TopSearchMapper', 'ApiFactory'];
function topSearchDirective(TopSearchMapper, ApiFactory) {
    return {
        templateUrl: TEMPLATE_URL + '/layout/partials/top-search.html',
        scope: {
            currentSearch: '='
        },
        controller: ['$scope', 'SharedData',
            function($scope, SharedData) {
                $scope.results = [];
                $scope.onSelect = onSelect;
                $scope.refresh = refresh;

                var searchEndpoint = ApiFactory.endpoint('Searchs', 'search').query;

//                var searchIdCounter = 0;
                var currentRequest = null;
                /**
                 * Header search bar function
                 * @param {type} trick
                 * @returns {undefined}
                 * 
                 * TODO history
                 */
                function refresh(search) {
                    search = search.trim();
                    if (search.length >= 2) {
//                        if (currentRequest!== null){
//                            console.log("Cancelling search");
//                            currentRequest.$cancel();
//                            currentRequest = null;
//                        }
//                        searchIdCounter += 1;
//                        var searchId = searchIdCounter;
                        $scope.results = [TopSearchMapper['search'](search)];
                        var searchData = {q: search};
                        if (SharedData.currentSport) {
                            searchData.sport_id = SharedData.currentSport.id;
                        }
                        currentRequest = searchEndpoint(searchData, function(results) {
//                            if (searchId !== searchIdCounter){
//                                return;
//                            }
                            for (var i = 0; i < results.length; i++) {
                                switch (results[i].type) {
                                    case 'playlist':
                                        results[i].category = 'Playlist';
                                        break;
                                    case 'rider':
                                        results[i].category = 'Rider';
                                        break;
                                    default:
                                        results[i].category = 'Trick';
                                        break;
                                }
                                $scope.results.push(results[i]);
                            }
                        });
                        currentRequest
                                .$promise
                                .finally(function() {
//                                    searchDisabled = false;
                                });

//                        if (SharedData.currentSport) {
//                            searchData.sport_id = SharedData.currentSport.id;
//                        }
//                        $scope.results.push(TopSearchMapper['search'](search));
//
//                        TagEntity
//                                .suggest(searchData, function(results) {
//                                    for (var i = 0; i < results.length; i++) {
//                                        var data = TopSearchMapper['tag'](results[i]);
//                                        $scope.results.push(data);
//                                    }
//                                })
//                                .$promise
//                                .finally(function() {
//                                    searchDisabled = false;
//                                });
//
//                        // If the search does not contains any number we search for riders
//                        if (!(new RegExp(".*[0-9].*")).test(search)) {
//                            RiderEntity
//                                    .search({q: search}, function(results) {
//                                        for (var i = 0; i < results.length; i++) {
//                                            var data = TopSearchMapper['rider'](results[i]);
//                                            $scope.results.push(data);
//                                        }
//                                    })
//                                    .$promise
//                                    .finally(function() {
//                                        searchDisabled = false;
//                                    });
//                        }
//
//                        PlaylistEntity
//                                .search({q: search}, function(results) {
//                                    for (var i = 0; i < results.length; i++) {
//                                        var data = TopSearchMapper['playlist'](results[i]);
//                                        $scope.results.push(data);
//                                    }
//                                })
//                                .$promise
//                                .finally(function() {
//                                    searchDisabled = false;
//                                });
                    }
                }

                function onSelect(event, data) {
                    console.log("on-search-item-selected");
                    console.log(data);
                    $scope.$emit("on-search-item-selected", data);
                }

            }],
        link: function(scope, element) {
            scope.onSearchButtonClick = onSearchButtonClick;

//            scope.$watch('currentSearch', function(newVal){
//                console.log("-------------");
//                console.log(newVal);
//            });

            function onSearchButtonClick() {
                var uiSelect = $(element).find('.ui-select-container').controller('uiSelect');
                // focus the focusser, putting focus onto select but without opening the dropdown
                uiSelect.focusser[0].focus();
            }
        }
    };
}
