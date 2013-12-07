var ejs = require('ejs');
var express = require('express');
var fs = require('fs');
var storage = require('./storage');

var app = express();
app.use(express.bodyParser());

app.get('/', function(req, res) {
    storage.getAllTasks(function(tasks){
        res.setHeader('Content-Type', 'text/html');
        res.render('index.ejs', {todos: tasks});
    });
});

app.post('/insert', function(req, res) {
    var todo = {id:null, title:req.body.task, timezone:req.body.timezone};
    storage.addTask(todo, function() {
        res.setHeader('Location', '/');
        res.send(302, '');
    });
});

app.post('/update', function(req, res) {
    var id = req.body.id;
    var data = JSON.parse(req.body.data);
    if (id == undefined) {
        id = req.query.id;
    }
    storage.updateTask(id, data, function(){
        if (req.xhr) {
            res.setHeader('Content-Type', 'text/plain');
            res.send(200, '');
        } else {
            res.setHeader('Location', '/');
            res.send(302, '');
        }
    });
    
});

app.post('/delete', function(req, res) {
    var id = req.body.id;
    if (id == undefined) {
        id = req.query.id;
    }
    storage.removeTask(id, function(){
        if (req.xhr) {
            res.setHeader('Content-Type', 'text/plain');
            res.send(200, '');
        } else {
            res.setHeader('Location', '/');
            res.send(302, '');
        }
    });
    
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

app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.send(404, 'Not found !');
});
app.listen(8080);
