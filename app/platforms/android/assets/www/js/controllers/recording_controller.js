'use strict';

angular.module('ChitChat').controller('RecordingController', function ($scope, $timeout) {
	$scope.recordMessage = function () {
		var src = 'message.amr';
		var mediaRec = new Media(src, onSuccess, onError);
		mediaRec.startRecord();

		$timeout(function () {
			mediaRec.stopRecord();
			alert('ok');
		}, 2000);
	};
});