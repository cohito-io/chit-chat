'use strict';

module.exports = function (app) {
	app.use(function (err, req, res, next) {
		if (err.status || err.code) {
			res.send(err.status || err.code, err.message);
		} else {
			res.send(500, err.message);
		}
	});
};