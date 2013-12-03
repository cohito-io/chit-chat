'use strict';

angular.module('ChitChat').controller('RecordingController', function ($scope, $timeout, ApiFactory) {
	var tempFileName = 'message.amr';
	var mediaRecorder = null;

	$scope.model = {};
	$scope.model.messages = [];
	/*ApiFactory.messages().success(function (json) {
		$scope.model.messages = json.messages;
	});*/

	$scope.$watch(function () {
		return ApiFactory.isLoggedIn();
	}, function (oldValue, newValue) {
		console.log('okay');
		ApiFactory.messages()
			.success(function (json) {
				console.log('messages', json);
				$scope.model.messages = json.messages;
			})
			.error(function (data, status) {
				console.log('Error when fetching messages: ' + status);
			});
	});

	$scope.playMessage = function(url) {
		//var url2 = 'http://download.wavetlan.com/SVV/Media/HTTP/WAV/Media-Convert/Media-Convert_test2_PCM_Mono_VBR_8SS_48000Hz.wav';
		var mediaPlayer = new Media(url, onSuccess, onError);
		mediaPlayer.play();

		function onSuccess() {
			console.log(url + ' played successfully.');
		}

		function onError(err) {
			console.log(url + ' playback failed: ' + err);
		}
	};

	$scope.stopRecording = function() {
		mediaRecorder.stopRecord();
	};

	$scope.startRecording = function() {
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
				ft.upload(file.fullPath, $scope.API_ENDPOINT + '/messages', function success() {
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