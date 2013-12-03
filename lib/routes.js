'use strict';
var formidable = require('formidable');

module.exports = function (app) {
	app.post('/messages', postNewMessage);	
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