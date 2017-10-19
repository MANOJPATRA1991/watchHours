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
                if($scope.user.remember_me){
                    console.log('Doing registration', $scope.user);
                }
                AuthFactory.register($scope.user);
                $rootScope.$on('login:Successful', function(){
                    $state.go("app");
                });
            }else{
                $scope.alerts = [(
                    { type: 'danger', msg: "Passwords don't match" }
                )];
            }
            $rootScope.$on('login:Unsuccessful', function(){
                $scope.alerts = [(
                    { type: 'danger', msg: AuthFactory.Error() }
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