'use strict';
var request = require('request');

var API = 'https://www.googleapis.com/plus/v1/';
var API_KEY = '';

exports.getUserInfo = function(token, cbk) {
	var endpoint = API + 'people/me?key=' + API_KEY;

	request.get({
		url: endpoint, 
		headers: {'Authorization': 'Bearer ' + token},
		json: true
	}, function (err, response, user) {
		cbk(err, user);
	});
};