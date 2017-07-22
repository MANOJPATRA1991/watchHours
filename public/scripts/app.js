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
            .state('app.login.otherSignIn', {
                views: {
                    // Absolutely targets the 'content' view in the 'app' state
                    'header@': {
                        template: ""
                    },
                    'content@': {
                        templateUrl: 'views/otherSignIn.html',
                        controller: 'LoginCtrl'
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
                    'content@app': {
                        templateUrl: 'views/user.html',
                        controller: 'UserCtrl'
                    },
                    // Absolutely targets the 'profile' view in the 'app.user' state
                    'profile@app.user': {
                        templateUrl: 'views/user_profile.html'
                    },
                    // Absolutely targets the 'subscription' view in the 'app.user' state
                    'subscription@app.user': {
                        templateUrl: 'views/subscription.html'
                    },
                    // Absolutely targets the 'watchlist' view in the 'app.user' state
                    'watchlist@app.user': {
                        templateUrl: 'views/watchlist.html'
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
    });