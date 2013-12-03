'use strict';

angular.module('ChitChat', []).run(function ($rootScope) {
	$rootScope.API_ENDPOINT = 'http://kubraum:7654';
});