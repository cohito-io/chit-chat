'use strict';
var express = require('express')
	, app = express()
	, routes = require('../lib/routes')
	;

app.use(express.static('www'));
routes(app);
app.listen(7654);