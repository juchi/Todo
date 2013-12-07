var mysql = require('mysql');

function getConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'user',
        password: 'password',
        database: 'todo'
    });
}

function getAllTasks(cb) {
    var connection = getConnection();
    connection.query('SELECT * FROM task', function(err, rows, fields) {
        connection.end();
        if (err) {
            console.log(err);
            cb(new Array());
            return;
        }
        var tasks = new Array();
        for (var i in rows) {
            var task = {};
            for (var j in fields) {
                var field = fields[j]['name'];
                task[field] = rows[i][field];
            }
            tasks.push(task);
        }
        cb(tasks);
    });
}

function addTask(task, cb) {
    var connection = getConnection();
    connection.query('INSERT INTO task SET ?', {title:task.title}, function(err, result) {
        connection.end();
        if (err) {
            console.log(err);
            cb(null);
        }
        cb(result.insertId);
    });
}

function removeTask(id, cb) {
    var connection = getConnection();
    connection.query('DELETE FROM task WHERE id = ?', id, function(err, result) {
        connection.end();
        if (err) {
            console.log(err);
        }
        cb(null);
    });
}

exports.getAllTasks = getAllTasks;
exports.addTask = addTask;
exports.removeTask = removeTask;
