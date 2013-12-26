/**
 * This is the front controller of the application,
 * it registers all controllers available
 */

var Session = require('../models/session');

var controllers = [
    'task',
    'user',
    'default'
];

function init(app) {
    for (i in controllers) {
        var routes = require('./' + controllers[i]).getRoutes();
        for (j in routes) {
            registerRoute(app, routes[j]);
        }
    }

    app.use(function(req, res, next) {
        res.setHeader('Content-Type', 'text/html');
        res.send(404, 'Not found !');
    });
}

function registerRoute(app, route) {
    app[route.verb](route.path, function(req, res) {
        req.ts = new Date().getTime();
        bootstrap(req, res, route.handler);
    });
}


function bootstrap(req, res, handler) {
    var session = new Session();
    session.init(req, res, handler);
}

exports.init = init;
