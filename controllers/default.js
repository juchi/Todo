var fs = require('fs');

function init(app) {
    // JS and CSS files
    app.get(/^\/assets\/(.*)\.(js|css)/, function(req, res) {
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
    });


    app.use(function(req, res, next) {
        res.setHeader('Content-Type', 'text/html');
        res.send(404, 'Not found !');
    });
}

exports.init = init;
