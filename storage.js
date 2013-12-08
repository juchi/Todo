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
        tasks['today'] = new Array();
        tasks['week'] = new Array();
        for (var i in rows) {
            var task = {};
            for (var j in fields) {
                var field = fields[j]['name'];
                task[field] = rows[i][field];
            }
            var timezone = task.timezone;
            if (tasks[timezone] == undefined) {
                tasks[timezone] = new Array();
            }
            tasks[timezone].push(task);
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
            insertObject(task, 'task', cb);
        });
    } else {
        insertObject(task, 'task', cb);
    }
}

function updateTask(data, cb) {
    if (!Array.isArray(data)) {
        data = [data];
    }
    var size = data.length;
    var done = 0;
    data.forEach(function(task) {
        updateObject(task, 'task', checkDone);
    });

    function checkDone(idUpdated) {
        if (++done == size) {
            cb();
        }
    }
}

function removeTask(id, cb) {
    var connection = getConnection();
    connection.query('DELETE FROM ?? WHERE id = ?', ['task', id], function(err, result) {
        connection.end();
        if (err) {
            console.log(err);
        }
        cb(null);
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

exports.getAllTasks = getAllTasks;
exports.addTask = addTask;
exports.updateTask = updateTask;
exports.removeTask = removeTask;
