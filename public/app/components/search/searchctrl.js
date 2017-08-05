angular.module('watchHoursApp')
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

        /**
         * Reset filters for search
         */
        $scope.resetFilters = function () {
            // needs to be a function or it won't trigger a $watch
            $scope.search = {};
        };

        $scope.headingTitle = 'All Shows';

        $scope.shows = [];

        /**
         * Shows all the shows
         */
        $scope.showAll = function(){
            Shows.query().$promise
            .then(function(resp){
                // Sorts the shows based on show rating
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

        /**
         * Filter shows by genre
         *
         * @param(string) genre - The genre to which the show belongs to
         */
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

        /**
         * Filter shows by alphabet
         *
         * @param(string) genre - The starting character of the show name
         */
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

        /**
         * Register a watch on the 'search' variable
         */
        $scope.$watch('search', function (newVal, oldVal) {
            $scope.filtered = filterFilter($scope.shows, newVal);
            $scope.totalItems = $scope.filtered.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
            $scope.currentPage = 1;
        }, true);
    }]);