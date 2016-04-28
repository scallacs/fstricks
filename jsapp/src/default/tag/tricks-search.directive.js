angular.module('app.tag')
        .directive('tricksSearch', tricksSearchDirective);

/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
tricksSearchDirective.$inject = ['ApiFactory', 'VideoTagData', 'PlayerData'];
function tricksSearchDirective(ApiFactory, VideoTagData, PlayerData) {
    return {
        templateUrl: __PathConfig__.template + '/tag/partials/tricks-search.html',
        scope: {
            currentSearch: '='
        },
        controller: ['$scope', 'SharedData',
            function($scope, SharedData) {
                $scope.results = [];
                $scope.onSelect = onSelect;
                $scope.refresh = refresh;
                $scope.search = {
                    selected: $scope.currentSearch
                };
                $scope.onSearchBarSelected = function(){
                    PlayerData.showListTricks = true;
                };
                
                $scope.$watch('currentSearch', function(val){
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
                    PlayerData.showListTricks = true;
                    search = search.trim();
                    VideoTagData.filters.text = search;
                    if (search.length >= 2) {          
                        var searchData = {
                            q: search,
                            sport_id: SharedData.currentSport ? SharedData.currentSport.id : null
                        };
                        searchEndpoint(searchData, function(results) {
                            var formatedResults = {};
                            for (var i = 0; i < results.length; i++){
                                var item = results[i];
                                if (!formatedResults[item.type]){
                                    formatedResults[item.type] = []
                                }
                                formatedResults[item.type].push(item);
                            }
                            VideoTagData.searchResults = formatedResults;
                            //$scope.results = results;
                        });
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
