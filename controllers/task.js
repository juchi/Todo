var task = require('../models/task');
var Session = require('../models/session');
var session = new Session();

function getRoutes() {
    var routes = [
        {verb: 'get',  path: '/',       handler: index},
        {verb: 'post', path: '/insert', handler: insert},
        {verb: 'post', path: '/update', handler: update},
        {verb: 'post', path: '/delete', handler: deleteTask}
    ];

    return routes;
}

function index(req, res, session) {
    var user = session.getUser();
    task.getAllTasks(user, function(tasks) {
        res.setHeader('Content-Type', 'text/html');
        res.render('index.ejs', {todos: tasks, user: user}, function(err, html) {
            res.send(200, html);
        });
    });
}

function insert(req, res, session) {
    var user = session.getUser();
    var todo = {id:null, title:req.body.task, timezone:req.body.timezone};
    task.addTask(todo, user, function() {
        res.setHeader('Location', '/');
        res.send(302, '');
    });
}

function update(req, res, session) {
    var callbacks = 1, done = 0;
    var user = session.getUser();
    var data = JSON.parse(req.body.data);
    var id;
    task.updateTask(data, user, end);
    if (id = req.body.task_updated) {
        callbacks++;
        task.updateTask({id:id,created_at:new Date()}, user, end);
    }

    function end() {
        if (callbacks == ++done) {
            sendResponse();
        }
    }

    function sendResponse() {
        if (req.xhr) {
            res.setHeader('Content-Type', 'text/plain');
            res.send(200, '');
        } else {
            res.setHeader('Location', '/');
            res.send(302, '');
        }
    }
}

function deleteTask(req, res, session) {
    var user = session.getUser();
    var id = req.body.id;
    if (id == undefined) {
        id = req.query.id;
    }
    task.removeTask(id, user, function(){
        if (req.xhr) {
            res.setHeader('Content-Type', 'text/plain');
            res.send(200, '');
        } else {
            res.setHeader('Location', '/');
            res.send(302, '');
        }
    });
}

exports.getRoutes = getRoutes;
