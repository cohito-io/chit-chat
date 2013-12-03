'use strict';

angular.module('ChitChat').controller('RecordingController', function ($scope, $timeout) {
	var tempFileName = 'message.amr';
	var mediaRecorder = null;

	$scope.stopRecording = function () {
		mediaRecorder.stopRecord();
	};

	$scope.startRecording = function () {
		mediaRecorder = new Media(tempFileName, uploadRecording, recordingError);
		mediaRecorder.startRecord();
	};

	function uploadRecording() {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFilesystem, onFilesystemError);

		function onFilesystem(fs) {
			console.log('FS obtained');

			fs.root.getFile(tempFileName, {create: false}, function (file) {
				console.log(file.name);
				console.log(file.fullPath);
				console.log(file.size);

				var options = new FileUploadOptions();
				options.fileKey = 'message';
				options.fileName = file.fullPath;
				options.mimeType = 'audio/amr';
				options.headers = {};
				options.headers['Authorization'] = 'Bearer 5';

				var ft = new FileTransfer();
				ft.upload(file.fullPath, 'http://kubraum.pl:7654/messages', function success() {
					console.log('Recording uploaded.');
				}, function error(err) {
					console.log('error', err);
				}, options);

			}, function (err) {
				console.log('Upload file err', err);
			});
		}

		function onFilesystemError() {
			console.log('fs error');
		}		
	};

	function recordingError() {
		console.log('error recording');
	}
});