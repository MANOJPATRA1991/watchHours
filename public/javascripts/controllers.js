angular.module('watchHoursApp')

.controller('HomeController', ['$scope', '$log', 'Show', '$alert', '$state', function($scope, $log, Show, $alert, $state){
    $scope.shows = [];

    function compare(a, b) {
      // Use toUpperCase() to ignore character casing
      const ratingA = a.rating;
      const ratingB = b.rating;

      let comparison = 0;
      if (ratingA > ratingB) {
        comparison = 1;
      } else if (ratingA < ratingB) {
        comparison = -1;
      }
      return comparison* -1;
    }

    $scope.showToday = function(today){
      var now = moment();
      var toDay = moment(today);
      if(now.isSame(toDay, 'day')){
        console.log(now);
        console.log(toDay);
        return true;
      }
    };

    $scope.convertTo24Hour = function(show) {
          var hours = parseInt(show.airsTime.split(':')[0]);
          if(hours == 12) {
              return 0;
          }
          else if(hours < 12) {
              return hours + 12;
          }
          else{
            return hours;
          }
      };

    Show.query().$promise
    .then(function(resp){
      $scope.shows = resp;

      $scope.shows.sort(compare);

      $scope.currentPage = 1;
      $scope.totalItems = $scope.shows.length;
      $scope.entryLimit = 12; // items per page
      $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
    });

    $scope.myInerval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = $scope.shows[0];

    $scope.deleteShow = function(id) {
      Show.delete({id: id},
        function() {
          $alert({
            content: 'TV show has been deleted.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        },
        function(response) {
          $alert({
            content: 'Unable to perform delete!',
            placement: 'top-right',
            type: 'danger',
            duration: 3
          });
        });
    };

    $scope.updateShow = function(seriesName) {
      Show.update({showName: seriesName, poster: $scope.showPoster},
        function() {
          $scope.updateForm.$setPristine();
          $alert({
            content: 'TV show has been updated.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        },
        function(response) {
          $scope.updateForm.$setPristine();
          $alert({
            content: 'Show not updated!',
            placement: 'top-right',
            type: 'danger',
            duration: 3
          });
        });
    };

}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', '$http', '$location', '$localStorage', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, $http, $location, $localStorage, ngDialog, AuthFactory){
    $rootScope.currentUser = false;
    $rootScope.username = '';
    $rootScope.admin = false;
    $rootScope.uid = '';

    if($location.search().user){
      AuthFactory.storeCredentials({username: $location.search().user, token: $location.search().token, _id: $location.search()._id});
      $rootScope.$broadcast('login:Successful');
    }

    if(AuthFactory.isAuthenticated()) {
        $rootScope.currentUser = true;
        $rootScope.username = AuthFactory.getUsername();
        $rootScope.admin = AuthFactory.isAdmin();
        $rootScope.uid = AuthFactory.uid();
    }

    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-plain', controller:"LoginController" });
    };

    $scope.logout = function() {
        AuthFactory.logout();
        $rootScope.currentUser = false;
        $rootScope.username = '';
        $rootScope.admin = false;
        $rootScope.uid = '';
        $state.go("app");
    };

    $rootScope.$on('login:Successful', function () {
        $rootScope.currentUser = AuthFactory.isAuthenticated();
        $rootScope.username = AuthFactory.getUsername();
        $rootScope.admin = AuthFactory.isAdmin();
        $rootScope.uid = AuthFactory.uid();
    });

    $rootScope.$on('registration:Successful', function () {
        $rootScope.currentUser = AuthFactory.isAuthenticated();
        $rootScope.username = AuthFactory.getUsername();
        $rootScope.admin = AuthFactory.isAdmin();
        $rootScope.uid = AuthFactory.uid();
    });

    $scope.stateis = function(curstate) {
       return $state.is(curstate);
    };
}])

.controller('UserController', ['$scope', '$rootScope', 'Show', function($scope, $rootScope, Show){
  $scope.shows = Show.query();
}])

.controller('LoginController', ['$scope', '$state', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, $state, ngDialog, $localStorage, AuthFactory) {

    $scope.loginData = $localStorage.getObject('userinfo','{}');

    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo', $scope.loginData);
        AuthFactory.login($scope.loginData);
        ngDialog.close();
    };

    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-plain', controller:"RegisterController" });
    };
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$modal', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $modal, $localStorage, AuthFactory) {

    $scope.register={};
    $scope.loginData={};

    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);

        ngDialog.close();

    };
}])

