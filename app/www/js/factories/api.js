'use strict';

angular.module('ChitChat').factory('ApiFactory', function ($http, $rootScope) {	
	var self = {
		messages: function() {
			return $http({
				method: 'GET',
				url: $rootScope.API_ENDPOINT + '/messages',
				headers: {
					'Authorization': 'Bearer ' + self.oauthToken
				}
			});
		},
		oauthToken: null
	};

	return self;
});