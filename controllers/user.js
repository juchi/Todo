var User = require('../models/user');

function getRoutes() {
    var routes = [
        {verb: 'get',  path: '/register', handler: register},
        {verb: 'post', path: '/register', handler: registerPost},
        {verb: 'get',  path: '/login', handler: login},
        {verb: 'post', path: '/login', handler: loginPost},
        {verb: 'get',  path: '/logout', handler: logout}
    ];

    return routes;
}

function register(req, res) {
    res.render('register.ejs');
}

function registerPost(req, res) {
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

function login(req, res, session) {
    if (session.getUser().id) {
        res.redirect('/');
    } else {
        res.render('login.ejs', {error:false});
    }
}

function loginPost(req, res, session) {
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

function logout(req, res, session) {
    session.logout();
    res.redirect('/');
}

exports.getRoutes = getRoutes;
