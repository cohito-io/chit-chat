'use strict';
var //formidable = require('formidable')
	cors = require('cors')
	, google = require('./google')
	, errors = require('./errors')
	, fs = require('fs')
	, path = require('path')
	;

module.exports = function (app) {
	var corsOptions = {origin: true};
	app.options('/messages', cors(corsOptions));

	app.get('/messages', [cors(corsOptions), auth], listMessages);
	app.post('/messages', [cors(corsOptions), auth], postNewMessage);

	errors(app);
};

function listMessages(req, res) {
	console.log('google user', req.google_user.id);

	// TODO: Odczytac liste znajomych usera i liste nagran zbazy i zwrocic czesc wspolna
	// req.google_token -> token
	// req.google_user -> user

	res.json({
		messages: [
			{audio: 'messages/abla.amr', google_id: '117508805618089538419', name: 'Kamil Leszczuk'},
			{audio: 'messages/sadasd.amr', google_id: '116018066779980863044', name: 'Some Random Guy'}
		]
	});
};

function postNewMessage(req, res) {
	var upload_path = 'messages/' + path.basename(req.files.message.path)
	fs.rename(req.files.message.path, upload_path, function (err) {
		if (err) {
			return next(err);
		}

		// TODO: zapisac w bazie.
		// - req.google_user.id - ID usera
		// - upload - tu znajduje sie plik

		res.send(200);
	});
}

function auth(req, res, next) {
	var token = req.headers['authorization'];
	if (!token) {
		return next({status: 401, message: 'Token required'});
	}

	token = token.replace(/Bearer /, '');

	google.getUserInfo(token, function (err, user) {
		if (err) {
			return next(err);
		}

		// Invalid credentials
		if (user.error) {
			return next(user.error);
		}

		req.google_token = token;
		req.google_user = user;
		next();
	});
}
