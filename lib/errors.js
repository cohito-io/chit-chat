'use strict';

module.exports = function (app) {
	app.use(handle404);
	app.use(handleOther);
};

function handle404(req, res) {
	res.send(404, 'No such page my friend');
}

function handleOther(err, req, res, next) {
	if (err.status || err.code) {
		res.send(err.status || err.code, err.message);
	} else {
		res.send(500, err.message);
	}
}