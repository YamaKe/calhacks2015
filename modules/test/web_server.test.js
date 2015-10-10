var testing = require('../web_server');

var should = require('should'); // jshint ignore:line
var supertest = require('supertest');

describe('web_server.js tests', function () {
    it('starting web server', function (done) {
        testing = testing.init();
        testing.should.be.an.instanceOf(Object);
        done();
    });
    it('signup page loads', function (done) {
        supertest(testing.getApp()).post('/signup').expect(200).end(function (err, res) {
            res.status.should.equal(200);
            done();
        });
    });
    it('login page loads', function (done) {
        supertest(testing.getApp()).post('/login').expect(200).end(function (err, res) {
            res.status.should.equal(200);
            done();
        });
    });
    it('messaging page loads', function (done) {
        supertest(testing.getApp()).get('/messaging').expect(200).end(function (err, res) {
            res.status.should.equal(200);
            done();
        });
    });
    it('stopping web server', function (done) {
        testing.stopServer().should.equal(true);
        done();
    });
});
