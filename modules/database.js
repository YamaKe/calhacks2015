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
    getHackathons: function (callback) {
        // TODO: strip sensitive info from the request
        // db.hackathons.find({}, function (err, hackathons) {
        //     if (err) {
        //         callback(err);
        //     } else {
        //         callback(hackathons);
        //     }
        // });
        callback([
            {name: 'Cal Hacks 2.0', image: 'http://www.calhacks.io/assets/img/hackathon_background.jpg', time: 1444442400, location: 'UC Berkely', color: 'rgb(238, 168, 60)'},
            {name: 'HackUCI', image: 'http://hackuci.com/images/Main%20floor.png', time: 1448067600, location: 'UC Irvine', color: 'rgb(44, 91, 151)'},
            {name: 'Hack Western 2', image: 'https://hackwestern.com/img/hw/splash.png', time: 1448640000, location: 'Western University', color: 'rgb(71, 54, 129)'},
            {name: 'Hack(RPI);', image: 'http://www.hackrpi.com/2014/assets/empac_mini.jpg', time: 1447509600, location: 'Rensselaer Polytechnic Institute Troy, NY', color: 'rgb(179, 71, 53)'},
            {name: 'HackUCI', image: 'http://hackuci.com/images/Main%20floor.png', time: 1448067600, location: 'UC Irvine', color: 'rgb(44, 91, 151)'},
            {name: 'Cal Hacks 2.0', image: 'http://www.calhacks.io/assets/img/hackathon_background.jpg', time: 1444442400, location: 'UC Berkely', color: 'rgb(238, 168, 60)'},
            {name: 'HackUCI', image: 'http://hackuci.com/images/Main%20floor.png', time: 1448067600, location: 'UC Irvine', color: 'rgb(44, 91, 151)'},
            {name: 'Cal Hacks 2.0', image: 'http://www.calhacks.io/assets/img/hackathon_background.jpg', time: 1444442400, location: 'UC Berkely', color: 'rgb(238, 168, 60)'},
            {name: 'Cal Hacks 2.0', image: 'http://www.calhacks.io/assets/img/hackathon_background.jpg', time: 1444442400, location: 'UC Berkely', color: 'rgb(238, 168, 60)'},
            {name: 'Cal Hacks 2.0', image: 'http://www.calhacks.io/assets/img/hackathon_background.jpg', time: 1444442400, location: 'UC Berkely', color: 'rgb(238, 168, 60)'},
            {name: 'HackUCI', image: 'http://hackuci.com/images/Main%20floor.png', time: 1448067600, location: 'UC Irvine', color: 'rgb(44, 91, 151)'},
            {name: 'Cal Hacks 2.0', image: 'http://www.calhacks.io/assets/img/hackathon_background.jpg', time: 1444442400, location: 'UC Berkely', color: 'rgb(238, 168, 60)'},
            {name: 'Cal Hacks 2.0', image: 'http://www.calhacks.io/assets/img/hackathon_background.jpg', time: 1444442400, location: 'UC Berkely', color: 'rgb(238, 168, 60)'},
            {name: 'Cal Hacks 2.0', image: 'http://www.calhacks.io/assets/img/hackathon_background.jpg', time: 1444442400, location: 'UC Berkely', color: 'rgb(238, 168, 60)'},
            {name: 'HackUCI', image: 'http://hackuci.com/images/Main%20floor.png', time: 1448067600, location: 'UC Irvine', color: 'rgb(44, 91, 151)'}
        ]);
    },
    getHackathonByID: function (hackathonID, callback) {
        // TODO: strip sensitive info from the request
        db.users.find({_id: mongojs.ObjectId(userID)}, function (err, user) {
            if (err) {
                callback({err: err});
            }
            callback(user[0]);
        });
    },
    addAdminsToHackathon: function (hackathonID, admin_id_array,  callback) {
        var admin_id_array2 = [];
        for (var i = 0; i < admin_id_array.length; i++) {
            admin_id_array2.push(mongojs.ObjectId(admin_id_array[i]));
        }
        db.hackathons.update(
            {_id: mongojs.ObjectId(hackathonID)},
            {$push: {admins: {$each: admin_id_array2}}},
            function (err, saved) {
                if (err) {
                    callback(err);
                } else {
                    callback(saved._id);
                }
            }
        );
    },
    // We need to add admin auth for some of the administrative stuff maybe?
    addUsersToHackathon: function (hackathonID, user_id_array, callback) {
        var user_id_array2 = [];
        for (var i = 0; i < user_id_array.length; i++) {
            user_id_array2.push(mongojs.ObjectId(user_id_array[i]));
        }
        db.hackathons.update(
            {_id: mongojs.ObjectId(hackathonID)},
            {$push: {hackers: {$each: user_id_array2}}},
            function (err, saved) {
                if (err) {
                    callback(err);
                } else {
                    callback(saved._id);
                }
            }
        );
    },
    removeUserFromHackathon: function (hackathonID, user_id, callback) {
        db.hackathons.update(
            {_id: mongojs.ObjectId(hackathonID)},
            {$pull: {hackers: {id: mongojs.ObjectId(user_id)}}},
            function (err, saved) {
                if (err) {
                    callback(err);
                } else {
                    callback(saved._id);
                }
            }
        );
    },
    getPushes: function (hackathonID, callback) {
        // TODO: strip sensitive info from the request
        db.hackathons.find({_id: mongojs.ObjectId(hackathonID)}, {pushboard: 1}, function (err, hackathons) {
            if (err) {
                callback(err);
            } else {
                callback(hackathons);
            }
        });
    },
    addParentComment: function (comment, callback) {
        db.hackathons.update(
            {_id: mongojs.ObjectId(hackathonID)},
            {$push: {threadboard: comment}},
            function (err, saved) {
                if (err) {
                    callback(err);
                } else {
                    callback(saved._id);
                }
            }
        );
    },
    editComment: function (hackathonID, commentID, newBody, callback) {
        db.hackathons.update({
            _id: mongojs.ObjectId(hackathonID),
            'threadboard._id': mongojs.ObjectId(commentID)
        }, {
            $push: {'pushboard.$.body': newBody}
        },
        function (err, saved) {
            if (err) {
                callback(err);
            } else {
                callback(saved._id);
            }
        });
    },
    createObjectID: function (callback) {
        var newID = ObjectId();
        callback(newID);
    }
};
