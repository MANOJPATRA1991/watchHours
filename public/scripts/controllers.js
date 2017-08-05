angular.module('watchHoursApp')
    .controller('HomeCtrl', ['$scope', 'Shows', 'Episodes', 'HomeServices', function($scope, Shows, Episodes, HomeServices){
        $scope.todaysepisodes = [];
        $scope.tomorrowsepisodes = [];
        $scope.thisweeksepisodes = [];
        $scope.shows = [];

        $scope.alerts = [
            { 
                type: 'danger', 
                msg: 'Please verify your account within 24 hours of registration in order to avoid deactivation.' }
        ];

        Shows.query({}, function(resp){
            // Sort shows by rating
            $scope.shows = resp.sort(HomeServices.compare);

            // Get episodes for each show
            for(var i=0; i<$scope.shows.length; i++){
                Episodes.query({seriesId: $scope.shows[i]._id}, function(episodes) {
                    for(var i = 0; i < episodes.length; i++){

                        // Filter episodes for today
                        if (HomeServices.isToday(moment(episodes[i].firstAired))) {
                            $scope.todaysepisodes.push(episodes[i]);
                        
                        // Filter episodes for tomorrow
                        } else if (HomeServices.isTomorrow(moment(episodes[i].firstAired))) {
                            $scope.tomorrowsepisodes.push(episodes[i]);
                        
                        // Filter episodes for this week
                        } else if (HomeServices.isWithinAWeek(moment(episodes[i].firstAired))) {
                            $scope.thisweeksepisodes.push(episodes[i]);
                        }
                    }
                });
            }

            $scope.showName = function(id){
                for( var i=0; i<$scope.shows.length; i++){
                    if($scope.shows[i]._id === id){
                        return $scope.shows[i];
                    }
                }
            };
        });
    }])

    .controller('HeaderCtrl', ['$scope', '$state', '$rootScope', 'Shows', '$http', '$location', '$localStorage', 'HomeServices', 'AuthFactory', function ($scope, $state, $rootScope, Shows, $http, $location, $localStorage, HomeServices, AuthFactory){
        $scope.search = {};
        $scope.shows = [];
        $rootScope.currentUser = false;
        $rootScope.username = '';
        $rootScope.admin = false;
        $rootScope.uid = '';
        $rootScope.isVerified = false;
        
        Shows.query({}, function(resp) {
            $scope.shows = resp.sort(HomeServices.compare);
        });

        // This function will reset the search filter
        $scope.resetFilters = function () {
            $scope.search = {};
        };

        // For login via facebook retrieve username, token and id from url
        if($location.search().user){
            AuthFactory.storeCredentials({username: $location.search().user,
                                          token: $location.search().token,
                                          _id: $location.search()._id,
                                          isVerified: $location.search().isVerified});
            $rootScope.$broadcast('login:Successful');
        }

        // Check if user is authenticated
        if(AuthFactory.isAuthenticated()) {
            $rootScope.currentUser = true;
            $rootScope.username = AuthFactory.getUsername();
            $rootScope.admin = AuthFactory.isAdmin();
            $rootScope.isVerified = AuthFactory.isVerified();
            $rootScope.uid = AuthFactory.uid();
        }

        // This function will logout a user and end session
        $scope.logout = function() {
            AuthFactory.logout();
            $rootScope.currentUser = false;
            $rootScope.username = '';
            $rootScope.admin = false;
            $rootScope.isVerified = false;
            $rootScope.uid = '';
            $state.go("app");
        };

        // On successful login
        $rootScope.$on('login:Successful', function () {
            $rootScope.currentUser = AuthFactory.isAuthenticated();
            $rootScope.username = AuthFactory.getUsername();
            $rootScope.admin = AuthFactory.isAdmin();
            $rootScope.uid = AuthFactory.uid();
            $rootScope.isVerified = AuthFactory.isVerified();
        });

        // On successful registration
        $rootScope.$on('registration:Successful', function () {
            $rootScope.currentUser = AuthFactory.isAuthenticated();
            $rootScope.username = AuthFactory.getUsername();
            $rootScope.admin = AuthFactory.isAdmin();
            $rootScope.uid = AuthFactory.uid();
            $rootScope.isVerified = AuthFactory.isVerified();
        });

        $scope.stateis = function(curstate) {
            return $state.is(curstate);
        };
    }])

    .controller('UserCtrl', ['$scope', '$rootScope', 'Shows', 'HomeServices', function($scope, $rootScope, Shows, HomeServices){
        $scope.shows = [];
        Shows.query({}, function(resp) {
            $scope.shows = resp.sort(HomeServices.compare);
        });
    }])

    .controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$localStorage', 'AuthFactory', function ($scope, $rootScope, $state, $localStorage, AuthFactory) {

        $scope.user = {};
        $scope.alerts = [];

        // User fields for the login form
        $scope.userFields = [
            {
                key: 'username',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'User Name',
                    placeholder: 'Enter your user name',
                    required: true
                }
            },
            {
                key: 'password',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: 'Password',
                    placeholder: 'Enter your password',
                    required: true
                }
            },
            {
                key: 'remember_me',
                type: 'checkbox',
                templateOptions: {
                    label: "Remember Me"
                }
            }
        ];
        
        $scope.user = $localStorage.getObject('userinfo','{}');
        
        // This function will perform log in for the user
        $scope.doLogin = function() {
            if($scope.user.remember_me)
                $localStorage.storeObject('userinfo', $scope.user);
            AuthFactory.login($scope.user);
            $rootScope.$on('login:Successful', function(){
                $state.go("app");
            });
            $rootScope.$on('login:Unsuccessful', function(){
                $scope.alerts = [(
                    { type: 'danger', msg: AuthFactory.Error() }
                )];
            });
        };

        // This function is for closing the alert boxes
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
    }])

    .controller('RegistrationCtrl', ['$scope', '$state', '$localStorage', 'AuthFactory', function ($scope, $state, $localStorage, AuthFactory) {

        $scope.user = {};

        // User fields for the registration form
        $scope.userFields = [
            {
                key: 'username',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'User Name',
                    placeholder: 'Enter your user name',
                    required: true
                }
            },
            {
                key: 'email',
                type: 'input',
                templateOptions: {
                    type: 'email',
                    label: 'Email',
                    placeholder: 'Enter your email address',
                    required: true
                }
            },
            {
                key: 'firstname',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'First Name',
                    placeholder: 'Enter your first name',
                    required: true
                }
            },
            {
                key: 'lastname',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'Last Name',
                    placeholder: 'Enter your last name',
                    required: true
                }
            },
            {
                key: 'password',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: 'Password',
                    placeholder: 'Enter your password',
                    required: true
                }
            },
            {
                key: 'repeat_password',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: 'Password',
                    placeholder: 'Re-enter your password',
                    required: true
                }
            },
            {
                key: 'remember_me',
                type: 'checkbox',
                templateOptions: {
                    label: "Remember Me"
                }
            }
        ];

        // This function will perform registration for the user
        $scope.doRegister = function() {
            if($scope.user.password === $scope.user.repeat_password){
                if($scope.user.remember_me){
                    console.log('Doing registration', $scope.user);
                }
                AuthFactory.register($scope.user);
            }else{
                $scope.alerts = [(
                    { type: 'danger', msg: "Passwords don't match" }
                )];
            }
            $rootScope.$on('login:Successful', function(){
                $state.go("app");
            });
            $rootScope.$on('login:Unsuccessful', function(){
                $scope.alerts = [(
                    { type: 'danger', msg: AuthFactory.Error() }
                )];
            });
        };
    }])


    .controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$localStorage', 'AuthFactory', function($scope, $rootScope, $localStorage, AuthFactory){
        $scope.user = {};

        $scope.alerts = [];

        // User fields for forgot password form
        $scope.userFields = [
            {
                key: 'email',
                type: 'input',
                templateOptions: {
                    type: 'email',
                    label: 'Enter your email address and we will send you a link to reset your password.',
                    placeholder: 'Enter your email address',
                    required: true
                }
            }
        ];

        // This function will send a link to reset password to the user's email
        $scope.doSend = function(){
            AuthFactory.forgotPassword($scope.user);
            $rootScope.$on('email sent', function(){
                $scope.alerts = [
                    { type: 'success', msg: AuthFactory.Message() }
                ];
            });
            $rootScope.$on('email not sent', function(){
                $scope.alerts = [
                    { type: 'danger', msg: AuthFactory.Error() }
                ];
            });
        };
    }])

    .controller('ResetPasswordCtrl', ['$scope', '$location', '$rootScope', '$stateParams', '$localStorage', 'AuthFactory', function($scope, $location, $rootScope, $stateParams, $localStorage, AuthFactory){
        $scope.user = {};

        $scope.alerts = [];

        // User fields for reset password form
        $scope.userFields = [
            {
                key: 'password',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: 'Password',
                    placeholder: 'Enter new password',
                    required: true
                }
            },
            {
                key: 'repeat_password',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: 'Repeat Password',
                    placeholder: 'Re-enter new password',
                    required: true
                }
            }
        ];

        // This function will reset password for the user
        $scope.doReset = function() {
            if($scope.user.password === $scope.user.repeat_password){
                AuthFactory.resetPassword().update({authToken: $location.search().authToken}, {password: $scope.user.password}, function(message){
                    $scope.alerts = [
                        { type: 'success', msg: message.message }
                    ];
                });
            }else{
                $scope.alerts = [
                    { type: 'danger', msg: 'Passwords did not match.' }
                ];
            }
        };
    }])

    .controller('SeriesCtrl', ['$scope', '$sce', '$state', '$stateParams', '$rootScope', 'Series', 'Actors', 'Episodes', 'Posters', 'Subscription', function($scope, $sce, $state, $stateParams, $rootScope, Series, Actors, Episodes, Posters, Subscription){
        $scope.show = {};
        $scope.episodes = [];
        $scope.seasons = [];
        $scope.firstAired = [];
        $scope.posters = [];
        $scope.actors = [];
        $scope.isSubscribed = false;
        $scope.isInWatchlist = false;
        $scope.isInFavorites = false;

        // Get Actors for the series
        Actors.query({seriesId: $stateParams.seriesId}, function(actors){
            $scope.actors = actors;
        });

        // Get Posters for the series
        Posters.query({seriesId: $stateParams.seriesId}, function(posters){
            $scope.posters = posters;
            $scope.currentPage = 1;
            $scope.totalItems = $scope.posters.length;
            $scope.entryLimit = 14; // items per page
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
        });

        // Get Series details
        Series.query({ id: $stateParams.seriesId }, function(show) {
            $scope.show = show;

            if($scope.show.favorites.indexOf($rootScope.uid) !== -1){
                $scope.isInFavorites = true;
            }
            if($scope.show.watchList.indexOf($rootScope.uid) !== -1){
                $scope.isInWatchlist = true;
            }

            if($scope.show.subscribers.indexOf($rootScope.uid) !== -1){
                $scope.isSubscribed = true;
            }

            if($rootScope.currentUser) {
                if($scope.isInFavorites){
                    $scope.heart = $sce.trustAsHtml('Added to Favorites');
                }else{
                    $scope.heart = $sce.trustAsHtml('Add to Favorites');
                }
                if($scope.isInWatchlist){
                    $scope.bookmark = $sce.trustAsHtml('Added to Watch List');
                }else{
                    $scope.bookmark = $sce.trustAsHtml('Add to Watch List');
                }
                if($scope.isSubscribed){
                    $scope.star = $sce.trustAsHtml('Subscribed');
                }else{
                    $scope.star = $sce.trustAsHtml('Subscribe');
                }
            }else{
                $scope.heart = $sce.trustAsHtml('Log in to add to Favorites');
                $scope.bookmark = $sce.trustAsHtml('Log in to add to Watch List');
                $scope.star = $sce.trustAsHtml('Log in to Subscribe');
            }

            // This function will subscribe a user if not already subscribed
            $scope.subscribe = function() {
                if($scope.isSubscribed){
                    Subscription.subscriptions(show, $rootScope.uid).then(function(resp) {
                        if(resp.data === true){
                            $scope.isSubscribed = false;
                        }
                    });
                }else{
                    Subscription.subscriptions(show, $rootScope.uid).then(function(resp) {
                        if(resp.data === true){
                            $scope.isSubscribed = true;
                        }
                    });
                }
                $state.go("app.series",{},{reload: "app.series"});
            };

            // This function will add a series to user's watchlist if not already added
            $scope.addToWatchlist = function() {
                if($scope.isInWatchlist){
                    Subscription.watchlist(show, $rootScope.uid).then(function(resp) {
                        if(resp.data === true){
                            $scope.isInWatchlist = false;
                        }
                    });
                }else{
                    Subscription.watchlist(show, $rootScope.uid).then(function(resp) {
                        if(resp.data === true){
                            $scope.isInWatchlist = true;
                        }
                    });
                }
                $state.go("app.series",{},{reload: "app.series"});
            };

            // This function will add a series to user's favorites if not already added
            $scope.addToFavorites = function() {
                if($scope.isInFavorites){
                    Subscription.favorites(show, $rootScope.uid).then(function(resp) {
                        if(resp.data === true){
                            $scope.isInFavorites = false;
                        }
                    });
                }else{
                    Subscription.favorites(show, $rootScope.uid).then(function(resp) {
                        if(resp.data === true){
                            $scope.isInFavorites = true;
                        }
                    });
                }
                $state.go("app.series",{},{reload: "app.series"});
            };

            $scope.range = function(){
                var res = Math.max.apply(Math, $scope.show.episodes.map(function(o){return o.season;}));
                return new Array(+res);
            };
        });

        Episodes.query({seriesId: $stateParams.seriesId}, function(episodes){
            $scope.episodes = episodes;
            var temp = [];
            for(let i = 0; i < $scope.episodes.length; i++){
                if($scope.episodes[i].airedSeason !== 0){
                    temp.push($scope.episodes[i].airedSeason);
                }
            }
            $scope.seasons = temp.unique();
            temp = [];
            for(let i = 0; i < $scope.episodes.length; i++){
                if($scope.episodes[i].airedSeason !== 0){
                    temp.push($scope.episodes[i].firstAired.substr(0,4));
                }
            }
            $scope.firstAired = temp.unique();
            temp = [];
        });
    }])

    .controller('EpisodeCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'Series', 'Episodes', 'commentFactory', function($scope, $state, $stateParams, $rootScope, Series, Episodes, commentFactory){
        $scope.show = {};
        $scope.episodes = [];
        var sortBySeason = (function(a, b) {
            return parseFloat(a) - parseFloat(b);
        });

        Series.query({ id: $stateParams.seriesId }, function(show) {
            $scope.show = show;

            $scope.changeStateSeason = function(season){
                $state.go('app.episode', {seriesId: show._id, season: season, year: null});
            };

            $scope.changeStateYear = function(year){
                $state.go('app.episode', {seriesId: show._id, season: null, year: year});
            };
        });

        $scope.mycomment = {
            comment: ""
        };

        $scope.submitComment = function (id) {

            commentFactory.save({id: id}, $scope.mycomment);

            $state.go($state.current, {}, {reload: true});

            $scope.commentForm.$setPristine();
        };

        Episodes.query({seriesId: $stateParams.seriesId}, function(episodes){
            if($stateParams.season){
                for(let i = 0; i < episodes.length; i++){
                    if(episodes[i].airedSeason !== 0 &&
                        episodes[i].airedSeason == $stateParams.season){
                        $scope.episodes.push(episodes[i]);
                    }
                }
            }else if($stateParams.year){
                for(let i = 0; i < episodes.length; i++){
                    if(episodes[i].airedSeason !== 0 &&
                        episodes[i].firstAired.substr(0,4) == $stateParams.year){
                        $scope.episodes.push(episodes[i]);
                    }
                }
            }

            $scope.totalItems = $scope.episodes.length;
            $scope.currentPage = 1;
            $scope.itemsPerPage = 1;

            var temp = [];
            for(let i = 0; i < episodes.length; i++){
                if(episodes[i].airedSeason !== 0){
                    temp.push(episodes[i].airedSeason);
                }
            }
            $scope.seasons = temp.unique();
            temp = [];
            for(let i = 0; i < episodes.length; i++){
                if(episodes[i].airedSeason !== 0){
                    temp.push(episodes[i].firstAired.substr(0,4));
                }
            }
            $scope.firstAired = temp.unique();
            temp = [];
        });
    }])

    .controller('SearchCtrl', ['$scope', 'Shows', 'filterFilter', 'HomeServices', function($scope, Shows, filterFilter, HomeServices){

        $scope.alphabet = ['0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z'];

        $scope.genres = ['Action', 'Adventure', 'Animation', 'Children', 'Comedy',
            'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Food',
            'Home and Garden', 'Horror', 'Mini-Series', 'Mystery', 'News', 'Reality',
            'Romance', 'Science-Fiction', 'Sport', 'Suspense', 'Talk Show', 'Thriller',
            'Travel'];

        $scope.search = {};

        $scope.resetFilters = function () {
            // needs to be a function or it won't trigger a $watch
            $scope.search = {};
        };

        $scope.headingTitle = 'All Shows';

        $scope.shows = [];

        $scope.showAll = function(){
            Shows.query().$promise
            .then(function(resp){
                $scope.shows = resp.sort(HomeServices.compare);
                $scope.headingTitle = 'All Shows';
                $scope.currentPage = 1;
                $scope.totalItems = $scope.shows.length;
                $scope.entryLimit = 12; // items per page
                $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
                $scope.resetFilters();
            });
        };

        // Called to display all shows on displaying the search page
        $scope.showAll();

        $scope.filterByGenre = function(genre) {
            Shows.query({}, function(resp){
                $scope.shows = [];
                for(var i=0; i< resp.length; i++){
                    if(resp[i].genre.indexOf(genre) !== -1){
                        $scope.shows.push(resp[i]);
                    }
                }
                $scope.shows.sort(HomeServices.compare);
                $scope.headingTitle = genre;
                $scope.currentPage = 1;
                $scope.totalItems = $scope.shows.length;
                $scope.entryLimit = 12; // items per page
                $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
            });
        };

        $scope.filterByAlphabet = function(char) {
            $scope.shows = [];
            Shows.query({}, function(resp){
                for(var i=0; i< resp.length; i++){
                    if(resp[i].seriesName.startsWith(char)){
                        $scope.shows.push(resp[i]);
                    }
                }
                $scope.shows.sort(compare);
                $scope.headingTitle = char;
                $scope.currentPage = 1;
                $scope.totalItems = $scope.shows.length;
                $scope.entryLimit = 12; // items per page
                $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
            });
        };

        $scope.$watch('search', function (newVal, oldVal) {
            $scope.filtered = filterFilter($scope.shows, newVal);
            $scope.totalItems = $scope.filtered.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
            $scope.currentPage = 1;
        }, true);
    }]);