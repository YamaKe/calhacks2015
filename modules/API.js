var app;
var database;
var passport = require('passport');
var strategies = {
    local: require('passport-local')
    // facebook: require('passport-facebook').Strategy
    // google: require('passport-google')
};
// var credentials = require('./credentials');

// function ensureAuthenticated (req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect('/');
// }

module.exports = {
    prefix: '/api/',

    init: function (_app, _database) {
        app = _app;
        database = _database;

        passport.serializeUser(function (user, done) {
            done(null, user);
        });
        passport.deserializeUser(function (obj, done) {
            done(null, obj);
        });

        passport.use(new strategies.local(
            function (username, password, done) {
                if ((username.toLowerCase() === 'admin' && password === '1969') || (username.toLowerCase() === 'manager' && password === '9292')) {
                    return done(null, username);
                } else {
                    return done(null, false);
                }
            }
        ));

        app.use(
            require('cookie-parser')(),
            require('method-override')('X-HTTP-Method-Override'),
            // TODO: figure out what express session is, and what I should replace 'keyboard cat' with
            require('express-session')({secret: 'keyboard cat', saveUninitialized: true, resave: true}),
            passport.initialize(),
            passport.session()
        );

        app.get(this.prefix + 'user', function (req, res) {
            database.getUsers(function (users) {
                if (!users.error) {
                    res.send(users);
                } else {
                    res.send({message: users.error});
                }
            });
        });
        app.post(this.prefix + 'user', function (req, res) {
            var user = {
                first_name: req.body.first_name,
                last_name:  req.body.last_name,
                username:   req.body.username,
                password:   req.body.password,
                email:      req.body.email,
                hacks:      []
            };
            database.addUser(user, function (_id) {
                res.send(_id);
            });
            return;
        });
        app.put(this.prefix + 'user', function (req, res) {
            database.editUser(req.body.userID, req.body.update, function (userID) {
                console.log(req.body.userID);
                if (userID.error) {
                    res.send(userID);
                } else {
                    res.send(userID);
                }
            });
        });
        app.get(this.prefix + 'hackathon', function (req, res) {
            database.getHackathons(function (hackathons) {
                if (!hackathons.error) {
                    res.send(hackathons);
                } else {
                    res.send({message: hackathons.error});
                }
            });
        });
        app.post(this.prefix + 'hackathon', function (req, res) {
            var hackathon = {
                name:       req.body.name,
                admins:     req.body.admins,
                hackers:    req.body.hackers,
                pushboard:  [],
                threadboard:[]
            };
            database.addHackathon(hackathon, function (_id) {
                res.send(_id);
            });
            return;
        });
        app.post(this.prefix + 'addUserstoHackathon', function (req, res) {
            var user_id_array   = req.body.user_id_array;
            var hackathon_id = req.body.hackathon_id;
            database.addUserToHackathon(hackathon_id, user_id, function (hack_id) {
                res.send(hack_id);
            });
            return;
        });
        app.put(this.prefix + 'removeUserfromHackathon', function (req, res) {
            var user_id   = req.body.user_id;
            var hackathon_id = req.body.hackathon_id;
            database.removeUserToHackathon(hackathon_id, user_id, function (hack_id) {
                res.send(hack_id);
            });
            return;
        });
        app.post(this.prefix + 'addAdminstoHackathon', function (req, res) {
            var admin_id_array   = req.body.admin_id_array;
            var hackathon_id = req.body.hackathon_id;
            database.addUserToHackathon(hackathon_id, admin_id, function (hack_id) {
                res.send(hack_id);
            });
            return;
        });
        app.put(this.prefix + 'removeAdminfromHackathon', function (req, res) {
            var admin_id   = req.body.admin_id;
            var hackathon_id = req.body.hackathon_id;
            database.removeAdminToHackathon(hackathon_id, admin_id, function (hack_id) {
                res.send(hack_id);
            });
            return;
        });
        app.get(this.prefix + 'createObjectID', function (req, res) {
            database.createObjectID(function (newObjectId) {
                    res.send(newObjectId);
                }
            );
        });
        app.post(this.prefix + 'login/local', passport.authenticate('local', {failureRedirect: '/'}),
            function (req, res) {
                res.send('authenticated');
            }
        );
        app.get(this.prefix + 'logout', function (req, res) {
            req.logout();
            res.redirect('/');
        });

        return this;
    },
    start: function () {

    },
    stop: function () {

    }
};
