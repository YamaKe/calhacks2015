// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('mainp', ['ionic', 'mainp.controllers', 'mainp.services'])


.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
	.state('login', {
    	url: '/login',
    	templateUrl: 'templates/login.html',
    	controller: 'LoginCtrl'
  	})
	.state('register', {
    	url: '/register',
    	templateUrl: 'templates/register.html',
    	
  	})


  	.state('main', {
    	url: '/main',
        templateUrl: 'index.html'

  	})

 	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/login');
});

// .run(function($ionicPlatform) {
//   $ionicPlatform.ready(function() {
//     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//     // for form inputs)
//     if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
//       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//       cordova.plugins.Keyboard.disableScroll(true);

//     }
//     if (window.StatusBar) {
//       // org.apache.cordova.statusbar required
//       StatusBar.styleLightContent();
//     }
//   });
// })

