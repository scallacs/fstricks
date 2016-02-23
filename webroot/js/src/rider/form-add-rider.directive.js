angular
        .module('app.rider')
        .directive('formAddRider', function(Upload, $timeout) {
            return {
                restrict: 'EA',
                templateUrl: 'js/src/rider/partials/form-add-rider.html',
                scope: {
                    profilePicture: '=profilePicture',
                    saveMethod: '=saveMethod',
                    defaultRider: '&rider',
                    findSimilarRiders: '=similarRiders',
                    formGroupClass: '=formGroupClass'
                },
                controller: function($scope, RiderEntity, ServerConfigEntity) {
                    $scope.save = save;
                    $scope.cancel = cancel;
                    $scope.selectExistingRider = selectExistingRider;

                    $scope.convertToInt = function(id) {
                        return parseInt(id, 10);
                    };

                    $scope.similarRiders = [];
                    $scope.nationalities = [];
                    $scope.levels = [];
                    $scope.uploader = {
                        options: {
                            target: 'riders/save.json',
                            maxFiles: "'.pdf,.jpg,.png'",
                            pattern: 'picture',
                            minSize: '100KB',
                            maxSize: '5MB',
                            minHeight: '50',
                            resize: {width: 1000, height: 1000}
                        },
                        picture: null
                    };


                    if (!angular.isDefined($scope.findSimilarRiders)) {
                        $scope.findSimilarRiders = false;
                    }

                    ServerConfigEntity.countries().then(function(nationalities) {
                        $scope.nationalities = nationalities;
                    });
                    ServerConfigEntity.rules().then(function(rules) {
                        $scope.levels = rules.riders.level.values;
                    });

                    $scope.$watch('rider.firstname + rider.lastname', function() {
                        if ($scope.rider && $scope.findSimilarRiders
                                && $scope.rider.lastname && $scope.rider.firstname
                                && $scope.rider.lastname.length >= 2 && $scope.rider.firstname.length) {
                            searchSimilars($scope.rider.firstname, $scope.rider.lastname);
                        }
                    });

                    function save(rider, picture) {
                        var promise;
                        if ($scope.profilePicture && picture) {
                            console.log("Uploading profile picture: " + picture);
                            picture.upload = Upload.upload({
                                url: 'riders/' + $scope.saveMethod + '.json',
                                data: {picture: picture, firstname: rider.firstname, lastname: rider.lastname, level: rider.level}
                            });
                            picture.upload.then(function(response) {

                            }, function(response) {

                            }, function(evt) {
                                // Math.min is to fix IE which reports 200% sometimes
                                picture.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                                console.log("Progress: " + this.progress);
                            });
                            promise = picture.upload;
                        }
                        else {
                            console.log("Picture not changed. Method: " + $scope.saveMethod);
                            promise = RiderEntity[$scope.saveMethod](rider).$promise;
                        }
                        $scope.addRiderForm.submit(promise).then(handleServerResponse);
                    }
                    function cancel() {
                        emitRider(null);
                    }
                    function selectExistingRider(rider) {
                        emitRider(rider);
                    }

                    function emitRider(rider) {
                        if (rider !== null) {
                            rider.display_name = rider.firstname + ' ' + rider.lastname;
                        }
                        $scope.initRider();
                        console.log('Emitting rider: ' + rider);
                        $scope.$emit("rider-selected", rider);
                    }


                    /**
                     * Find similar similarRiders
                     * @param {type} firstname
                     * @param {type} lastname
                     * @returns {undefined}
                     */
                    function searchSimilars(firstname, lastname) {
                        $scope.loaderSearchSimilars = true;
                        $scope.similarRiders = [];
                        RiderEntity.search({firstname: firstname, lastname: lastname}, function(riders) {
                                    $scope.similarRiders = riders;
                                    console.log(riders);
                                }, function() {
                                    $scope.similarRiders = [];
                                })
                                .$promise.finally(function() {
                                    $scope.loaderSearchSimilars = false;
                                });
                    }

                    function toggleSportSelection(sportId) {
                        var idx = $scope.riderEdit.sports.indexOf(sportId);
                        if (idx > -1) {
                            $scope.riderEdit.sports.splice(idx, 1);
                        }
                        else {
                            $scope.riderEdit.sports.push(sportId);
                        }
                    }

                    function handleServerResponse(result) {
                        if (angular.isDefined(result.statusText)) {
                            result = result.data;
                        }
                        console.log('Handling server response');
                        console.log(result);
                        if (result.success) {
                            console.log('Saving rider profile success');
                            var rider = angular.copy($scope.rider);
                            rider.id = result.data.rider_id;
                            rider.picture_portrait = result.data.picture_portrait;
                            rider.picture_original = result.data.picture_original;
                            rider.level_string = result.data.level_string;
                            emitRider(rider);
                        }
                    }

                },
                link: function($scope, element) {
                    $scope.rider = {};
                    $scope.initRider = initRider;

                    initRider();

                    function initRider() {
                        if (!angular.isDefined($scope.defaultRider)) {
                            $scope.rider = {firstname: '', lastname: '', nationality: 'fr', level: '1', count_tags: 0};
                        }
                        else {
                            $scope.rider = angular.copy($scope.defaultRider());
                        }
                    }
                }
            };
        });
