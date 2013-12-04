var http = require('http');
var ejs = require('ejs');
var express = require('express');
var fs = require('fs');

var app = express();
app.use(express.bodyParser());

var lastid = 0;
var list = new Array();

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('index.ejs', {todos: list});
});

app.post('/insert', function(req, res) {
    var todo = {id:++lastid, title:req.body.task};
    list[lastid] = todo;
    res.setHeader('Location', '/');
    res.send(302, '');
});

app.post('/delete', function(req, res) {
    var id = req.body.id;
    if (id == undefined) {
        id = req.query.id;
    }
    if (list[id] != undefined) {
        list.splice(id, 1);
    }
    if (req.xhr) {
        res.setHeader('Content-Type', 'text/plain');
        res.send(200, '');
    } else {
        res.setHeader('Location', '/');
        res.send(302, '');
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

app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.send(404, 'Not found !');
});
app.listen(8080);
