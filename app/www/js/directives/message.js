'use strict';

angular.module('ChitChat').directive('message', function ($parse) {
	return {
		template: '<div class="message"><div class="avatar"></div><div class="name"></div><div class="time"></div><div class="play"></div></div>',
		restrict: 'E',
		replace: true,
		transclude: true,
		compile: function ($element, attr) {
			return function(scope, element, attr) {
			};
		}
	};
});
