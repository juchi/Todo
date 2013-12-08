var mysql = require('mysql');

function getConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'user',
        password: 'password',
        database: 'todo'
    });
}

function insertObject(obj, table, cb) {
    var connection = getConnection();
    obj.created_at = new Date();
    connection.query('INSERT INTO ?? SET ?', [table, obj], function(err, result) {
        connection.end();
        if (err) {
            console.log(err);
            cb(null);
            return;
        }
        cb(result.insertId);
    });
}

function updateObject(obj, table, cb) {
    var connection = getConnection();
    connection.query('UPDATE ?? SET ? WHERE id = ?', [table, obj, obj.id], function(err, result) {
        connection.end();
        if (err) {
            console.log(err);
            cb(null);
            return;
        }
        cb(obj.id);
    });
}

exports.getConnection = getConnection;
exports.insertObject = insertObject;
exports.updateObject = updateObject;
