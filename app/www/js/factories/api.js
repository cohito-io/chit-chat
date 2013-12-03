'use strict';

angular.module('ChitChat').factory('ApiFactory', ['$http', function ($http) {
	return {
		listMessages: function() {
			return $http.get('/messages');
		}
	};
});