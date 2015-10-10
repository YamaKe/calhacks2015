var testing = require('../database');

var should = require('should'); // jshint ignore:line

describe('database.js tests', function () {
    // it('connect to database', function (done) {
    //     testing = testing.init();
    //     testing.should.be.an.instanceOf(Object);
    //     // TODO change modes.TEST to false
    //     var testing2 = require('../database').init({LOG: false, TEST: true});
    //     testing.should.equal(testing2);
    //
    //     done();
    // });
    // it('get users', function (done) {
    //     testing.getUsers(function (users) {
    //         users.should.not.be.empty; // jshint ignore:line
    //         users[0].should.have.property('_id');
    //         users[0].should.have.property('username');
    //         users[0].should.have.property('name');
    //         users[0].should.have.property('status');
    //         users[0].should.have.property('image');
    //         users[0].should.have.property('lastActive');
    //         users[0].should.have.property('conversations');
    //         users[0].should.have.property('profiles');
    //
    //         done();
    //     });
    // });
    // it('get user by username', function (done) {
    //     testing.getUsers(function (users) {
    //         testing.getUser(users[0].username, function (user) {
    //             user.should.have.property('_id');
    //             user.should.have.property('name');
    //             user.should.have.property('status');
    //             user.should.have.property('image');
    //             user.should.have.property('lastActive');
    //             user.should.have.property('conversations');
    //             user.should.have.property('profiles');
    //             user._id.id.should.eql(users[0]._id.id);
    //             user.username.should.equal(users[0].username);
    //             user.name.should.equal(users[0].name);
    //             user.status.should.equal(users[0].status);
    //             user.image.should.equal(users[0].image);
    //             user.lastActive.should.equal(users[0].lastActive);
    //             user.conversations.should.eql(users[0].conversations);
    //             user.profiles.should.eql(users[0].profiles);
    //
    //             done();
    //         });
    //     });
    // });
    // it('get user by ID', function (done) {
    //     testing.getUsers(function (users) {
    //         testing.getUserByID(users[0]._id, function (user) {
    //             user.should.have.property('_id');
    //             user.should.have.property('name');
    //             user.should.have.property('status');
    //             user.should.have.property('image');
    //             user.should.have.property('lastActive');
    //             user.should.have.property('conversations');
    //             user.should.have.property('profiles');
    //             user._id.id.should.eql(users[0]._id.id);
    //             user.username.should.equal(users[0].username);
    //             user.name.should.equal(users[0].name);
    //             user.status.should.equal(users[0].status);
    //             user.image.should.equal(users[0].image);
    //             user.lastActive.should.equal(users[0].lastActive);
    //             user.conversations.should.eql(users[0].conversations);
    //             user.profiles.should.eql(users[0].profiles);
    //
    //             done();
    //         });
    //     });
    // });
    // it('add user', function (done) {
    //     testing.addUser(undefined, function (ID) {
    //         throw new Error('implement this test');
    //         done();
    //     });
    // });
    // it('get conversations by user ID', function (done) {
    //     testing.getConversationsByUserID(undefined, function (conversations) {
    //         throw new Error('implement this test');
    //         done();
    //     });
    // });
    it('disconnect from database', function (done) {
        testing.disconnect();
        done();
    });
});
