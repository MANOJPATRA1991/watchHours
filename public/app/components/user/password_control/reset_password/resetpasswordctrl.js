angular.module('watchHoursApp')
.controller('ResetPasswordCtrl', ['$scope', '$location', '$rootScope', '$stateParams', '$localStorage', 'AuthFactory', function($scope, $location, $rootScope, $stateParams, $localStorage, AuthFactory){
        $scope.user = {};

        $scope.alerts = [];

        // User fields for reset password form
        $scope.userFields = [
            {
                key: 'password',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: 'Password',
                    placeholder: 'Enter new password',
                    required: true
                }
            },
            {
                key: 'repeat_password',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: 'Repeat Password',
                    placeholder: 'Re-enter new password',
                    required: true
                }
            }
        ];

        /**
         * Reset the user's password 
         */
        $scope.doReset = function() {
            if($scope.user.password === $scope.user.repeat_password){
                AuthFactory.resetPassword().update({authToken: $location.search().authToken}, {password: $scope.user.password}, function(message){
                    $scope.alerts = [
                        { type: 'success', msg: message.message }
                    ];
                });
            }else{
                $scope.alerts = [
                    { type: 'danger', msg: 'Passwords did not match.' }
                ];
            }
        };
    }]);
