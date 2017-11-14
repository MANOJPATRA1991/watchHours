angular.module('watchHoursApp')
.controller('SearchCtrl', ['$rootScope', '$scope', 'Shows', 'filterFilter', 'HomeServices', function($rootScope, $scope, Shows, filterFilter, HomeServices){

        $scope.alphabet = ['0-9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z'];

        $scope.genres = ['Action', 'Adventure', 'Animation', 'Children', 'Comedy',
            'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'Food',
            'Home and Garden', 'Horror', 'Mini-Series', 'Mystery', 'News', 'Reality',
            'Romance', 'Science-Fiction', 'Sport', 'Suspense', 'Talk Show', 'Thriller',
            'Travel'];

        $scope.search = {};
        $scope.shows = [];
        $scope.totalItems = 0;
        $scope.entryLimit = 12; // items per page
        $scope.currentPage = 1;

        $rootScope.back = '';

        /**
         * Reset filters for search
         */
        $scope.resetFilters = function () {
            // needs to be a function or it won't trigger a $watch
            $scope.search = {};
        };

        $scope.headingTitle = 'All Shows';
        var temp = [];
        $scope.shows = [];

        // get all shows
        Shows.query({}, function(resp){
            // Sorts the shows based on show rating
            temp = resp.sort(HomeServices.compare);
            $scope.shows = temp;
            $scope.headingTitle = 'All Shows';
            $scope.totalItems = temp.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
            $scope.resetFilters();
        });

        /**
         * Shows all the shows
         */
        $scope.showAll = function(){
            $scope.shows = temp;
            $scope.totalItems = $scope.shows.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
            $scope.resetFilters();
        };

        // Called to display all shows on displaying the search page
        $scope.showAll();

        /**
         * Filter shows by genre
         *
         * @param(string) genre - The genre to which the show belongs to
         */
        $scope.filterByGenre = function(genre) {
            $scope.shows = temp.filter(function(show){
                return show.genre.indexOf(genre) !== -1;
            });
            $scope.shows.sort(HomeServices.compare);
            $scope.headingTitle = genre;
            $scope.totalItems = $scope.shows.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
        };

        /**
         * Filter shows by alphabet
         *
         * @param(string) char - The starting character of the show name
         */
        $scope.filterByAlphabet = function(char) {
            $scope.shows = temp.filter(function(show){
                return show.seriesName.startsWith(char);
            });
            $scope.shows.sort(HomeServices.compare);
            $scope.headingTitle = char;
            $scope.totalItems = $scope.shows.length;
            $scope.noOfPages = Math.ceil($scope.totalItems / $scope.entryLimit);
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