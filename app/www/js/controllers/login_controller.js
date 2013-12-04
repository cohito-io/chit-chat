'use strict';

angular.module('ChitChat').controller('LoginController', function ($scope, $timeout, $http, ApiFactory) {
	$scope.model = {};
	$scope.model.userId = null;
	$scope.model.email = null;

	$scope.isLoggedIn = function() {
		return ApiFactory.isLoggedIn();
	};

	$scope.login = function () {
		console.log('Authorization');

		chrome.identity.getAuthToken({
			oauth2: {
				client_id: '561011969837.apps.googleusercontent.com',
				scopes: [
					'https://www.googleapis.com/auth/userinfo.profile',
					'https://www.googleapis.com/auth/userinfo.email', 
					'https://www.googleapis.com/auth/plus.login' ]
            },
        	interactive: true
 		}, function(token) {
 			console.log('Received token: ' + token);
 			getUserInfo(token);
		});
	};

	function getUserInfo(token) {
		var API_ENDPOINT = 'https://www.googleapis.com/oauth2/v2/userinfo?fields=email%2Cid&';
		var config = {headers: {'Authorization': 'Bearer ' + token}};
		$http.get(API_ENDPOINT, config).
			success(function(data, status, headers, config) {
			   console.log('Email is ' + data.email);
			   console.log(status + " " + JSON.stringify(data));

			   $scope.model.userId = data.id;
			   $scope.model.email = data.email;

			   ApiFactory.logIn(token);
			}).
			error(function(data, status, headers, config) { 
				console.error('Could not login');
				console.error(data);
				alert('Login error');
			});
	}
});

