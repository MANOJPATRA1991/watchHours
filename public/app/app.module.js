angular.module('watchHoursApp', ['ui.router', 'ngResource', 'ngRoute', 'ui.bootstrap', 'formly', 'formlyBootstrap']);

angular.module('watchHoursApp')
.run(function($rootScope, $location, $state, AuthFactory){
        if($location.search().user){
            AuthFactory.storeCredentials({username: $location.search().user, token: $location.search().token, _id: $location.search()._id});
            $state.go("app",{},{reload: "app"});
            $rootScope.currentUser = true;
            $rootScope.$broadcast('login:Successful');
        }

        $rootScope.$on('$routeChangeStart', function(next, current) { 
            $rootScope.isLoading = true;
        });

        $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
            $rootScope.back = from;
        });

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