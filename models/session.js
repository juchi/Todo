var User = require('./user');
var storage = require('./storage');

var Session = function() {
    this.httpSession = null;
};

Session.prototype.init = function(req, res, cb) {
    var that = this;
    this.httpSession = req.session;
    this.user = new User();
    if (this.httpSession.user_id) {
        this.user.id = this.httpSession.user_id;
        storage.getObject(this.user.id, 'user', registerUser);
    } else {
        cb(req, res, this);
    }

    function registerUser(data) {
        if (Array.isArray(data) && data.length > 0) {
            that.user = data[0];
            that.user.logged_in = true;
        }
        cb(req, res, that);
    }
};

Session.prototype.getUser = function() {
    return this.user;
};

Session.prototype.login = function(login, password, cb) {
    var that = this;
    storage.getCollection(null, 'user', {'name':login, 'password':password}, function(result) {
        var success = false;
        if (result && result.length) {
            success = true;
            that.httpSession.user_id = result[0].id;
        }
        cb(success);
    });
}
Session.prototype.logout = function() {
    this.user = new User();
    this.httpSession.user_id = null;
    return this;
};

module.exports = Session;
