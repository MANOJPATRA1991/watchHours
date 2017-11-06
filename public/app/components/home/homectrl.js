angular.module('watchHoursApp')
    .controller('HomeCtrl', ['$scope', 'Shows', 'Episodes', 'HomeServices', '$rootScope',
    function($scope, Shows, Episodes, HomeServices, $rootScope){
        $scope.todaysepisodes = [];
        $scope.tomorrowsepisodes = [];
        $scope.thisweeksepisodes = [];
        $scope.shows = [];

        $scope.alerts = [
            {
                type: 'danger',
                msg: 'Please verify your account to avoid deactivation.' }
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
                        }
                        // Filter episodes for tomorrow
                        if (HomeServices.isTomorrow(moment(episodes[i].firstAired))) {
                            $scope.tomorrowsepisodes.push(episodes[i]);
                        }
                        // Filter episodes for this week
                        if (HomeServices.isWithinAWeek(moment(episodes[i].firstAired))) {
                            $scope.thisweeksepisodes.push(episodes[i]);
                        }
                    }
                });
            }
            
            
            /**
             * Get show based on show id
             *
             * @param(Number) id - The show's id
             */
            $scope.showName = function(id){
                for( var i=0; i<$scope.shows.length; i++){
                    if($scope.shows[i]._id === id){
                        return $scope.shows[i];
                    }
                }
            };

            if($scope.shows.length >= 0) {
                $rootScope.isLoading = false;
            }
        });
        /**
         * Close alert box as mentioned by index
         *
         * @param(Number) index - The index of the alert to remove from alerts array
         */
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
    }]);