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
            return '';
        default:
            return '';
    }
}

TopSearchMapper.$inject = ['SharedData'];
function TopSearchMapper(SharedData) {
    return function (type, data) {
        var res = angular.copy(data);
        switch (type) {
            case 'rider':
                res.title = res.firstname + ' ' + res.lastname;
                res.sub_title = res.nationality.toUpperCase()
                res.points = res.count_tags;
                break;
            case 'tag':
                console.log(res);
                res.title = res.name;
                res.sub_title = data.category.sport.name + ' ' + data.category.name;
                res.points = res.count_ref;
                break;
            case 'playlist':
                res.sub_title = 'Playlist';
                res.points = res.count_points;
                break;
            case 'video':
                res.sub_title = 'Video';
                break;
            case 'category':
                res.title = res.sport.name;
                res.sub_title = res.name;
                break;
            case 'sport':
                res.title = res.name;
                res.sub_title = 'all';
                break;
            case 'search':
                res.title = res.q;
                res.sub_title = 'Trick';
                break;
            default:
                console.log("ERROR: no search type " + type);
        }
        res.type = type;
        res.category = SearchTypeToStr(type);
        return res;
    };
}

/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
tricksSearchDirective.$inject = ['ApiFactory', 'VideoTagData', 'TopSearchMapper', 'PlayerData'];
function tricksSearchDirective(ApiFactory, VideoTagData, TopSearchMapper, PlayerData) {
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
                    PlayerData.showTricksMenu(true);
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
                            }).$promise.finally(function(){
                                // TODO stop loader
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
