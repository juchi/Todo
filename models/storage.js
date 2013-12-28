var mysql = require('mysql');

function getConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'user',
        password: 'password',
        database: 'todo'
    });
}

function getCollection(fields, table, where, cb) {
    var connection = getConnection();
    if (fields == null) {
        fields = '*';
    } else {
        fields = connection.escape(fields);
    }
    if (where == null) {
        where = '';
    } else if (typeof where == 'object') {
        var _where = '';
        var i = 0;
        for (var key in where) {
            if (i++ > 0) {
                _where += ' AND '
            }
            _where += key + ' = ' + connection.escape(where[key]);
        }
        where = ' WHERE ' + _where;
    }
    connection.query('SELECT '+fields+' FROM ??'+ where, table, function (err, rows) {
        connection.end();
        if (err) {
            console.log(err);
            cb(null);
            return;
        }
        cb(rows);
    });
}

function getObject(id, table, cb) {
    var connection = getConnection();
    connection.query('SELECT * FROM ?? WHERE id = ?', [table, id], function(err, rows) {
        connection.end();
        if (err) {
            console.log(err);
            cb();
            return;
        }
        cb(rows);
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
exports.getCollection = getCollection;
exports.getObject     = getObject;
exports.insertObject  = insertObject;
exports.updateObject  = updateObject;