.controller('ShowDetailController', ['$scope', '$state', '$alert', '$stateParams', '$rootScope', 'Subscription', 'Show', 'ngDialog', function($scope, $state, $alert, $stateParams, $rootScope, Subscription, Show, ngDialog){
    $scope.show = {};
    Show.get({ id: $stateParams.id }, function(show) {
        $scope.show = show;
        $scope.toSet = function(num){
          return ('0' + num).slice(-2);
        }

        $scope.nextEpisode = show.episodes.filter(function(episode) {
          return new Date(episode.firstAired) > new Date();
        })[0];

        $scope.isSubscribed = function(){
          return $scope.show.subscribers.indexOf($rootScope.uid) !== -1;
        };

        $scope.subscribe = function() {
          Subscription.subscribe(show, $rootScope.uid).then(function() {
            $scope.show.subscribers.push($rootScope.uid);
            $scope.isSubscribed();
          });
        };

        $scope.unsubscribe = function() {
          Subscription.unsubscribe(show, $rootScope.uid).then(function() {
            var index = $scope.show.subscribers.indexOf($rootScope.uid);
            $scope.show.subscribers.splice(index, 1);
            $scope.isSubscribed();
          });
        };

        $scope.range = function(){                
          var res = Math.max.apply(Math, $scope.show.episodes.map(function(o){return o.season;}));
          return new Array(+res);
        };
          
    });

    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-plain', controller:"LoginController" });
    };

    $scope.filterSeason = function(element){
      return (element.season !== 0 && element.episodeNumber !== 0);
    };

}])

.controller('SearchController', ['$scope', 'Show', 'filterFilter', function($scope, Show, filterFilter){

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

    function compare(a, b) {
      // Use toUpperCase() to ignore character casing
      const ratingA = a.rating;
      const ratingB = b.rating;

      let comparison = 0;
      if (ratingA > ratingB) {
        comparison = 1;
      } else if (ratingA < ratingB) {
        comparison = -1;
      }
      return comparison* -1;
    }

    $scope.headingTitle = 'All Shows';

    $scope.shows = [];

    $scope.showAll = function(){
      Show.query().$promise
      .then(function(resp){
        $scope.shows = resp;
        $scope.headingTitle = 'All Shows';
        $scope.shows.sort(compare);
        $scope.currentPage = 1;
        $scope.totalItems = $scope.shows.length;
        $scope.entryLimit = 12; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
        $scope.resetFilters();
      });
    }; 
    
    $scope.showAll();

    $scope.filterByGenre = function(genre) {
      $scope.shows = Show.query({ genre: genre }, function(resp){
        $scope.shows.sort(compare);
        $scope.headingTitle = genre;
        $scope.currentPage = 1;
        $scope.totalItems = $scope.shows.length;
        $scope.entryLimit = 12; // items per page
        $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
      });
    };

    $scope.filterByAlphabet = function(char) {
      $scope.shows = Show.query({ alphabet: char }, function(resp){
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
}])

.controller('AddShowController', ['$scope', 'Show', '$alert', function($scope, Show, $alert){
  $scope.addShow = function() {
      Show.save({ showName: $scope.showName },
        function() {
          $scope.showName = '';
          $scope.addForm.$setPristine();
          $alert({
            content: 'TV show has been added.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        },
        function(response) {
          $scope.showName = '';
          $scope.addForm.$setPristine();
          $alert({
            content: 'Show ended!',
            placement: 'top-right',
            type: 'danger',
            duration: 3
          });
        });
    };
}]);

