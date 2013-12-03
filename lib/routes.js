'use strict';

module.exports = function (app) {
	app.post('/messages', postNewMessage);	
};

function postNewMessage(req, res) {
	res.send(200);
}