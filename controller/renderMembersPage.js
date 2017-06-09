var User = require('../models/user');

module.exports = function renderMembersPage(req, res, next) {

    User.find({}, function(err, docs) {
        if (err) {
            return next(err);
        }

        var usernameArray = [];

        docs.forEach(function(doc) {
            usernameArray.push({
                username: doc.username

            });
        });

        template_data = {
            users: usernameArray
        }

        res.render('members', template_data);
        
    });
};
