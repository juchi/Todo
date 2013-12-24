var User = require('./user').User;
var storage = require('../storage');

var Session = function() {
    this.httpSession = null;
};

Session.prototype.init = function(req, cb) {
    var that = this;
    this.httpSession = req.session;
    this.user = new User();
    if (this.httpSession.user_id) {
        this.user.id = this.httpSession.user_id;
        storage.getObject(this.user.id, 'user', registerUser);
    } else {
        cb();
    }

    function registerUser(data) {
        if (Array.isArray(data) && data.length > 0) {
            that.user = data[0];
        }
        cb();
    }
};

Session.prototype.getUser = function() {
    return this.user;
};

Session.prototype.logout = function() {
    this.user = new User();
    this.httpSession.user_id = null;
    return this;
};

exports.session = new Session();