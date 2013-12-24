var ejs = require('ejs');
var express = require('express');
var fs = require('fs');
var task = require('./task');
var session = require('./models/session').session;

var app = express();
app.use(express.cookieParser());
app.use(express.session({secret:'secretkey'}));
app.use(express.bodyParser());

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
    function handler() {
        var user = session.getUser();
        var data = JSON.parse(req.body.data);
        var callbacks = 1, done=0, id;
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

// JS and CSS files
app.get(/^\/assets\/(.*)\.(js|css)/, function(req, res) {
    var filename = __dirname + '/assets/' + req.params[0] + '.' + req.params[1];
    fs.readFile(filename, function(err, data) {
        if (err) {
            res.setHeader('Content-Type', 'text/html');
            res.send(404, 'Not found !');
        } else {
            res.setHeader('Content-Type', 'text/' + (req.params[0] == 'js' ? 'javascript' : 'css'));
            res.send(200, data);
        }
    });
});

app.get('/register', function(req, res) {
    session.init(req, handler);

    function handler() {
        res.redirect('/');
    }
});

app.get('/login', function(req, res) {
    session.init(req, handler);

    function handler() {
        if (session.getUser().id) {
            res.redirect('/');
        } else {
            res.render('login.ejs', {error:false});
        }
    }
});

app.post('/login', function(req, res) {
    session.init(req, handler);

    function handler() {
        if (!session.getUser().id) {
            var login    = req.body.login;
            var password = req.body.password;
            session.login(login, password, redirect);
        } else {
            res.redirect('/');
        }

        function redirect(success) {
            if (success) {
                res.redirect('/');
            } else {
                res.render('login.ejs', {error:true});
            }
        }

    }
});

app.get('/logout', function(req, res) {
    session.init(req, handler);

    function handler() {
        session.logout();
        res.redirect('/');
    }
});

app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.send(404, 'Not found !');
});
app.listen(8080);
