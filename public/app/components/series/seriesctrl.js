angular.module('watchHoursApp')
.controller('SeriesCtrl', ['$scope', '$sce', '$state', 
'$stateParams', '$rootScope', 'Series', 'Actors', 
'Episodes', 'Posters', 'PostersCount', 'ActorsCount', 'Subscription', 
function($scope, $sce, $state, $stateParams, $rootScope, Series, 
    Actors, Episodes, Posters, PostersCount, ActorsCount, Subscription){
        $scope.show = {};
        $scope.episodes = [];
        $scope.seasons = [];
        $scope.firstAired = [];
        $scope.posters = [];
        $scope.actors = [];
        $scope.isSubscribed = false;
        $scope.isInWatchlist = false;
        $scope.isInFavorites = false;
        $scope.currentPage = 1;
        $scope.entryLimit = 5; // items per page

        
        $scope.$on('$routeChangeStart', function(next, current) { 
            $rootScope.isLoading = true;
        });

        // Get Posters for the series
        $scope.getActors = function(x) {
            Actors.query({seriesId: $stateParams.seriesId, skip: x}, function(actors){
                $scope.actors = actors;
            });
        };
        
        // call on first load of series details page
        $scope.getActors(0);

        // Get count of posters
        ActorsCount.query({seriesId: $stateParams.seriesId}, function(count){
            $scope.totalItems = count.result;
        });


        // Get Posters for the series
        $scope.getPosters = function(x) {
            Posters.query({seriesId: $stateParams.seriesId, skip: x}, function(posters){
                $scope.posters = posters;
                console.log($scope.posters);
            });
        };
        
        // call on first load of series details page
        $scope.getPosters(0);

        // Get count of posters
        PostersCount.query({seriesId: $stateParams.seriesId}, function(count){
            $scope.totalItems = count.result;
        });

        // Get Series details
        Series.query({ id: $stateParams.seriesId }, function(show) {
            $scope.show = show;

            // check if user has marked a show as his favorite
            if($scope.show.favorites.indexOf($rootScope.uid) !== -1){
                $scope.isInFavorites = true;
            }

            // check if user has added a show to his watch list
            if($scope.show.watchList.indexOf($rootScope.uid) !== -1){
                $scope.isInWatchlist = true;
            }

            // check if user has subscribed to a show
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

            /**
             * Subscribe a user to a show
             */
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

            /**
             * Add a show to user's watch list
             */
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

            /**
             * Add a show to user's favorites
             */
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
        });
        

        // Get episodes for a show based on series id
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
                    if($scope.episodes[i].firstAired !== null){
                        let year = $scope.episodes[i].firstAired.toString().substr(0,4);
                        console.log(year);
                        temp.push(year);
                    }
                }
            }
            $scope.firstAired = temp.unique();
            temp = [];

            if($scope.episodes.length >= 0) {
                $rootScope.isLoading = false;
            }
        });
    }]);