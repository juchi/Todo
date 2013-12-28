var storage = require('./storage');

function getAllTimezones(cb) {
    storage.getCollection(null, 'timezone', null, function(timezones) {
        cb(timezones);
    });
}

exports.getAllTimezones = getAllTimezones;