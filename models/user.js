var storage = require('./storage');
var crypto = require('crypto');

var User = function() {
    this.id = null;
    this.name = '';
    this.password = '';
    this.logged_in = false;
};

User.prototype.save = function(cb) {
    this.hashPassword(this.password);
    var data = {
        id:       this.id,
        name:     this.name,
        password: this.hash,
        salt:     this.salt
    };

    if (!this.id) {
        storage.insertObject(data, 'user', cb);
    } else {
        storage.updateObject(data, 'user', cb);
    }
}

User.prototype.hashPassword = function(password, salt) {
    if (typeof salt == "undefined") {
        salt = crypto.randomBytes(63).toString('base64');
        this.salt = salt;
    }
    this.hash = crypto.createHmac('sha512', salt).update(password).digest('base64');

    return this.hash;
}

User.prototype.authenticate = function(password, cb) {
    var that = this;
    storage.getCollection(null, 'user', {name:this.name}, function(rows) {
        if (rows && rows.length) {
            var user = rows[0];
            if (user.password == that.hashPassword(password, user.salt)) {
                cb(user.id);
                return;
            }
        }
        cb(false);
    });
}

module.exports = User;
