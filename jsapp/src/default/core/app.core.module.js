angular
        .module('app.core', ['ngCookies'])
        .factory('SharedData', SharedData)
        .factory('NationalityEntity', NationalityEntity)
        .factory('RiderEntity', RiderEntity)
        .factory('UserEntity', UserEntity)
        .factory('ErrorReportEntity', ErrorReportEntity)
        .factory('VideoEntity', VideoEntity)
        .factory('SportEntity', SportEntity)
        .factory('TagEntity', TagEntity)
        .factory('UpDownPointEntity', UpDownPointEntity)
        .factory('VideoTagEntity', VideoTagEntity)
        .factory('PlaylistEntity', PlaylistEntity)
        .factory('PlaylistItemEntity', PlaylistItemEntity)
        .factory('AuthenticationService', AuthenticationService)
        .factory('ServerConfigEntity', ServerConfigEntity)
        .factory('VideoTagAccuracyRateEntity', VideoTagAccuracyRateEntity)
        .directive('notifyOnLoad', NotifyOnLoad)
        .filter('searchCategory', searchCategory)
        .filter('getByProperty', getByProperty);
//        .filter('trickListFilter', trickListFilter);

NotifyOnLoad.$inject = ['$rootScope', '$timeout'];
function NotifyOnLoad($rootScope, $timeout) {
    return function() {
        $timeout(function() {
            $rootScope.$broadcast('notity-player-offset');
        });
    };
}
//
//trickListFilter.$inject = ['VideoTagData'];
//function trickListFilter(VideoTagData) {
//    return function(input) {
//        var result = [];
//        input.forEach(function(item){
//            var keep = input.tag.name.inde
//            if (keep){
//                result.push(item);
//            }
//        });
//        return input;
//    };
//}

function searchCategory() {
    return function(categories, term) {
        if (term.length === 0) {
            return categories;
        }
        var results = [];
        var terms = term.trim().toLowerCase().split(' ');
        angular.forEach(categories, function(item) {
            var found = 0;
            for (var i = 0; i < terms.length; i++) {
                var term = terms[i].trim();
                var categoryName = item.name.toLowerCase();
                var sportName = item.sport.name.toLowerCase();
                if ((categoryName.indexOf(term) !== -1) ||
                        (sportName.indexOf(term) !== -1)) {
                    found++;
                }
            }
            if (found === terms.length) {
                results.push(item);
            }
        });
        return results;
    };

}

function getByProperty() {
    return function(collection, value, attr) {
        for (var i = 0; i < collection.length; i++) {
            var item = collection[i];
            if (item[attr] === value) {
                return item;
            }
        }
        return null;
    };

}
SharedData.$inject = ['SportEntity', '$filter'];
function SharedData(SportEntity, $filter) {
    var self = {
        setCurrentSearch: setCurrentSearch,
        setCurrentCategory: setCurrentCategory,
        onReady: onReady,
        pageLoader: pageLoader,
        init: init,
        sports: [],
        loadingState: true,
        currentSearch: {},
        currentSport: null,
        currentCategory: null,
        categories: [],
        getCategoryBy: getCategoryBy,
        getSportBy: getSportBy,
        populateCategory: populateCategory
    };

    return self;

    function setCurrentCategory(c) {
        this.currentCategory = c;
    }

    function setCurrentSearch(s) {
        console.log('Setting current search: ');
        console.log(s);
        if (s === null) {
            this.currentSearch = {};
            return;
        }
        this.currentSearch = s;
    }

    function onReady() {
        return this.loadingPromise;
    }

    function pageLoader(val) {
        //console.log('Set loading sate: ' + val);
        self.loadingState = val ? true : false;
    }
    
    function getCategoryBy(field, value){
        return $filter('getByProperty')(self.currentSport !== null ? self.currentSport.categories : this.categories, value, field);
    }
    
    function getSportBy(field, value){
        return $filter('getByProperty')(this.sports, value, field);
    }
    
    function populateCategory(values){
        for (var i = 0; i < values.length; i++){
            if (values[i].category_id){
                values[i].category = this.getCategoryBy('id', values[i].category_id);
            }
        }
    }

    function init() {
        this.loadingPromise = SportEntity.index({}, function(response) {
            self.sports = response;
            self.categories = [];
            for (var i = 0; i < response.length; i++) {
                var sport = response[i];
                for (var j = 0; j < sport.categories.length; j++) {
                    var category = sport.categories[j];
                    category.sport = sport;
                    self.categories.push(category);
                }
            }
        }).$promise;
    }
}

