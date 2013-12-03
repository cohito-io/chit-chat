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

 			var config = {headers:  {'Authorization': 'Bearer ' + token } };
 			$http.get("https://www.googleapis.com/oauth2/v2/userinfo?fields=email%2Cid&", config).
				success(function(data, status, headers, config) {
				   console.log('Email is ' + data.email);
				   console.log(status + " " + JSON.stringify(data));

				   $scope.model.text = status + "\n" + JSON.stringify(data);
				   $scope.model.userId = data.id;
				   $scope.model.email = data.email;

				   ApiFactory.logIn(token);
				}).
				error(function(data, status, headers, config) { 
					alert("error" + JSON.stringify(data));
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
				    ApiFactory.logIn('invalid token');
				    $scope.model.email = 'invalid@email.com';
				});

			/*$http.get('https://www.googleapis.com/plus/v1/people/me/people/visible', config).
				success(function(data, status, headers, config) {
					$scope.model.text = JSON.stringify(data);
					var firend = data.items[2];
					alert(JSON.stringfy(firend));
				}).
				error(function(data, status, headers, config) { 
					alert("error" + JSON.stringify(data));
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
				});*/
		});
	};
});

