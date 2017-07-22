angular.module('watchHoursApp')
.constant("baseURL", "https://localhost:3443")
.factory('Shows', ['$resource', 'baseURL', function($resource, baseURL){
        var Shows = $resource(baseURL + '/shows', {}, {
            query: {
                method: 'GET',
                isArray: true
            }
        });
        return Shows;
    }])

.factory('Series', ['$resource', 'baseURL', function($resource, baseURL){
        var Series = $resource(baseURL + '/shows/:id', {seriesId:'@id'}, {
           query: {
               method: 'GET',
               isArray: false
           }
        });
        return Series;
    }])

.factory('Episodes', ['$resource', 'baseURL', function($resource, baseURL){
        var Episodes = $resource(baseURL + '/episodes/:seriesId', {seriesId:'@seriesId'}, {
            query: {
                method: 'GET',
                isArray: true
            }
        });
        return Episodes;
    }])

.factory('Posters', ['$resource', 'baseURL', function($resource, baseURL){
        var Posters = $resource(baseURL + '/posters/:seriesId', {seriesId:'@seriesId'}, {
            query: {
                method: 'GET',
                isArray: true
            }
        });
        return Posters;
    }])

.factory('Actors', ['$resource', 'baseURL', function($resource, baseURL){
    var Actors = $resource(baseURL + '/actors/:seriesId', {seriesId:'@seriesId'}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
    return Actors;
}])


.factory('Subscription', ['$http', 'baseURL', function($http, baseURL) {
        return {
            subscriptions: function(show, uid) {
                return $http.post(baseURL + '/subscription/subscribe', { showId: show._id, uid: uid });
            },
            watchlist: function(show, uid) {
                return $http.post(baseURL + '/subscription/watchlist', { showId: show._id, uid: uid });
            },
            favorites: function(show, uid) {
                return $http.post(baseURL + '/subscription/favorites', { showId: show._id, uid: uid });
            }
        };
    }])

.factory('commentFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    return $resource(baseURL + "/episodes/:id/comments/:commentId", {id:"@Id", commentId: "@CommentId"}, {
        'update': {
            method: 'PUT'
        }
    });

}])

.factory('HomeServices', [function(){
        var homeServices = {};
        homeServices.compare = function(a, b) {
            // Use toUpperCase() to ignore character casing
            const ratingA = a.rating;
            const ratingB = b.rating;

            var comparison = 0;
            if (ratingA > ratingB) {
                comparison = 1;
            } else if (ratingA < ratingB) {
                comparison = -1;
            }
            return comparison* -1;
        };

        homeServices.showToday = function(today) {
            var now = moment();
            var toDay = moment(today);
            if (now.isSame(toDay, 'day')) {
                console.log(now);
                console.log(toDay);
                return true;
            }
        };

        return homeServices;
    }])

.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    }
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', function($resource, $http, $localStorage, $rootScope, $window, baseURL){

    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var admin = false;
    var authToken = undefined;
    var _id = '';

    function useCredentials(credentials) {
        isAuthenticated = true;
        username = credentials.username;
        authToken = credentials.token;
        admin = credentials.admin;
        _id = credentials._id;
        // Set the token as header for your requests!
        $http.defaults.headers.common['x-access-token'] = authToken;
    }

    function loadUserCredentials() {
        var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
        if (credentials.username != undefined) {
            useCredentials(credentials);
        }
    }

    function storeUserCredentials(credentials) {
        $localStorage.storeObject(TOKEN_KEY, credentials);
        useCredentials(credentials);
    }

    function destroyUserCredentials() {
        authToken = undefined;
        username = '';
        admin = false;
        isAuthenticated = false;
        $http.defaults.headers.common['x-access-token'] = authToken;
        $localStorage.remove(TOKEN_KEY);
    }

    authFac.storeCredentials = function(data){
        storeUserCredentials(data);
    };

    authFac.login = function(loginData) {

        $resource(baseURL + "/users/login")
            .save(loginData,
            function(response) {
                storeUserCredentials({username:loginData.username, token: response.token, admin: response.admin, _id: response._id});
                $rootScope.$broadcast('login:Successful');
            },
            function(error) {
                isAuthenticated = false;
            }
        );
    };

    authFac.logout = function() {
        $resource(baseURL + "/users/logout").get(function(response){
        });
        destroyUserCredentials();
    };

    authFac.register = function(registerData) {

        $resource(baseURL + "/users/register")
            .save(registerData,
            function(response) {
                authFac.login({username:registerData.username, password:registerData.password});
                if (registerData.rememberMe) {
                    $localStorage.storeObject('userinfo',
                        {username:registerData.username, password:registerData.password});
                }

                $rootScope.$broadcast('registration:Successful');
            },
            function(response){
                console.log("Registration Unsuccessful!");
            }
        );
    };

    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };

    authFac.getUsername = function() {
        return username;
    };

    authFac.isAdmin = function(){
        return admin;
    }

    authFac.uid = function(){
        return _id;
    }

    loadUserCredentials();

    return authFac;

}]);