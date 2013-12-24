var storage = require('../storage');

var User = function() {
    this.id = null;
    this.name = '';
    this.password = '';
    this.logged_in = false;
};

User.prototype.save = function(cb) {
    var data = {
        id:   this.id,
        name: this.name,
        password: this.password
    };

    if (!this.id) {
        storage.insertObject(data, 'user', cb);
    } else {
        storage.updateObject(data, 'user', cb);
    }
}

exports.User = User;
