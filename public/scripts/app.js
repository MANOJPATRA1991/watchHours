angular.module('watchHoursApp', ['ui.router', 'ngResource', 'ngRoute', 'ui.bootstrap', 'formly', 'formlyBootstrap']);

angular.module('watchHoursApp')
.config(function($stateProvider, $urlRouterProvider, $locationProvider){
        //$locationProvider.hashPrefix('');
        //$locationProvider.html5Mode(true);

        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'HeaderCtrl'
                    },
                    'content': {
                        templateUrl: 'views/home.html',
                        controller: 'HomeCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer.html'
                    }
                }
            })
            .state('app.showsToday', {
                views: {
                  'showday@app': {
                      templateUrl: 'views/showstoday.html',
                      controller: 'HomeCtrl'
                  }
                }
            })
            .state('app.showsThisWeek', {
                views: {
                    'showday@app': {
                        templateUrl: 'views/showsThisWeek.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
            .state('app.showsTomorrow', {
                views: {
                    'showday@app': {
                        templateUrl: 'views/showsTomorrow.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
            .state('app.login', {
                url: 'login',
                views: {
                    // Absolutely targets the 'content' view in the 'app' state
                    'header@': {
                        template: ""
                    },
                    'content@': {
                        templateUrl: 'views/login.html',
                        controller: 'LoginCtrl'
                    },
                    'footer@': {
                        template: ""
                    }
                }
            })
            .state('app.register', {
                url: 'register',
                views: {
                    // Absolutely targets the 'content' view in the 'app' state
                    'header@': {
                        template: ""
                    },
                    'content@': {
                        templateUrl: 'views/register.html',
                        controller: 'RegistrationCtrl'
                    },
                    'footer@': {
                        template: ""
                    }
                }
            })
            .state('app.forgotpassword', {
                url: 'forgotpassword',
                views: {
                    // Absolutely targets the 'content' view in the 'app' state
                    'header@': {
                        template: ""
                    },
                    'content@': {
                        templateUrl: 'views/forgotpassword.html',
                        controller: 'ForgotPasswordCtrl'
                    },
                    'footer@': {
                        template: ""
                    }
                }
            })
            .state('app.resetpassword', {
                url: 'resetpassword?authToken',
                views: {
                    // Absolutely targets the 'content' view in the 'app' state
                    'header@': {
                        template: ""
                    },
                    'content@': {
                        templateUrl: 'views/resetpassword.html',
                        controller: 'ResetPasswordCtrl'
                    },
                    'footer@': {
                        template: ""
                    }
                }
            })
            .state('app.search', {
                url: 'search',
                views: {
                    // Absolutely targets the 'content' view in the 'app' state
                    'content@': {
                        templateUrl: 'views/search.html',
                        controller: 'SearchCtrl'
                    }
                }
            })
            .state('app.series', {
                url: 'series/:seriesId',
                views: {
                    // Absolutely targets the 'content' view in the 'app' state
                    'content@': {
                        templateUrl: 'views/series.html',
                        controller: 'SeriesCtrl'
                    },
                    // Absolutely targets the 'fan_arts' view in the 'app.series' state
                    'fan_arts@app.series': {
                        templateUrl: 'views/poster.html'
                    },
                    'actors@app.series': {
                        templateUrl: 'views/actors.html'
                    }
                }
            })
            .state('app.episode', {
                url: 'series/:seriesId/episodes?season&year',
                views: {
                    // Absolutely targets the 'content' view in the 'app' state
                    'content@': {
                        templateUrl: 'views/episode.html',
                        controller: 'EpisodeCtrl'
                    }
                }
            })

            .state('app.user', {
                url: 'user/:id',
                views: {
                    // Absolutely targets the 'content' view in the 'app' state
                    'content@': {
                        templateUrl: 'views/user.html',
                        controller: 'UserCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');

    })
.run(function($rootScope, $location, $state, AuthFactory){
        if($location.search().user){
            AuthFactory.storeCredentials({username: $location.search().user, token: $location.search().token, _id: $location.search()._id});
            //$state.go('app', {param: value}, {notify: false});
            $state.go("app",{},{reload: "app"});
            $rootScope.currentUser = true;
            $rootScope.$broadcast('login:Successful');
        }

        Array.prototype.contains = function(v) {
            for(var i = 0; i < this.length; i++) {
                if(this[i] === v) return true;
            }
            return false;
        };

        Array.prototype.unique = function() {
            var arr = [];
            for(var i = 0; i < this.length; i++) {
                if(!arr.contains(this[i])) {
                    arr.push(this[i]);
                }
            }
            return arr;
        };
    });