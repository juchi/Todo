var task = require('../models/task');

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
    task.getAllTasks(user, function(tasks, timezones) {
        res.setHeader('Content-Type', 'text/html');
        res.render('index.ejs', {todos: tasks, 'timezones': timezones, user: user}, function(err, html) {
            res.send(200, html);
        });
    });
}

function insert(req, res, session) {
    var user = session.getUser();
    var todo = {id:null, title:req.body.task, timezone:req.body.timezone};
    task.addTask(todo, user, function() {sendSuccessResponse(req, res);});
}

function update(req, res, session) {
    var user = session.getUser();
    var data = JSON.parse(req.body.data);
    task.updateTask(data, user, function(){sendSuccessResponse(req, res);});
}

function deleteTask(req, res, session) {
    var user = session.getUser();
    var id = req.body.id;
    if (id == undefined) {
        id = req.query.id;
    }
    task.removeTask(id, user, function(){sendSuccessResponse(req, res);});
}

function sendSuccessResponse(req, res) {
    if (req.xhr) {
        res.setHeader('Content-Type', 'text/plain');
        res.send(200, '');
    } else {
        res.setHeader('Location', '/');
        res.send(302, '');
    }
}

exports.getRoutes = getRoutes;
