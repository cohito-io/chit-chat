'use strict';
var express = require('express')
	, app = express()
	, routes = require('../lib/routes')
	;

app.use(express.multipart());
app.use(express.static('www'));
app.use('/store', express.static('messages'));

routes(app);
app.listen(7654);