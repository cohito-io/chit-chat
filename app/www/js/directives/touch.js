'use strict';

angular.module('ChitChat').directive('fingerdown', function ($parse) {
	return {
		compile: function ($element, attr) {
			var fn_fingerdown = $parse(attr['fingerdown']);

			return function(scope, element, attr) {
				element.on('touchstart', fingerdown);
				element.on('mousedown', fingerdown);

				function fingerdown(evt) {
					element.addClass('pressed');
					scope.$apply(function () {
						fn_fingerdown(scope, {$event: evt});
					});
				}
			};
		}
	};
});

angular.module('ChitChat').directive('fingerup', function ($parse) {
	return {
		compile: function ($element, attr) {
			var fn_fingerup = $parse(attr['fingerup']);

			return function(scope, element, attr) {
				element.on('touchend', fingerup);
				element.on('mouseup', fingerup);

				function fingerup(evt) {
					element.removeClass('pressed');
					scope.$apply(function () {
						fn_fingerup(scope, {$event: evt});
					});
				}
			};
		}
	};
});