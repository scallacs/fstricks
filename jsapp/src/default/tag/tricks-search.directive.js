angular.module('app.tag')
        .directive('tricksSearch', tricksSearchDirective)
        .factory('TopSearchMapper', TopSearchMapper);

function SearchTypeToStr(val) {
    switch (val) {
        case 'rider':
            return 'Rider';
        case 'tag':
            return 'Trick';
        case 'playlist':
            return 'Playlist';
        case 'video':
            return 'Video';
        case 'sport':
            return 'Best of';
        case 'search':
            return 'Trick';
        default:
            return '';
    }
}

TopSearchMapper.$inject = ['SharedData'];
function TopSearchMapper(SharedData) {
    return function (type, data) {
        var res = angular.copy(data);
        res.type = type;
        res.category = SearchTypeToStr(type);
        switch (type) {
            case 'rider':
                res.title = res.firstname + ' ' + res.lastname;
                res.sub_title = res.nationality.toUpperCase()
                res.points = res.count_tags;
                break;
            case 'tag':
                console.log(res);
                res.title = res.name;
                res.sub_title = res.category.sport.name + ' ' + res.category.name;
                res.points = res.count_ref;
                break;
            case 'playlist':
                res.sub_title = '';
                res.points = res.count_points;
                break;
            case 'video':
                res.sub_title = '';
                break;
            case 'sport':
                res.title = res.name;
                res.sub_title = (res.category ? res.category : '');
                break;
            case 'search':
                res.title = "* " + res.q + " *";
                if (SharedData.currentSport) {
                    res.sport_id = SharedData.currentSport.id;
                    res.sub_title = SharedData.currentSport.name;
                } else {
                    res.sub_title = 'any sports';
                }
                break;
            default:
                console.log("ERROR: no search type " + type);
        }
        return res;
    };
}

/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
tricksSearchDirective.$inject = ['ApiFactory', 'VideoTagData', 'TopSearchMapper'];
function tricksSearchDirective(ApiFactory, VideoTagData, TopSearchMapper) {
    return {
        templateUrl: __PathConfig__.template + '/tag/partials/tricks-search.html',
        scope: {
            currentSearch: '='
        },
        controller: ['$scope', 'SharedData',
            function ($scope, SharedData) {
                $scope.results = [];
                $scope.onSelect = onSelect;
                $scope.refresh = refresh;
                $scope.onSearchButtonClick = onSearchButtonClick;
                $scope.videoTagData = VideoTagData;
                $scope.search = {
                    selected: $scope.currentSearch
                };

                $scope.onSearchBarSelected = function () {

                };
                $scope.groupBySearchType = function (item) {
                    return item.category;
                };

                $scope.$watch('currentSearch', function (val) {
                    $scope.search.selected = val;
                });

                var searchEndpoint = ApiFactory.endpoint('Searchs', 'search').query;

                /**
                 * Header search bar function
                 * @param {type} trick
                 * @returns {undefined}
                 * 
                 * TODO history
                 */
                function refresh(search) {
                    search = search.trim();
                    VideoTagData.filters.text = search;
                    $scope.results = [];
                    if (search.length >= 2) {
                        var searchData = {
                            q: search,
                            sport_id: SharedData.currentSport ? SharedData.currentSport.id : null
                        };
                        var quickSearch = TopSearchMapper('search', {q: search});
                        console.log(quickSearch);
                        $scope.results = [quickSearch];
                        if (search.length >= 2) {
                            searchEndpoint(searchData, function (results) {
                                $scope.results = [quickSearch];
                                for (var i = 0; i < results.length; i++) {
                                    results[i].category = SearchTypeToStr(results[i].type);
                                    $scope.results.push(results[i]);
                                }
//                                $scope.results = $scope.results.concat(results);
                            });
                        }
                    }
                }

                function onSelect(event, data) {
//                    console.log("on-search-item-selected");
//                    console.log(data);
                    if (!VideoTagData.appendFilters){
                        $scope.$emit("on-search-item-selected", data);
                    }
                    else{
                        VideoTagData.addSearchFilter(data, true, true);
                    }
                }


                function onSearchButtonClick() {
                    // focus the focusser, putting focus onto select but without opening the dropdown
//                var uiSelect = $(element).find('.ui-select-container').controller('uiSelect');
//                uiSelect.focusser[0].focus();
                    VideoTagData.focusSearchBar();
                }

            }]
    };
}
