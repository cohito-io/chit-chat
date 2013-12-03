'use strict';
var //formidable = require('formidable')
	cors = require('cors')
	, google = require('./google')
	, errors = require('./errors')
	, fs = require('fs')
	, path = require('path')
	;

module.exports = function (app, db) {
	var corsOptions = {origin: true};
	app.options('/messages', cors(corsOptions));

	var messageHandler = new MessageHandler(db);
	app.get('/public-messages', [cors(corsOptions)], messageHandler.listAllMessages);
	app.get('/messages', [cors(corsOptions), auth], messageHandler.listMessages);
	app.post('/messages', [cors(corsOptions), auth], messageHandler.postNewMessage);

	errors(app);
};


function MessageHandler(db) {

	this.listAllMessages = function(req, res) {
		db.collection('messages').find({},{"sort":{"date":-1}}).toArray(function(err, items) {
			if(err) {
				return next(err);
			}

			res.json({ 'messages': items});
		});
	}

	this.listMessages = function(req, res) {
		console.log('google user', req.google_user.id);

		google.getFriendsIdArray(req.google_token, function(err, friendsId){
			if(err) {
				next(err);
			}

			friendsId.push(req.google_user.id);
			var criteria = { "google_id": { "$in": friendsId}};
			var options = { "_id": 0, "sort": {"date": -1} };
			db.collection('messages').find(criteria, options).toArray(function(err, messages) {
				res.json({ 'messages': messages });
			});
		});

	};

	this.postNewMessage = function(req, res) {
		var upload_path = 'messages/' + path.basename(req.files.message.path)
		fs.rename(req.files.message.path, upload_path, function (err) {
			if (err) {
				return next(err);
			}

			console.log(JSON.stringify(req.google_user));
			var message = { 'audio': upload_path, 
							'google_id': req.google_user.id,
							'name': req.google_user.name.givenName + " " + req.google_user.name.familyName,
							'date': new Date()};

			db.collection('messages').insert(message, function(err, inserted) {
				if(err) {
					return next(err);
				}

				console.log(JSON.stringify(inserted));
				res.json(inserted);
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

		// Invalid credentials
		if (user.error) {
			return next(user.error);
		}

		req.google_token = token;
		req.google_user = user;
		next();
	});
}
