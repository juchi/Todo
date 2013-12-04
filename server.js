var http = require('http');
var ejs = require('ejs');
var express = require('express');

var app = express();

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('index.ejs');
});
app.listen(8080);
