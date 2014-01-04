var storage = require('./storage');
var timezone = require('./timezone');

function getAllTasks(user, cb) {
    var tasks = new Array();
    var timezones = {};

    timezone.getAllTimezones(function(list) {
        for (i in list) {
            timezones[list[i].id] = list[i].name;
            tasks[list[i].name] = new Array();
        }
        if (user.id == null) {
            cb(tasks, timezones);
            return;
        }
        next();
    });

    function next() {
        var connection = storage.getConnection();
        connection.query('SELECT * FROM task WHERE user_id = ? ORDER BY position', user.id, function(err, rows, fields) {
            connection.end();
            if (err) {
                console.log(err);
                cb(new Array());
                return;
            }
            for (var i in rows) {
                var task = {};
                for (var j in fields) {
                    var field = fields[j]['name'];
                    task[field] = rows[i][field];
                }
                var timezone = timezones[task.timezone];
                if (tasks[timezone] == undefined) {
                    tasks[timezone] = new Array();
                }
                tasks[timezone].push(task);
            }
            cb(tasks, timezones);
        });
    }
}

function addTask(task, user, cb) {
    if (user.id == null || !task.title || task.title.length == 0) {
        cb(null);
        return;
    }
    task.user_id = user.id;
    var connection = storage.getConnection();
    if (!task.position) {
        connection.query('SELECT MAX(position) as max FROM task WHERE user_id = ?', user.id, function(err, rows){
            if (err) {
                console.log(err);
                cb(null);
                return;
            }
            task.position = rows[0].max + 1;
            storage.insertObject(task, 'task', cb);
        });
    } else {
        storage.insertObject(task, 'task', cb);
    }
}

function updateTask(data, user, cb) {
    if (!Array.isArray(data)) {
        data = [data];
    }
    var size = data.length || 0;
    var done = 0;
    data.forEach(function(task) {
        // do not update tasks with an empty label
        if (typeof data.title !== "undefined" && data.title.length == 0) {
            size--;
            checkDone(null);
            return;
        }
        storage.updateObject(task, 'task', checkDone);
    });

    function checkDone(idUpdated) {
        if (idUpdated) {
            done++;
        }
        if (done == size) {
            cb();
        }
    }
}

function removeTask(id, user, cb) {
    var connection = storage.getConnection();
    connection.query('DELETE FROM ?? WHERE id = ? AND user_id = ?', ['task', id, user.id], function(err, result) {
        connection.end();
        if (err) {
            console.log(err);
        }
        cb(null);
    });
}

exports.getAllTasks = getAllTasks;
exports.addTask = addTask;
exports.updateTask = updateTask;
exports.removeTask = removeTask;