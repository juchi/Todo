/**
 * Entry point
 */

var front = require('./controllers/front');
var express = require('express');
var app = express();
app.use(express.cookieParser());
app.use(express.session({secret:'secretkey'}));
app.use(express.bodyParser());

front.init(app);

app.listen(8080);
