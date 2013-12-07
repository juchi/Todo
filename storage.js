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
    connection.query('SELECT * FROM task ORDER BY position', function(err, rows, fields) {
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
    if (!task.position) {
        connection.query('SELECT MAX(position) as max FROM task', function(err, rows){
            if (err) {
                console.log(err);
                cb(null);
                return;
            }
            task.position = rows[0].max + 1;
            insertTask(task, cb);
        });
    } else {
        insertTask(task, cb);
    }

    function insertTask(task, cb) {
        connection.query('INSERT INTO task SET ?', task, function(err, result) {
            connection.end();
            if (err) {
                console.log(err);
                cb(null);
                return;
            }
            cb(result.insertId);
        });
    }
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
