'use strict';

angular.module('ChitChat').controller('RecordingController', function ($scope, $timeout) {
	$scope.recordMessage = function () {
		alert('ok');
		var src = 'message.amr';
		var mediaRec = new Media(src, onSuccess, onError);
		mediaRec.startRecord();

		$timeout(function () {
			mediaRec.stopRecord();
			alert('ok');
		}, 2000);

		function onSuccess() {
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fsOkay, fsError);
			console.log('Recorded');

			function fsOkay(fs) {
				console.log('fs okay');

				fs.root.getFile(src, {create: false}, function (file) {
					console.log(file.name);
					console.log(file.fullPath);
					console.log(file.size);

					var options = new FileUploadOptions();
					options.fileKey = 'message';
					options.fileName = file.fullPath;
					options.mimeType = 'audio/amr';

					var ft = new FileTransfer();
					ft.upload(file.fullPath, 'http://kubraum.pl/recording/index.php', function success() {
						console.log('uploaded');
					}, function error(err) {
						console.log('error', err);
					}, options);

				}, function (err) {
					console.log('err', err);
				});
			}

			function fsError() {
				console.log('fs error');
			}
		}

		function onError(err) {
			console.log('Error recording', err);
		}
	};
});