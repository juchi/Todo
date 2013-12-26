var fs = require('fs');

function getRoutes() {
    var routes = [
        {verb: 'get', path:/^\/assets\/(.*)\.(js|css)/, handler: assets}
    ];

    return routes;
}

function assets(req, res) {
    var filename = __dirname + '/../assets/' + req.params[0] + '.' + req.params[1];
    fs.readFile(filename, function(err, data) {
        if (err) {
            res.setHeader('Content-Type', 'text/html');
            res.send(404, 'Not found !');
        } else {
            res.setHeader('Content-Type', 'text/' + (req.params[0] == 'js' ? 'javascript' : 'css'));
            res.send(200, data);
        }
    });
}

exports.getRoutes = getRoutes;
