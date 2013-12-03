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

exports.getFriendsIdArray = function(token, cbk) {
	var endpoint = API + 'people/me/people/visible';

	request.get({
		url: endpoint,
		headers: {'Authorization': 'Bearer ' + token},
		json: true
	}, function(err, response, friends) {
		var friendsId = [];
		for(var i = 0, len = friends.items.length; i < len; i++) {
			friendsId.push(friends.items[i].id);
		}
		cbk(err, friendsId);
	});
};