NationalityEntity.$inject = ['$resource'];
function NationalityEntity($resource) {

    var url = __APIConfig__.baseUrl + 'nationalities/:action.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        all: {
            method: 'GET',
            params: {action: 'index'},
            isArray: true
        }
    });
}

RiderEntity.$inject = ['$resource'];
function RiderEntity($resource) {
    var url = __APIConfig__.baseUrl + 'Riders/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        search: {
            method: 'GET',
            params: {action: 'local_search'},
            isArray: true
        },
        save: {
            method: 'POST',
            params: {action: 'save'},
            isArray: false
        },
        add: {
            method: 'POST',
            params: {action: 'add'},
            isArray: false
        }, profile: {
            method: 'GET',
            params: {action: 'profile'},
            isArray: false
        }
    });
}

UserEntity.$inject = ['$resource'];
function UserEntity($resource) {
    var url = __APIConfig__.baseUrl + 'Users/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {profile: {
            method: 'GET',
            params: {action: 'profile'},
            isArray: false
        },
        edit: {
            method: 'POST',
            params: {action: 'edit'},
            isArray: false
        },
        removeAccount: {
            method: 'POST',
            params: {action: 'remove_account'},
            isArray: false
        },
        login: {
            method: 'POST',
            params: {action: 'login'},
            isArray: false
        },
        logout: {
            method: 'POST',
            params: {action: 'logout', id: null},
            isArray: false
        },
        signup: {
            method: 'POST',
            params: {action: 'signup'},
            isArray: false
        },
        requestPassword: {
            method: 'POST',
            params: {action: 'request_password', id: null},
            isArray: false
        },
        resetPassword: {
            method: 'POST',
            params: {action: 'reset_password', id: null},
            isArray: false
        },
        changePassword: {
            method: 'POST',
            params: {action: 'change_password', id: null},
            isArray: false
        }
    });
}

ErrorReportEntity.$inject = ['$resource'];
function ErrorReportEntity($resource) {
    var url = __APIConfig__.baseUrl + 'ReportErrors/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        post: {
            method: 'POST',
            params: {action: 'add'},
            isArray: false
        }
    });
}

VideoEntity.$inject = ['$resource'];
function VideoEntity($resource) {
    var url = __APIConfig__.baseUrl + 'Videos/:action/:id/:provider.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        addOrGet: {
            method: 'POST',
            params: {action: 'addOrGet', id: null},
            isArray: false
        },
        view: {
            method: 'GET',
            params: {action: 'view'},
            isArray: false
        },
        search: {
            method: 'GET',
            params: {action: 'search', id: null},
            isArray: false
        },
        reportDeadLink: {
            method: 'GET',
            params: {action: 'report_dead_link', id: null},
            isArray: false
        }
    });
}

SportEntity.$inject = ['$resource'];
function SportEntity($resource) {
    var url = __APIConfig__.baseUrl + 'Sports/:action/:id.json';
    //var url = '/sys/MediaTagTricks/:action/:id';
    return $resource(url, {id: '@id', action: '@action'}, {
        index: {
            method: 'GET',
            params: {action: 'index'},
            isArray: true,
            cache: true
        }
    });

}

TagEntity.$inject = ['$resource'];
function TagEntity($resource) {
    var url = __APIConfig__.baseUrl + 'Tags/:action/:id.json';
    //var url = '/sys/MediaTagTricks/:action/:id';
    return $resource(url, {id: '@id', action: '@action', sport: '@sport', category: '@category', trick: '@trick'}, {suggest: {
            method: 'GET',
            params: {action: 'suggest'},
            isArray: true
        },
        suggestCategory: {
            method: 'GET',
            params: {action: 'suggestCategory', id: null},
            isArray: true
        }
    });
}

