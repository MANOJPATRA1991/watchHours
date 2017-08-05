angular.module('watchHoursApp')
.controller('EpisodeCtrl', ['$scope', '$state', '$stateParams', '$rootScope', 'Series', 'Episodes', 'commentFactory', function($scope, $state, $stateParams, $rootScope, Series, Episodes, commentFactory){
        $scope.show = {};
        $scope.episodes = [];
        $scope.showEditForm = false;
        var sortBySeason = (function(a, b) {
            return parseFloat(a) - parseFloat(b);
        });

        // GET a show based on show id
        Series.query({ id: $stateParams.seriesId }, function(show) {
            $scope.show = show;

            /**
             * Change application state based on season number
             */
            $scope.changeStateSeason = function(season){
                $state.go('app.episode', {seriesId: show._id, season: season, year: null});
            };

            /**
             * Change application state based on year
             */
            $scope.changeStateYear = function(year){
                $state.go('app.episode', {seriesId: show._id, season: null, year: year});
            };
        });

        $scope.mycomment = {
            comment: ""
        };

        $scope.editcomment = {
            comment: ""
        }

        /**
         * Submit a comment on episode page of a show
         */
        $scope.submitComment = function (id) {

            commentFactory.save({id: id}, $scope.mycomment);

            $state.go($state.current, {}, {reload: true});

            $scope.commentForm.$setPristine();
        };

        /**
         * Edit a comment on episode page of a 
         * show if comment belongs to user
         */
        $scope.editComment = function(id, commentId) {
            commentFactory.update({id: id, commentId: commentId}, $scope.editcomment);
            
            $state.go($state.current, {}, {reload: true});
        };

        /**
         * Delete a comment on episode page of a 
         * show if comment belongs to user
         */
        $scope.deleteComment = function(id, commentId) {
            commentFactory.delete({id: id, commentId: commentId});
            
            $state.go($state.current, {}, {reload: true});
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
    }]);