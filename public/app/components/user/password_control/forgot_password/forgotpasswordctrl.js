angular.module('watchHoursApp')
.controller('ForgotPasswordCtrl', ['$scope', '$rootScope', '$localStorage', 'AuthFactory', function($scope, $rootScope, $localStorage, AuthFactory){
        $scope.user = {};

        $scope.alerts = [];

        // User fields for forgot password form
        $scope.userFields = [
            {
                key: 'email',
                type: 'input',
                templateOptions: {
                    type: 'email',
                    label: 'Enter your email address and we will send you a link to reset your password.',
                    placeholder: 'Enter your email address',
                    required: true
                }
            }
        ];

        /**
         * Send mail with reset password link to user's email
         */
        $scope.doSend = function(){
            AuthFactory.forgotPassword($scope.user);
            $rootScope.$on('email sent', function(){
                $scope.alerts = [
                    { type: 'success', msg: AuthFactory.Message() }
                ];
            });
            $rootScope.$on('email not sent', function(){
                $scope.alerts = [
                    { type: 'danger', msg: AuthFactory.Error() }
                ];
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