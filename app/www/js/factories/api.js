'use strict';

angular.module('ChitChat').factory('ApiFactory', function ($http, $rootScope) {	
	var oauthToken = null;

	return {
		messages: function() {
			return $http({
				method: 'GET',
				url: $rootScope.API_ENDPOINT + '/public-messages',
				headers: {
					'Authorization': 'Bearer ' + oauthToken
				}
			});
		},

		isLoggedIn: function() {
			return oauthToken !== null;
		},

		logIn: function(token) {
			oauthToken = token;
		}
	};
});