UpDownPointEntity.$inject = ['$resource'];
function UpDownPointEntity($resource) {
    var url = __APIConfig__.baseUrl + ':controller/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action', controller: '@controller'}, {
        up: {
            method: 'POST',
            params: {action: 'up'},
            isArray: false
        },
        down: {
            method: 'POST',
            params: {action: 'down'},
            isArray: false
        }
    });
}

VideoTagAccuracyRateEntity.$inject = ['$resource'];
function VideoTagAccuracyRateEntity($resource) {
    var url = __APIConfig__.baseUrl + 'VideoTagAccuracyRates/:action.json';
    return $resource(url, {action: '@action'}, {
        accurate: {
            method: 'POST',
            params: {action: 'accurate'},
            isArray: false
        },
        fake: {
            method: 'POST',
            params: {action: 'fake'},
            isArray: false
        },
        skip: {
            method: 'POST',
            params: {action: 'skip'},
            isArray: false
        }
    });
}

VideoTagEntity.$inject = ['$resource'];
function VideoTagEntity($resource) {
    var url = __APIConfig__.baseUrl + 'VideoTags/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        view: {
            method: 'GET',
            params: {action: 'view'},
            isArray: false
        },
        add: {
            method: 'POST',
            params: {action: 'add'},
            isArray: false
        },
        trending: {
            method: 'GET',
            params: {action: 'trending'},
            isArray: true
        },
        edit: {
            method: 'POST',
            params: {action: 'edit'},
            isArray: false
        },
        delete: {
            method: 'POST',
            params: {action: 'delete'},
            isArray: false
        },
        search: {
            method: 'GET',
            params: {action: 'search'},
            isArray: false
        },
        validation: {
            method: 'GET',
            params: {action: 'validation'},
            isArray: true
        }, similar: {
            method: 'POST',
            params: {action: 'similar'},
            isArray: true
        },
        rider: {
            method: 'GET',
            params: {action: 'rider'},
            isArray: true
        },
        recentlyTagged: {
            method: 'GET',
            params: {action: 'recentlyTagged', id: null},
            isArray: false
        }
    });
}
PlaylistEntity.$inject = ['$resource'];
function PlaylistEntity($resource) {
    var url = __APIConfig__.baseUrl + 'Playlists/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        user: {
            method: 'GET',
            params: {action: 'user'},
            isArray: false
        },
        trending: {
            method: 'GET',
            params: {action: 'trending'},
            isArray: true
        },
        search: {
            method: 'GET',
            params: {action: 'search'},
            isArray: true
        },
        add: {
            method: 'POST',
            params: {action: 'add'},
            isArray: false
        },
        view: {
            method: 'GET',
            params: {action: 'view'},
            isArray: false
        },
        delete: {
            method: 'POST',
            params: {action: 'delete'},
            isArray: false
        },
        edit: {
            method: 'POST',
            params: {action: 'edit'},
            isArray: false
        }
    });
}

PlaylistItemEntity.$inject = ['$resource'];
function PlaylistItemEntity($resource) {
    var url = __APIConfig__.baseUrl + 'PlaylistVideoTags/:action/:id.json';
    return $resource(url, {id: '@id', action: '@action'}, {
        playlist: {
            method: 'GET',
            params: {action: 'playlist'},
            isArray: false
        },
        add: {
            method: 'POST',
            params: {action: 'add'},
            isArray: false
        },
        delete: {
            method: 'POST',
            params: {action: 'delete'},
            isArray: false
        },
        edit: {
            method: 'POST',
            params: {action: 'edit'},
            isArray: false
        }
    });
}
ServerConfigEntity.$inject = ['$resource'];
function ServerConfigEntity($resource) {
    var resource = $resource(__PathConfig__.webroot + '/data/:action.json', {action: '@action'}, {
        rules: {
            method: 'GET',
            params: {action: 'rules'},
            isArray: false,
            cache: true
        },
        countries: {
            method: 'GET',
            params: {action: 'countries'},
            isArray: true,
            cache: true
        }
    });

    return {
        rules: rules,
        countries: countries
    };

    function rules() {
        return resource.rules().$promise;
    }

    function countries() {
        return resource.countries().$promise;
    }


}

AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', 'UserEntity', '$state', 'PaginateDataLoader', '$auth'];
function AuthenticationService($http, $cookies, $rootScope, UserEntity, $state, PaginateDataLoader, $auth) {
    var service = {};

    service.login = login;
    service.logout = logout;
    service.setCredentials = setCredentials;
    service.clearCredentials = clearCredentials;
    service.getCurrentUser = getCurrentUser;
    service.isAuthed = isAuthed;
    service.socialLogin = socialLogin;
    service.signup = signup;
    service.requireLogin = requireLogin;
    service.requestPassword = requestPassword;
    service.isProvider = isProvider;
    service.logFromCookie = logFromCookie;
    service.init = init;
    service.setAuthData = setAuthData;

    service.authData = {
        token: null,
        user: null,
        provider: null,
        isAuthed: function() {
            return service.isAuthed();
        }
    };

    return service;

    function init() {
        service.logFromCookie();
    }

    function isProvider(p) {
        console.log('Provider: ' + service.authData.provider + ' ?= ' + p);
        return service.authData.provider === p;
    }

    function isAuthed() {
        return service.authData.token !== null && service.authData.user !== null;
    }

    function getCurrentUser() {
        return service.authData.user;
    }

    function setAuthData(data, provider) {
        if (data === null) {
            service.authData.user = null;
            service.authData.token = null;
            service.authData.provider = null;
        }
        else {
            service.authData.user = data.user;
            service.authData.token = data.token;
            service.authData.provider = provider ? provider : data.provider;
        }
    }

    function logFromCookie() {
        var globals = $cookies.getObject('globals');
        if (!globals) {
            console.log("Getting current user from cookies: NO COOKIES");
            service.setAuthData(null);
            return;
        }
        console.log("Getting current user from cookies");
        service.setAuthData(globals);
        setHttpHeader();
    }

    function login(username, password) {
        var promise = UserEntity.login({email: username, password: password, id: null}, function(response) {
            if (response.success) {
                service.setCredentials('local', response.data);
            }
        }).$promise;
        return promise;
    }

    function signup(data) {
        return UserEntity.signup(data, function(response) {
            console.log(response);
            if (response.success) {
                service.setCredentials('local', response.data);
            }
        }).$promise;
    }

    function requestPassword(email) {
        return UserEntity.requestPassword({email: email}, function(response) {
            console.log(response);
        }).$promise;
    }

    function socialLogin(provider) {
        var promise = $auth.authenticate(provider, {provider: provider});
        promise.then(successCallback);

        function successCallback(response) {
            response = response.data;
            if (response.success) {
                service.setCredentials(provider, response.data);
            }
        }
        return promise;

//        return UserEntity.socialLogin({id: null, provider: provider}, function(response) {
//            console.log(response);
//            if (response.success) {
//                service.setCredentials(provider, response.data);
//            }
//            callback(response.success, response);
        //        }).$promise;
    }

    function setHttpHeader() {
        console.log('Setting auth header with token: ' + service.authData.token);
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + service.authData.token;
    }

    function setCredentials(provider, data) {
        console.log('Setting credential from : ' + provider);
        service.setAuthData(data, provider);
        console.log(service.authData);
        $rootScope.globals = service.authData; // TODO useless ? 
        $cookies.remove('globals');

        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 7); // TODO param

        $cookies.putObject('globals', service.authData, {'expires': expireDate});
        console.log("Saving credential for user: " + data.user.email + " with provider " + provider + " - stored: " + getCurrentUser().email);
        setHttpHeader();
    }

    function logout() {
        UserEntity.logout(function() {
            clearCredentials();
        }, function() {
            console.log("Cannot logout");
        });
    }

    function clearCredentials() {
        service.setAuthData(null);
        $rootScope.globals = {};
        $cookies.remove('globals');
        $http.defaults.headers.common.Authorization = 'Basic';
        console.log("Clearing credential");
    }

    function requireLogin() {
        if (!isAuthed()) {
            console.log("User needs to be logged in to access this content");
            $state.go('login');
        }
    }

}
