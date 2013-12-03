'use strict';

angular.module('ChitChat', []).run(function ($rootScope) {
	$rootScope.API_ENDPOINT = 'http://kubraum.pl:7654';
});