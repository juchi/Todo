var User = require('../models/user').User;
var session = require('../models/session').session;

function init(app) {
    app.get('/register', function(req, res) {
        session.init(req, handler);

        function handler() {
            res.render('register.ejs');
        }
    });

    app.post('/register', function(req, res) {
        session.init(req, handler);

        function handler() {
            var user = new User();
            user.name = req.body.login;
            user.password = req.body.password;
            user.save(redirect);

            function redirect(newid) {
                if (newid) {
                    req.session.user_id = newid;
                    res.redirect('/');
                } else {
                    res.render('register.ejs');
                }
            }
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

}

exports.init = init;
