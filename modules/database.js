var Utils = require('./utils');
var chalk = require('chalk');
var mongojs = require('mongojs');
// var validator = require('validator');

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
        //Searches for a user with that username
        var userFound = db.users.find({username: user.username}, function (err, user) {
            if (err) {
                callback({err: err});
            }
        });
        //Checks if the email is valid
        var validEmail = validator.isEmail(user.email);
        //Searches for a user with that email
        var emailFound = db.users.find({email: user.email}, function (err, user) {
            if (err) {
                callback({err: err});
            }
        });
        if (userFound.length === 0
            && validEmail
            && !emailFound) {
                db.users.save(user, function (err, saved) {
                    if (err) {
                        callback(err);
                    } else {
                        // TODO: use nodemailer in the wherever the callback goes to send an email with user info (QR code)
                        callback(saved._id);
                    }
                });
            }
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
        db.hackathons.find({}, function (err, hackathons) {
            if (err) {
                callback(err);
            } else {
                callback(hackathons);
            }
        });
    },
    addAdminsToHackathon: function (hackathon_id, admin_id_array,  callback) {
        var admin_id_array2 = [];
        for (var i = 0; i < admin_id_array.length; i++) {
            admin_id_array2.push(mongojs.ObjectId(admin_id_array[i]));
        }
        db.hackathons.update(
            {_id:mongojs.ObjectId(hackathon_id)},
            {$push:{admins:{$each:admin_id_array2}}},
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
    addUsersToHackathon: function (hackathon_id, user_id_array, callback) {
        var user_id_array2 = [];
        for (var i = 0; i < user_id_array.length; i++) {
            user_id_array2.push(mongojs.ObjectId(user_id_array[i]));
        }
        db.hackathons.update(
            {_id:mongojs.ObjectId(hackathon_id)},
            {$push:{hackers:{$each:user_id_array2}}},
            function (err, saved) {
                if (err) {
                    callback(err);
                } else {
                    callback(saved._id);
                }
            }
        );
    },
    removeUserFromHackathon: function (hackathon_id, user_id, callback) {
        db.hackathons.update(
            {_id:db.ObjectKey(hackathon_id)},
            {$pull:{hackers:{id:db.ObjectKey(user_id)}}},
            function (err, saved) {
                if (err) {
                    callback(err);
                } else {
                    callback(saved._id);
                }
            }
        );
    },
    addPush: function (hackathon_id, pushmessage, callback) {
        db.hackathons.update(
            {_id:mongojs.ObjectId(hackathon_id)},
            {$push:{pushboard:pushmessage}},
            function (err, saved) {
                if (err){
                    callback(err);
                } else {
                    callback(saved._id);
                }
            }
        );
    },
    editPush: function (hackathon_id, push_id, update, callback) {
        db.hackathons.update(
            {_id:mongojs.ObjectId(hackathon_id), pushboard: {_id: mongojs.ObjectId(push_id)}},
            {$set:{pushboard:{id:mongojs.ObjectId()}}},
            function (err, saved) {
                if (err) {
                    callback(err);
                } else {
                    callback(saved._id);
                }
            }
        );
    },
    removePush: function (hackathon_id, push_id, callback) {
        db.hackathons.update(
            {_id: mongojs.ObjectId(hackathon_id)},
            {$pull:{pushboard:{id:mongojs.ObjectId(push_id)}}},
            function (err, saved) {
                if (err) {
                    callback(err);
                } else {
                    callback(saved._id);
                }
            }
        );
    },
    //Adds the user's id to the upvote array
    upVote: function (hackathon_id, post_id, user_id, callback) {
        // query upvote array and downvote array for user_id
        var upFound = db.hackathons.find({upvotes: user_id}, function (err, hackathons) {
            if (err) {
                callback(err);
            } else {
                callback(users);
            }
        });
        var downFound = db.hackathons.find({downvotes: user_id}, function (err, hackathons) {
            if (err) {
                callback(err);
            } else {
                callback(users);
            }
        });
        // if both returned lists are empty, then put in a new upvote
        if (upFound.length === 0 && downFound.length === 0) {
            db.hackathons.update(
                {_id:mongojs.ObjectId(hackathon_id),upvotes:post_id},
                {$push:{upvotes:{id:mongojs.ObjectId(user_id)}}},
                function (err, saved) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(saved._id);
                    }
                }
            );
        }
        // if the downvote isnt empty, then remove the user_id from downvote and add it to upvote
        else if (downFound.length != 0) {
            db.hackathons.update(
                {_id:mongojs.ObjectId(hackathon_id),upvotes:post_id},
                {$pull:{downvotes:{id:mongojs.ObjectId(user_id)}}},
                {$push:{upvotes:{id:mongojs.ObjectId(user_id)}}},
                function (err, saved) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(saved._id);
                    }
                }
            );
        }
        // if the upvote isnt empty, then don't do anything
    },
    // Adds the user's id to the downvote array
    downVote: function (hackathon_id, post_id, user_id, callback) {
        // query upvote array and downvote array for user_id
        var upFound = db.hackathons.find({upvotes: user_id}, function (err, hackathons) {
            if (err) {
                callback(err);
            } else {
                callback(users);
            }
        });
        var downFound = db.hackathons.find({downvotes: user_id}, function (err, hackathons) {
            if (err) {
                callback(err);
            } else {
                callback(users);
            }
        });
        // if both returned lists are empty, then put in a new upvote
        if (upFound.length === 0 && downFound.length === 0) {
            db.hackathons.update(
                {_id:mongojs.ObjectId(hackathon_id), downvotes:post_id},
                {$push:{downvotes:{id:mongojs.ObjectId(user_id)}}},
                function (err, saved) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(saved._id);
                    }
                }
            );
        }
        // if the upvote isnt empty, then remove the user_id from downvote and add it to upvote
        else if (upFound.length != 0) {
            db.hackathons.update(
                {_id:mongojs.ObjectId(hackathon_id),downvotes:post_id},
                {$pull:{upvotes:{id:mongojs.ObjectId(user_id)}}},
                {$push:{downvotes:{id:mongojs.ObjectId(user_id)}}},
                function (err, saved) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(saved._id);
                    }
                }
            );
        }
        // if the upvote isnt empty, then don't do anything
    }
};
