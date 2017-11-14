angular.module('watchHoursApp')
.controller('HeaderCtrl', ['$scope', '$state', '$rootScope', 'Shows', '$http', '$location', '$localStorage', 'HomeServices', 'AuthFactory', function ($scope, $state, $rootScope, Shows, $http, $location, $localStorage, HomeServices, AuthFactory){
        $scope.search = {};
        $scope.shows = [];
        $rootScope.currentUser = false;
        $rootScope.username = '';
        $rootScope.admin = false;
        $rootScope.uid = '';
        $rootScope.isVerified = false;
        $scope.state = $state;
        Shows.query({}, function(resp) {
            // Sort shows by rating
            $scope.shows = resp.sort(HomeServices.compare);
        });
        /**
         * Reset the search filter
         */
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

        /**
         * Logs out the user from the session
         */
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

        /**
         * Checks if state is as specified by the parameter
         *
         * @param(string) curstate - The application's state name
         */
        $scope.stateis = function(curstate) {
            return $state.is(curstate);
        };
    }]);