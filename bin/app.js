'use strict';
var express = require('express')
	, app = express()
	, routes = require('../lib/routes')
	, mongodb = require('mongodb').MongoClient
	, config = require('../lib/config')
	;

mongodb.connect(config.MONGO_CONNECTION_STRING, function(err, db) {
	if (err) {
		throw err;
	}

	app.use(express.multipart());
	app.use(express.static('www'));
	app.use('/store', express.static(config.UPLOAD_DIR));

	routes(app, db);
	app.listen(config.LISTEN_PORT);	
});
