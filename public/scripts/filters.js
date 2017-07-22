angular.module('watchHoursApp')
    .filter('fromNow', function() {
        return function(date) {
            return moment(date).fromNow();
        }
    })

    .filter('startFrom', function () {
        return function (input, start) {
            if (input) {
                start = +start;
                return input.slice(start);
            }
            return [];
        };
    });