angular.module('watchHoursApp')
.controller('UserCtrl', ['$scope', '$rootScope', 'Shows', 'HomeServices', function($scope, $rootScope, Shows, HomeServices){
        $scope.shows = [];
		$scope.myInterval = 5000;
		$scope.noWrapSlides = false;
		$scope.active = 0;
		$scope.chunkedData = [];

		// function chunk(arr, size) {
		//   var newArr = [];
		//   for (var i=0; i<arr.length; i+=size) {
		//     newArr.push(arr.slice(i, i+size));
		//   }
		//   return newArr;
		// }

        Shows.query({}, function(resp) {
            // Sort shows by rating
            $scope.shows = resp.sort(HomeServices.compare);
            // $scope.chunkedData = chunk($scope.shows, 2);
        });
    }]);