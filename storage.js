var list = new Array();
var lastid = 0;

function getAllTasks() {
	return list;
}

function addTask(task) {
	task.id = lastid++;
	list.push(task);
}

function removeTask(id) {
	for (var i in list) {
        if (list[i].id == id) {
            list.splice(i, 1);
            break;
        }
    }
}

exports.getAllTasks = getAllTasks;
exports.addTask	= addTask;
exports.removeTask = removeTask;
