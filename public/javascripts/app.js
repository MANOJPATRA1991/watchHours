angular.module('watchHoursApp', ['ui.router', 'ui.bootstrap', 'ngResource', 'ngCookies', 'ngMessages', 'ngDialog', 'mgcrea.ngStrap'])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $stateProvider        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
        
            // route for the show page
            .state('app.search', {
                url: 'search',
                views: {
                    'content@': {
                        templateUrl : 'views/search.html',
                        controller  : 'SearchController'
                    }
                }
            })

            // route for the showdetails page
            .state('app.showDetails', {
                url: 'shows/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/showdetail.html',
                        controller  : 'ShowDetailController'
                   }
                }
            })
        
            // route for the subscriptions page
            .state('app.subscriptions', {
                url: 'subscriptions',
                views: {
                    'content@': {
                        templateUrl : 'views/subscriptions.html',
                        controller  : 'SubscriptionController'
                   }
                }
            })

            .state('app.add', {
                url: 'add',
                views: {
                    'content@': {
                        templateUrl : 'views/add.html',
                        controller  : 'AddShowController'
                   }
                }
            })

            .state('app.user', {
                url: 'user',
                views: {
                    'content@': {
                        templateUrl : 'views/user.html',
                        controller : 'UserController'
                    }
                }
            })

    
        $urlRouterProvider.otherwise('/');
    }]);