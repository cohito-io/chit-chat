'use strict';
var request = require('request')
	, _ = require('lodash')
	;

var API = 'https://www.googleapis.com/plus/v1/';

function options (endpoint, token) {
	return {
		url: API + endpoint, 
		headers: {'Authorization': 'Bearer ' + token},
		json: true
	}
};

exports.getUserInfo = function(token, cbk) {
	request.get(options(API + 'people/me', token), function (err, response, user) {
		cbk(err, user);
	});
};

exports.getFriendsIdArray = function(token, cbk) {
	request.get(options(API + 'people/me/people/visible', token), function(err, response, friends) {
		if (err) {
			return cbk(err);
		}

		cbk(err, _.pluck(friends.items, 'id'));
	});
};