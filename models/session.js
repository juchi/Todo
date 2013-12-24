var User = require('./user').User;

function getUser(httpSession) {
    var user = new User();
    return user;
}

exports.getUser = getUser;
