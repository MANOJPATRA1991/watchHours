angular.module('watchHoursApp')
.controller('RegistrationCtrl', ['$scope', '$state', '$localStorage',
    'AuthFactory', '$rootScope',
    function ($scope, $state, $localStorage, AuthFactory, $rootScope) {

        $scope.user = {};
        $scope.alerts = [];

        // User fields for the registration form
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
                key: 'email',
                type: 'input',
                templateOptions: {
                    type: 'email',
                    label: 'Email',
                    placeholder: 'Enter your email address',
                    required: true
                }
            },
            {
                key: 'firstname',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'First Name',
                    placeholder: 'Enter your first name',
                    required: true
                }
            },
            {
                key: 'lastname',
                type: 'input',
                templateOptions: {
                    type: 'text',
                    label: 'Last Name',
                    placeholder: 'Enter your last name',
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
                key: 'repeat_password',
                type: 'input',
                templateOptions: {
                    type: 'password',
                    label: 'Password',
                    placeholder: 'Re-enter your password',
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

        /**
         * Performs registration for a user
         */
        $scope.doRegister = function() {
            // check for password match before registering a user
            if($scope.user.password === $scope.user.repeat_password){
                AuthFactory.register($scope.user);
            }else{
                $scope.alerts = [(
                    { type: 'danger', msg: "Passwords don't match" }
                )];
            }
            $rootScope.$on('registration:Successful', function(){
                $scope.alerts = [(
                    { type: 'success', msg: "You have registered successfully. Redirecting to login page."}
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