angular.module('app.layout')
        .directive('topSearch', topSearch);
/**
 * Server form. Extend ng form functionnalities.
 * Add a loader when the form is waiting for a server response.
 */
function topSearch(RiderEntity, TagEntity, SharedData) {
    return {
        templateUrl: 'js/src/layout/partials/top-search.html',
        controller: function($scope){
            var partialSearch = {
                picture: false,
                points: false,
                title: null,
                sub_title: null,
                type: 'partial',
                category: 'Trick'
            };
            $scope.data = {};
            $scope.results = [];
            $scope.onSelect = onSelect;
            $scope.refresh = refresh;

            /**
             * Header search bar function
             * @param {type} trick
             * @returns {undefined}
             * 
             * TODO history
             */
            function refresh(search) {
                $scope.results = [];
                search = search.trim();
                if (search.length >= 2) {
                    var searchData = {id: search};
                    if (SharedData.currentSport){
                        searchData.sport_id = SharedData.currentSport.id;
                        partialSearch.sub_title = SharedData.currentSport.name;
                    }
                    else{
                        partialSearch.sub_title = 'any sports';
                    }
                    
                    partialSearch.search = search;
                    partialSearch.title = "* " + search + " *";
                    $scope.results.push(partialSearch);
                    
                    
                    TagEntity.suggest(searchData, function(results){
                        for (var i = 0; i < results.length; i++){
                            var data = mapper()['tag'](results[i]);
                            $scope.results.push(data);
                        }
                    });
                    RiderEntity.search({q: search}, function(results){
                        results = results.data;
                        for (var i = 0; i < results.length; i++){
                            var data = mapper()['rider'](results[i]);
                            $scope.results.push(data);
                        }
                    });
                }
            }
            
            function mapper(){
                return {
                    rider: function(data){
                        data.title = data.firstname + ' ' + data.lastname;
                        data.sub_title = data.level_string + ' (' + data.nationality + ')';
                        data.points = data.count_tags;
                        data.type = 'rider';
                        data.category = 'Rider';
                        return data;
                    },
                    tag: function(data){
                        data.title = data.name;
                        data.sub_title = data.sport_name + ' ' + data.category_name;
                        data.points = data.count_ref;
                        data.type = 'tag';
                        data.category = 'Trick';
                        return data;
                    }
                };
            }
            
            function onSelect(event, data){
                $scope.$emit("on-search-item-selected", data);
            }
        }
    };
}
