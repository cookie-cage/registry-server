var User = require('../models/user');
var Resume = require('../models/resume');

module.exports = function stats(req, res, next) {

    var redis = req.redis
    var uid = req.params.uid;

    redis.get('views_' + uid, function(err, views) {

            res.send({
            views: views * 1
        });
    });
};
