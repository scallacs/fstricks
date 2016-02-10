angular
        .module('app.rider')
        .directive('formAddRider', function() {
            return {
                restrict: 'EA',
                templateUrl: 'js/src/rider/partials/form-add-rider.html',
                scope: {
                    profilePicture: '=profilePicture',
                    saveMethod: '=saveMethod',
                    defaultRider: '&rider',
                    findSimilarRiders: '=similarRiders'
                },
                controller: function($scope, RiderEntity, ServerConfigEntity) {
                    $scope.save = save;
                    $scope.cancel = cancel;
                    $scope.selectExistingRider = selectExistingRider;
                    $scope.onUploadSuccess = onUploadSuccess;
                    $scope.onUploadError = onUploadError;
                    $scope.convertToInt = function(id){return parseInt(id, 10);};
                    
                    $scope.similarRiders = [];
                    $scope.nationalities = [];
                    $scope.levels = [];
                    $scope.uploader = {
                        flow: null,
                        init: {
                            target: 'riders/save.json',
                            singleFile: true,
                            testChunks: false,
                            fileParameterName: 'picture',
                            chunkSize: 1024 * 1024 * 5,
                            query: function() {
                                return $scope.rider;
                            }
                        }
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
                        console.log($scope.rider);
                        if ($scope.rider && $scope.findSimilarRiders && $scope.rider.lastname.length >= 2 && $scope.rider.firstname.length) {
                            searchSimilars($scope.rider.firstname, $scope.rider.lastname);
                        }
                    });

                    function save(rider) {
                        var flow = $scope.uploader.flow;
                        if ($scope.profilePicture && flow.files.length === 1) {
                            $scope.addRiderForm.pending(true);
                            console.log("Uploading file...");
                            flow.upload();
                        }
                        else {
                            console.log("Adding rider, file not changed. Method: " + $scope.saveMethod);
                            $scope.addRiderForm.submit(RiderEntity[$scope.saveMethod](rider).$promise).then(function(result) {
                                handleServerResponse(result);
                            });
                        }
                    }
                    function cancel() {
                        emitRider(null);
                    }
                    function selectExistingRider(rider) {
                        emitRider(rider);
                    }

                    function emitRider(rider) {
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
                        RiderEntity.search({firstname: firstname, lastname: lastname}, function(results) {
                            $scope.similarRiders = results.data;
                            $scope.loaderSearchSimilars = false;
                        }, function() {
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

                    function onUploadSuccess($file, $message, $flow) {
                        var result = angular.fromJson($message);
                        $scope.addRiderForm.pending(false);
                        if (!result.success) {
                            console.log('Setting form errors:');
                            $scope.addRiderForm.setValidationErrors(result.validationErrors.Riders);
                        }
                        handleServerResponse(result);
                    }

                    function onUploadError($file, $message, $flow) {
                        // TODO error message
                        $scope.addRiderForm.pending(false);
                    }

                    function onUploadComplete() {
                        $scope.addRiderForm.pending(false);
                    }

                    function handleServerResponse(result) {
                        if (result.success) {
                            console.log('Saving rider profile success');
                            var rider = angular.copy($scope.rider);
                            rider.id = result.data.rider_id;
//                    rider.display_name = result.data.rider_display_name;
                            rider.picture_portrait = result.data.picture_portrait;
                            rider.picture_original = result.data.picture_original;
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
                            console.log("Init rider");
                            $scope.rider = {firstname: '', lastname: '', nationality: 'fr', level: '1'};
                        }
                        else {
                            console.log("Using default rider");
                            $scope.rider = angular.copy($scope.defaultRider());
                        }
                        console.log("Init form add rider");
                        console.log($scope.rider);
                    }
                }
            };
        });
