'use strict';

angular.module('ChitChat').controller('RecordingController', function ($scope, $timeout, ApiFactory) {
	var tempFileName = 'message.amr';
	var mediaRecorder = null;

	$scope.model = {};
	$scope.model.messages = [];

	// Refresh messages list upon login.
	$scope.$watch(function () {
		return ApiFactory.isLoggedIn();
	}, function (oldValue, newValue) {
		refreshMessages();
	});

	function refreshMessages() {
		ApiFactory.messages()
			.success(function (json) {
				console.log('messages', json);
				$scope.model.messages = json.messages;
			})
			.error(function (data, status) {
				console.log('Error when fetching messages: ' + status);
			});		
	}

	$scope.playMessage = function(url) {
		var mediaUrl = $scope.API_ENDPOINT + '/' + url;
		console.log('Attempting to play: ' + mediaUrl);

		var mediaPlayer = new Media(mediaUrl, onSuccess, onError);
		mediaPlayer.play();

		function onSuccess() {
			console.log(url + ' played successfully.');
		}

		function onError(err) {
			console.error(err);
			alert('Could not play this message');
		}
	};

	$scope.startRecording = function() {
		mediaRecorder = new Media(tempFileName, uploadRecording, recordingError);
		mediaRecorder.startRecord();
	};

	$scope.stopRecording = function() {
		mediaRecorder.stopRecord();
	};

	function uploadRecording() {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFilesystem, onFilesystemError);

		function onFilesystem(fs) {
			fs.root.getFile(tempFileName, {create: false}, function (file) {
				console.log('New message: ' + file.fullPath);

				var options = new FileUploadOptions();
				options.fileKey = 'message';
				options.fileName = file.fullPath;
				options.mimeType = 'audio/amr';
				options.headers = {};
				options.headers['Authorization'] = 'Bearer ' + ApiFactory.getToken();

				var ft = new FileTransfer();
				ft.upload(file.fullPath, $scope.API_ENDPOINT + '/messages', function success() {
					console.log('New message uploaded.');
					refreshMessages();
				}, function error(err) {
					console.error(err);
					alert('Could not upload message.');
				}, options);

			}, function (err) {
				console.error(err);
				alert('Could not upload message.');
			});
		}

		function onFilesystemError() {
			console.error(err);
			alert('Could not upload message.');
		}		
	};

	function recordingError() {
		console.error(err);
		alert('Could not record message.');
	}
});