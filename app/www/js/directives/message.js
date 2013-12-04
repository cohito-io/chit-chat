'use strict';

angular.module('ChitChat').directive('message', function () {

	return {
		template: '<div class="message"><google-avatar googleid="{{googleid}}"></google-avatar><div class="name">{{name}}</div><button ng-click="play()" class="play"></button></div>',
		restrict: 'A',
		replace: true,
		transclude: true,
		scope: {
			googleid: '=',
			name: '=',
			play: '&'
		}
	};
});
