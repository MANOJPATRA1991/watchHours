angular.module('watchHoursApp')
.controller('AddCtrl', ['$scope', '$rootScope', 'Shows', 'Episodes', 'Posters', 'Actors', function($scope, $rootScope, Shows, Episodes, Posters, Actors){

		/**
         * Add new shows
         *
         * @param(Number) id - The id of the show to add
         */
        $scope.addShow = function(id){
        	Shows.save({}, {IMDB: id},
	        	function(resp){
	        		$scope.add = true;
		        	$scope.alerts = [(
	                    { type: 'success', msg: "Show Added!" }
	                )];
		        },
		        function(err){
		        	$scope.alerts = [(
	                    { type: 'danger', msg: "Data already exists!" }
	                )];
		        }
	        );
        };

        $scope.addEpisodes = function(id){
        	Episodes.save({}, {IMDB: id},
	        	function(resp){
		        	$scope.alerts = [(
	                    { type: 'success', msg: "Episodes Added!" }
	                )];
		        },
		        function(err){
		        	$scope.alerts = [(
	                    { type: 'danger', msg: "Data already exists!" }
	                )];
		        }
	        );
        };

        $scope.addActors = function(id){
        	Actors.save({}, {IMDB: id},
	        	function(resp){
		        	$scope.alerts = [(
	                    { type: 'success', msg: "Actors Added!" }
	                )];
		        },
		        function(err){
		        	$scope.alerts = [(
	                    { type: 'danger', msg: "Data already exists!" }
	                )];
		        }
	        );
        };

        $scope.addPosters = function(id){
        	Posters.save({}, {IMDB: id},
	        	function(resp){
		        	$scope.alerts = [(
	                    { type: 'success', msg: "Posters Added!" }
	                )];
		        },
		        function(err){
		        	$scope.alerts = [(
	                    { type: 'danger', msg: "Data already exists!" }
	                )];
		        }
	        );
        };



        /**
         * Close alert box as mentioned by index
         *
         * @param(Number) index - The index of the alert to remove from alerts array
         */
        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };
    }]);