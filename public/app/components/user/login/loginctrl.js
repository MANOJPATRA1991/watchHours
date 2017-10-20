angular.module('watchHoursApp')
.controller('LoginCtrl', ['$scope', '$rootScope', '$state', '$location',
    '$localStorage', 'AuthFactory',
    function ($scope, $rootScope, $state, $location, $localStorage, AuthFactory) {

        $scope.user = {};
        $scope.alerts = [];

        // User fields for the login form
        $scope.userFields = [
            {
                key: 'username',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'User Name',
                    placeholder: 'Enter your user name',
                    required: true
                }
            },
            {
                key: 'password',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: 'Password',
                    placeholder: 'Enter your password',
                    required: true
                }
            },
            {
                key: 'remember_me',
                type: 'checkbox',
                templateOptions: {
                    label: "Remember Me"
                }
            }
        ];

        // try to get user info from local storage if available
        $scope.user = $localStorage.getObject('userinfo','{}');

        if($location.search()['err'] === '11000') {
            $scope.alerts = [(
                { type: 'danger', msg: "You have registered manually with the same email id. \
                                        You cannot re-register with facebook. \
                                        Please log in with username and password." }
            )];
        }

        /**
         * Perform Login for a user
         */
        $scope.doLogin = function() {
            if($scope.user.remember_me)
                $localStorage.storeObject('userinfo', $scope.user);
            AuthFactory.login($scope.user);
            $rootScope.$on('login:Successful', function(){
                $scope.alerts = [(
                    {
                        type: 'success',
                        msg: 'Log in successful. Redirecting to home page in 10 seconds...'
                    }
                )]
                $state.go("app");
            });
            $rootScope.$on('login:Unsuccessful', function(){
                $scope.alerts = [(
                    { type: 'danger', msg: "Invalid username or password. Check again." }
                )];
            });
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