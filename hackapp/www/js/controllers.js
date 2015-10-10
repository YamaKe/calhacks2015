angular.module('mainp.controllers', [])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};
 
    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            $state.go('main');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    };
})

.controller('FunctionsCtrl', function($scope) {
	$scope.functs = [
		{ name: 'F1'},
		{ name: 'F2'},
		{ name: 'F3'},
		{ name: 'F4'}
	];
});

// .controller('NavCtrl', function($scope, $ionicPopup, $timeout) {

//   $scope.go = function (path) {
//     $location.path(path);
//   };

// });