angular.module('watchHoursApp')
.controller('UserCtrl', ['$scope', '$rootScope', 'Shows', 'HomeServices', function($scope, $rootScope, Shows, HomeServices){
        $scope.shows = [];
        $scope.entryLimit = 3; // items per page
        $scope.currentPage = 1;

        Shows.query({}, function(resp) {
            // Sort shows by rating
            $scope.shows = resp.sort(HomeServices.compare);
        });

    }]);