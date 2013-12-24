var task = require('../models/task');
var session = require('../models/session').session;

function init(app) {
    app.get('/', function(req, res) {
        session.init(req, handler);
        function handler() {
            var user = session.getUser();
            task.getAllTasks(user, function(tasks) {
                res.setHeader('Content-Type', 'text/html');
                res.render('index.ejs', {todos: tasks, user: user});
            });
        }

    });

    app.post('/insert', function(req, res) {
        session.init(req, handler);
        function handler() {
            var user = session.getUser();
            var todo = {id:null, title:req.body.task, timezone:req.body.timezone};
            task.addTask(todo, user, function() {
                res.setHeader('Location', '/');
                res.send(302, '');
            });
        }
    });

    app.post('/update', function(req, res) {
        session.init(req, handler);
        var callbacks, done = 0;
        function handler() {
            var user = session.getUser();
            var data = JSON.parse(req.body.data);
            callbacks = 1
            var id;
            task.updateTask(data, user, end);
            if (id = req.body.task_updated) {
                callbacks++;
                task.updateTask({id:id,created_at:new Date()}, user, end);
            }
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

    });

    app.post('/delete', function(req, res) {
        session.init(req, handler);
        function handler() {
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
    });

}

exports.init = init;
