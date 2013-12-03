'use strict';

angular.module('ChitChat').factory('ApiFactory', function ($http, $rootScope) {
	return {
		messages: function() {
			return $http.get($rootScope.API_ENDPOINT + '/messages');
		}
	};
});