var http = require('http');
var ejs = require('ejs');
var express = require('express');

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

app.all('/delete', function(req, res) {
    var id = req.body.id;
    if (id == undefined) {
        id = req.query.id;
    }
    if (list[id] != undefined) {
        list.splice(id, 1);
    }
    res.setHeader('Location', '/');
    res.send(302, '');
});

app.use(function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.send(404, 'Not found !');
});
app.listen(8080);
