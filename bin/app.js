'use strict';
var express = require('express')
	, app = express()
	, routes = require('../lib/routes')
	, mongodb = require('mongodb').MongoClient
	;

mongodb.connect('mongodb://localhost:27017/chitchat', function(err, db) {
	if(err) throw err;

	app.use(express.multipart());
	app.use(express.static('www'));
	app.use('/store', express.static('messages'));

	routes(app, db);
	app.listen(7654);	
});
