'use strict';

angular.module('ChitChat').directive('message', function () {

	return {
		template: '<div class="message"><google-avatar googleid="{{googleid}}"></google-avatar><div class="name">{{name}}</div><button ng-click="play()" class="play"></button></div>',
		restrict: 'A',
		scope: {
			googleid: '=',
			name: '=',
			play: '&'
		}/*,
		compile: function ($element, attr) {
			return function(scope, element, attr) {
				console.log('a', scope.play);
				//scope.play = function () {alert('okay');};
			};
		}*/
	};
});
