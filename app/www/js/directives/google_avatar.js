'use strict';

angular.module('ChitChat').directive('googleAvatar', function ($http, $compile, $parse) {
	var avatar_url = function (google_id, size) {
		return 'https://plus.google.com/s2/photos/profile/' + google_id + '?sz=' + size;
	};

	return {
		restrict: 'E',
		transclude: false,
		replace: false,
		template: '<img src="{{avatar_url}}"/>',
		scope: {},
		compile: function (element, attrs, transclude) {
			return function (scope, element, attrs) {
				scope.avatar_url = avatar_url(attrs.googleid, 150);
			};
		}
	};
});