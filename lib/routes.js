'use strict';
var cors = require('cors')
	, google = require('./google')
	, errors = require('./errors')
	, fs = require('fs')
	, path = require('path')
	, exec = require('child_process').exec
	, config = require('./config')
	;

module.exports = function (app, db) {
	var corsOptions = {origin: true};
	app.options('/public-messages', cors(corsOptions));
	app.options('/messages', cors(corsOptions));

	var messageHandler = new MessageHandler(db);
	app.get('/public-messages', [cors(corsOptions)], messageHandler.listAllMessages);
	app.get('/messages', [cors(corsOptions), auth], messageHandler.listMessages);
	app.post('/messages', [cors(corsOptions), auth], messageHandler.postNewMessage);

	errors(app);
};

function MessageHandler(db) {
	var messages = db.collection('messages');

	this.listAllMessages = function(req, res) {
		messages.find({}, {'sort': {'date': -1}}).toArray(function (err, items) {
			if (err) {
				return next(err);
			}

			res.json({'messages': items});
		});
	}

	this.listMessages = function(req, res) {
		google.getFriendsIdArray(req.google_token, function (err, friendsId) {
			if (err) {
				return next(err);
			}

			friendsId.push(req.google_user.id);

			var query = {'google_id': {'$in': friendsId}};
			var options = {'_id': 0, 'sort': {'date': -1} };
			messages.find(query, options).toArray(function (err, messages) {
				res.json({'messages': messages});
			});
		});
	};

	this.postNewMessage = function(req, res) {
		var source = req.files.message.path
			, destinationOriginal = config.UPLOAD_DIR + path.basename(source)
			, destinationTranscoded = config.UPLOAD_DIR + path.basename(source, path.extname(source)) + '.wav'
			;

		fs.rename(source, destinationOriginal, function (err) {
			if (err) {
				return next(err);
			}

			var message = {
				'audio': destinationTranscoded.replace('messages/', 'store/'), 
				'google_id': req.google_user.id,
				'name': req.google_user.name.givenName + " " + req.google_user.name.familyName,
				'date': Date.now()
			};

			messages.insert(message, function(err, inserted) {
				if (err) {
					return next(err);
				}

				res.json(inserted);
			});

			var command = 'ffmpeg -i ' + destinationOriginal + ' -ab 128 ' + destinationTranscoded;
			console.log('Executing: ' + command + ' for user ' + req.google_user.id);
			exec(command, function(error, stdout, stderr){ 
				console.log('Transcoded recording of ' + req.google_user.id);
			});
		});
	};
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

		// Invalid Google credentials
		if (user.error) {
			return next(user.error);
		}

		req.google_token = token;
		req.google_user = user;
		next();
	});
}
