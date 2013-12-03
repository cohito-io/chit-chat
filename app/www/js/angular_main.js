'use strict';

angular.module('ChitChat', ['ngTouch']).run(function ($rootScope) {
	//$rootScope.API_ENDPOINT = 'http://kubraum.pl:7654';
	$rootScope.API_ENDPOINT = 'http://localhost:7654';

	if (!window.device) {
		console.log('Initializing mock global objects');
		initMockGlobalObjects();
	}

	function initMockGlobalObjects() {
		window.chrome = {
			identity: {
				getAuthToken: function (options, callback) {
					callback('invalid token');
				}
			}
		};
	}
});