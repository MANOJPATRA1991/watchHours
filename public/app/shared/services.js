angular.module('watchHoursApp')

/** This is the BASE URL for the application. */
.constant("baseURL", "https://watch-hours.herokuapp.com/")


/**
 *  This factory is used to perform GET request for all shows
 */
.factory('Shows', ['$cacheFactory', '$resource', 'baseURL', function($cacheFactory, $resource, baseURL){
        // empty reference array
        var Shows = $resource('/shows', {}, {
            query: {
                method: 'GET',
                isArray: true
            }
        });
        return Shows;
    }])


/**
 *  This factory is used to perform GET request for a particular show
 */
.factory('Series', ['$cacheFactory', '$resource', 'baseURL', function($cacheFactory, $resource, baseURL){
        // empty reference object
        var Series = $resource('/shows/:id', {seriesId:'@id'}, {
           query: {
                method: 'GET',
                isArray: false
           }
        });
        return Series;
    }])


/**
 *  This factory is used to perform GET request for episodes belonging to a particular show
 */
.factory('Episodes', ['$cacheFactory', '$resource', 'baseURL', function($cacheFactory, $resource, baseURL){
        // empty reference array
        var Episodes = $resource('/episodes/:seriesId', {seriesId:'@seriesId'}, {
            query: {
                method: 'GET',
                isArray: true
            },
            'update': {
                method: 'PUT'
            }
        });
        return Episodes;
    }])


/**
 *  This factory is used to perform GET request for a posters belonging to a particular show
 */
.factory('Posters', ['$cacheFactory', '$resource', 'baseURL', function($cacheFactory, $resource, baseURL){
        // empty reference array
        var Posters = $resource('/posters/:seriesId', {seriesId:'@seriesId'}, {
            query: {
                method: 'GET',
                isArray: true
            }
        });
        return Posters;
    }])

/**
 * Get count of posters
 */
.factory('PostersCount', ['$cacheFactory', '$resource', 'baseURL', function($cacheFactory, $resource, baseURL){
    // empty reference array
    var PostersCount = $resource('/posters/:seriesId/count', {seriesId:'@seriesId'}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });
    return PostersCount;
}])

/**
 *  This factory is used to perform GET request for actors of a particular show
 */
.factory('Actors', ['$cacheFactory', '$resource', 'baseURL', function($cacheFactory, $resource, baseURL){
    // empty reference array
    var Actors = $resource('/actors/:seriesId', {seriesId:'@seriesId'}, {
        query: {
            method: 'GET',
            isArray: true
        }
    });
    return Actors;
}])

/**
 * Get count of actors
 */
.factory('ActorsCount', ['$cacheFactory', '$resource', 'baseURL', function($cacheFactory, $resource, baseURL){
    // empty reference array
    var ActorsCount = $resource('/actors/:seriesId/count', {seriesId:'@seriesId'}, {
        query: {
            method: 'GET',
            isArray: false
        }
    });
    return ActorsCount;
}])

/**
 *  This factory is used to perform POST request to subscribe, watchlist and favorites
 */
.factory('Subscription', ['$http', 'baseURL', function($http, baseURL) {
        return {
            subscriptions: function(show, uid) {
                return $http.post('/subscription/subscribe', { showId: show._id, uid: uid });
            },
            watchlist: function(show, uid) {
                return $http.post('/subscription/watchlist', { showId: show._id, uid: uid });
            },
            favorites: function(show, uid) {
                return $http.post('/subscription/favorites', { showId: show._id, uid: uid });
            }
        };
    }])


/**
 *  This factory is used to perform PUT request for comments in a particular episode
 */
.factory('commentFactory', ['$resource', 'baseURL', function ($resource, baseURL) {

    return $resource("/episodes/:id/comments/:commentId", {id:"@Id", commentId: "@CommentId"}, {
        'update': {
            method: 'PUT'
        }
    });

}])


.factory('HomeServices', [function(){
        var homeServices = {};
        var TODAY = moment().startOf('day');

        var TOMORROW = moment().add(1, 'days').startOf('day');

        // compare shows based on rating
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

        // check if day is today
        homeServices.isToday = function(momentDate) {
            return momentDate.isSame(TODAY, 'd');
        }

        // check if day is tomorrow
        homeServices.isTomorrow = function(momentDate) {
            return momentDate.isSame(TOMORROW, 'd');
        }

        // check if day is within this week
        homeServices.isWithinAWeek = function(momentDate) {
            return momentDate.isAfter(moment().startOf('week')) && momentDate.isBefore(moment().endOf('week'));
        }

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

.factory('AuthFactory', ['$resource', '$http', '$localStorage',
    '$rootScope', '$window', 'baseURL', '$state',
    function($resource, $http, $localStorage,
        $rootScope, $window, baseURL, $state){

    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var isVerified = false;
    var admin = false;
    var authToken = undefined;
    var _id = '';
    var error = '';
    var message = '';

    function useCredentials(credentials) {
        isAuthenticated = true;
        username = credentials.username;
        authToken = credentials.token;
        admin = credentials.admin;
        isVerified = credentials.isVerified;
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
        isVerified = false;
        isAuthenticated = false;
        $http.defaults.headers.common['x-access-token'] = authToken;
        $localStorage.remove(TOKEN_KEY);
    }

    authFac.storeCredentials = function(data){
        storeUserCredentials(data);
    };

    authFac.forgotPassword = function(email){
        $resource("/users/forgotpassword")
            .save(email,
            function(response) {
                message = response.res;
                $rootScope.$broadcast('email sent');
            },
            function(err) {
                error = err.data.err.message;
                $rootScope.$broadcast('email not sent');
            }
        );
    }

    authFac.resetPassword = function(){
        return $resource("/users/resetpassword", {authToken: '@authToken'}, {
            'update': {
                method: 'PUT'
            }
        });
    }

    authFac.login = function(loginData) {

        $resource("/users/login")
            .save(loginData,
            function(response) {
                storeUserCredentials({
                    username:loginData.username,
                    token: response.token,
                    admin: response.admin,
                    _id: response._id,
                    isVerified: response.isVerified
                });
                $rootScope.$broadcast('login:Successful');
            },
            function(err) {
                isAuthenticated = false;
                error = err.data.err.message;
                $rootScope.$broadcast('login:Unsuccessful');
            }
        );
    };

    authFac.logout = function() {
        $resource("/users/logout").get(function(response){
        });
        destroyUserCredentials();
    };

    authFac.register = function(registerData) {

        $resource("/users/register")
            .save(registerData,
            function(response){
                $rootScope.$broadcast('registration:Successful');
            },
            function(err){
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

    authFac.isVerified = function() {
        return isVerified;
    };

    authFac.isAdmin = function(){
        return admin;
    }

    authFac.uid = function(){
        return _id;
    }

    authFac.Error = function(){
        return error;
    }

    authFac.Message = function(){
        return message;
    }

    loadUserCredentials();

    return authFac;

}]);