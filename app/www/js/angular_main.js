'use strict';

angular.module('ChitChat', ['ngTouch']).run(function ($rootScope) {
	$rootScope.API_ENDPOINT = 'http://kubraum.pl:7654';
});