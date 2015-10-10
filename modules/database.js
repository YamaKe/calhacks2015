var Utils = require('./utils');
var chalk = require('chalk');
var mongojs = require('mongojs');

var db;
var collections = ['users', 'hackathons'];
var credentials = require('./credentials');

module.exports = {
    init: function () {
        if (db === undefined) {
            var creds = {};
            if (process.env.DB_USERNAME && process.env.DB_PASSWORD) {
                creds.username = process.env.DB_USERNAME;
                creds.password = process.env.DB_PASSWORD;
            } else {
                creds.username = credentials.mongodb.username;
                creds.password = credentials.mongodb.password;
            }
            var databaseUrl = creds.username + ':' + creds.password + '@ds037283.mongolab.com:37283/runhack';
            db = mongojs(databaseUrl, collections, {authMechanism: 'ScramSHA1'});
            db.on('error', function (err) {
                console.log(err);
                db = mongojs(databaseUrl, collections, {authMechanism: 'ScramSHA1'});
            });
        }
        return this;
    },
    disconnect: function () {
        if (db !== undefined) {
            db.close();
        }
    },
    getUsers: function (callback) {
        // TODO: strip sensitive info from the request
        db.users.find({}, function (err, users) {
            if (err) {
                callback(err);
            } else {
                callback(users);
            }
        });
    },
    getUserByID: function (userID, callback) {
        // TODO: strip sensitive info from the request
        db.users.find({_id: mongojs.ObjectId(userID)}, function (err, user) {
            if (err) {
                callback({err: err});
            }
            callback(user[0]);
        });
    },
    addUser: function (user, callback) {
        // verify there are no other users with username and that the email is valid
        // db.users.find({username: user.username}, function (err, users) {\
        db.users.save(user, function (err, saved) {
            if (err) {
                callback(err);
            } else {
                // TODO: use nodemailer in the wherever the callback goes to send an email with user info (QR code)
                callback(saved._id);
            }
        });
    },
    editUser: function (userID, update, callback) {
        delete update._id;
        console.log(update);
        db.users.update({_id: mongojs.ObjectId(userID)}, {$set: update}, function (err, user) {
            console.log(err);
            console.log(user);
            if (err) {
                callback({error: err});
            } else {
                callback({id: user._id});
            }
        });
    },
    addHackathon: function (hackathon, callback) {
        db.hackathons.save(hackathon, function (err, saved) {
            if (err) {
                callback(err);
            } else {
                // TODO: use nodemailer in the wherever the callback goes to send an email with user info (QR code)
                callback(saved._id);
            }
        });
    },
    addUsertoHackathon: function (hackathon_id, user_id, callback) {
        db.hackathons.update(
            { _id: db.objectkey(hackathon_id) },
            { $push: { "hackers": user_id } },
            function (err, saved) {
                if (err) {
                    callback(err);
                } else {
                    callback(saved._id);
                }
            }
        );

    }
};
