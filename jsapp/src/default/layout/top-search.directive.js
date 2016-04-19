angular.module('app.layout')
        .factory('TopSearchMapper', TopSearchMapper)
        .factory('TopSearchData', TopSearchData)
        .directive('topSearch', topSearchDirective);

TopSearchMapper.$inject = ['SharedData'];
function TopSearchMapper(SharedData) {
    return {
        rider: function (data) {
            data.title = data.firstname + ' ' + data.lastname;
            data.sub_title = ' (' + data.nationality + ')';
            data.points = data.count_tags;
            data.type = 'rider';
            data.category = 'Rider';
            return data;
        },
        tag: function (data) {
            data.title = data.name;
            data.sub_title = data.category.sport.name + ' ' + data.category.name;
            data.points = data.count_ref;
            data.type = 'tag';
            data.category = 'Trick';
            return data;
        },
        trick: function (data) {
            data.title = data.tag.name;
            data.sub_title = data.tag.category.sport.name + ' ' + data.tag.category.name;
            data.points = data.count_ref;
            data.type = 'tag';
            data.category = 'Trick';
            return data;
        },
        playlist: function (data) {
            data.sub_title = '';
            data.points = data.count_points;
            data.type = 'playlist';
            data.category = 'Playlist';
            return data;
        },
        video: function (data) {
            data.sub_title = '';
            data.type = 'video';
            data.category = 'Video';
            return data;
        },
        sport: function (data) {
            data.title = data.name;
            data.sub_title = (data.category ? data.category : '');
            data.type = 'sport';
            data.category = 'Best of';
            return data;
        },
        search: function (q) {
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
            } else {
                search.sub_title = 'any sports';
            }
            search.title = "* " + q + " *";
            return search;
        }
    };
}

function TopSearchData() {
    var self = {
        selected: [],
        setFilters: setFilters,
        addSelected: addSelected
    };

    return self;

    function addSelected(type, data) {
        data.category = type;
        data.type = type;
        this.selected.push(data);
    }


    function setFilters(params) {
//        console.log(params);
        angular.forEach(params, function (val, key) {
            switch (key) {
                case 'q':
                    self.addSelected('trick', {
                        title: val
                    });
                    break;
                case 'rider_id':
                    self.addSelected('rider', {
                        title: 'Rider...'
                    });
                    break;
                case 'rider_slug':
                    self.addSelected('rider', {
                        title: val
                    });
                    break;
            }
        });
    }
}
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
topSearchDirective.$inject = ['TopSearchMapper', 'ApiFactory'];
function topSearchDirective(TopSearchMapper, ApiFactory) {
    return {
        templateUrl: __PathConfig__.template + '/layout/partials/top-search.html',
        controller: ['$scope', 'SharedData', '$sce', 'TopSearchData', '$filter',
            function ($scope, SharedData, $sce, TopSearchData, $filter) {
                $scope.results = [];
                $scope.onSelect = onSelect;
                $scope.refresh = refresh;
                $scope.searchData = TopSearchData;

                $scope.trustAsHtml = function (value) {
                    return $sce.trustAsHtml(value);
                };

                var searchEndpoint = ApiFactory.endpoint('Searchs', 'search').query;


                function addSuggested(type, data) {
                    data.category = type;
                    data.type = type;
                    $scope.results.push(data);
                }

                function immediateSearch(search) {
                    console.log('Imediate search with term ' + search);
                    $scope.results = [];
                    if (search.length >= 2) {
                        addSuggested('search', TopSearchMapper['search'](search));
                    }
                    var category = $filter('searchCategory')(SharedData.categories, search);
                    if (category) {
                        console.log(category);
                        category.forEach(function (item) {
                            addSuggested(item.sport.name, {
                                title: item.name
                            });
                        });
                    }
                    return $scope.results;
                }
                /**
                 * Header search bar function
                 * @param {type} trick
                 * @returns {undefined}
                 * 
                 * TODO history
                 */
                function refresh(search) {
                    search = search.trim();
                    $scope.results = immediateSearch(search);
                    if (search.length >= 2) {
                        var searchData = {
                            q: search,
                            sport_id: SharedData.currentSport ? SharedData.currentSport.id : null
                        };
                        searchEndpoint(searchData, function (results) {
                            $scope.results = immediateSearch(search);
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
                                addSuggested(results[i].type, results[i]);
                            }
                        });
                    }
                }

                function onSelect(event, data) {
                    console.log("on-search-item-selected");
                    console.log(data);
                    if (TopSearchData.selected.length === 1) {
                        $scope.$emit("on-search-item-selected", data);
                    }
                }

            }],
        link: function (scope, element) {
            scope.onSearchButtonClick = onSearchButtonClick;

            function onSearchButtonClick() {
                var uiSelect = $(element).find('.ui-select-container').controller('uiSelect');
                // focus the focusser, putting focus onto select but without opening the dropdown
                uiSelect.focusser[0].focus();
            }
        }
    };
}
