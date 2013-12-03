'use strict';

angular.module('ChitChat').controller('LoginController', function ($scope, $timeout, $http) {
	$scope.model = {};
	$scope.userId = null;
	$scope.token = null;

	$scope.login = function () {
		alert('login');

		chrome.identity.getAuthToken({
			oauth2: {
				client_id: '561011969837.apps.googleusercontent.com',
				scopes: [ 'https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/plus.login' ]
            },
        	interactive: true
 		}, function(token) {


 			alert(token);
 			var config = {headers:  {'Authorization': 'Bearer ' + token } };

 
 			$http.get("https://www.googleapis.com/oauth2/v2/userinfo?fields=email%2Cid&", config).
				success(function(data, status, headers, config) {
				   alert(data.email);
				   $scope.model.text = status + "\n" + JSON.stringify(data);
				   console.log(status + " " + JSON.stringify(data));
				   $scope.userId = data.id;
				}).
				error(function(data, status, headers, config) { 
					alert("error" + JSON.stringify(data));
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
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

