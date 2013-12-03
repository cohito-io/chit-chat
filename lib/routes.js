'use strict';
var formidable = require('formidable');

module.exports = function (app) {
	app.get('/messages', listMessages);
	app.post('/messages', postNewMessage);
};

function listMessages(req, res) {
	res.json({
		messages: [
			{audio: 'messages/abla.amr', google_id: '117508805618089538419', name: 'Kamil Leszczuk'},
			{audio: 'messages/sadasd.amr', google_id: '116018066779980863044', name: 'Some Random Guy'}
		]
	});
};

function postNewMessage(req, res) {
	var form = new formidable.IncomingForm();
	form.uploadDir = 'messages';

	form
		.on('file', function (field, file) {
			if ('message' === field) {
				console.log(file, file.path);
			}
		})
		.on('end', function () {
			res.send(200);
		});

	form.parse(req);
}