angular.module('watchHoursApp')
.config(function($stateProvider, $urlRouterProvider, $locationProvider){
        //$locationProvider.hashPrefix('');
        //$locationProvider.html5Mode(true);

        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: 'app/components/header/header.html',
                        controller: 'HeaderCtrl'
                    },
                    'content': {
                        templateUrl: 'app/components/home/home.html',
                        controller: 'HomeCtrl'
                    },
                    'footer': {
                        templateUrl: 'views/footer.html'
                    }
                }
            })
            .state('app.add', {
                url: 'add',
                views: {
                    'content@': {
                        templateUrl: 'app/components/add/add.html',
                        controller: 'AddCtrl'
                    }
                }
            })
            .state('app.showsToday', {
                views: {
                  'showday@app': {
                      templateUrl: 'app/components/home/showstoday.html',
                      controller: 'HomeCtrl'
                  }
                }
            })
            .state('app.showsThisWeek', {
                views: {
                    'showday@app': {
                        templateUrl: 'app/components/home/showsThisWeek.html',
                        controller: 'HomeCtrl'
                    }
                }
            })
            .state('app.showsTomorrow', {
                views: {
                    'showday@app': {
                        templateUrl: 'app/components/home/showsTomorrow.html',
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
                        templateUrl: 'app/components/user/login/login.html',
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
                        templateUrl: 'app/components/user/registration/register.html',
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
                        templateUrl: 'app/components/user/password_control/forgot_password/forgotpassword.html',
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
                        templateUrl: 'app/components/user/password_control/reset_password/resetpassword.html',
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
                        templateUrl: 'app/components/search/search.html',
                        controller: 'SearchCtrl'
                    }
                }
            })
            .state('app.series', {
                url: 'series/:seriesId',
                views: {
                    // Absolutely targets the 'content' view in the 'app' state
                    'content@': {
                        templateUrl: 'app/components/series/series.html',
                        controller: 'SeriesCtrl'
                    },
                    // Absolutely targets the 'fan_arts' view in the 'app.series' state
                    'fan_arts@app.series': {
                        templateUrl: 'app/components/series/poster.html'
                    },
                    'actors@app.series': {
                        templateUrl: 'app/components/series/actors.html'
                    }
                }
            })
            .state('app.episode', {
                url: 'series/:seriesId/episodes?season&year',
                views: {
                    // Absolutely targets the 'content' view in the 'app' state
                    'content@': {
                        templateUrl: 'app/components/episodes/episode.html',
                        controller: 'EpisodeCtrl'
                    }
                }
            })

            .state('app.user', {
                url: 'user/:id',
                views: {
                    // Absolutely targets the 'content' view in the 'app' state
                    'content@': {
                        templateUrl: 'app/components/user/user_manage/user.html',
                        controller: 'UserCtrl'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');

    });