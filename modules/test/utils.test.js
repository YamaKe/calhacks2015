var testing = require('../utils');

var should = require('should'); // jshint ignore:line

describe('utils.js tests', function () {
    it('password hashing', function (done) {
        testing.comparePassword(testing.hashPassword('hashme'), 'hashme').should.equal(true);
        testing.comparePassword(testing.hashPassword('hashme'), 'nothashme').should.equal(false);

        done();
    });
    it('validate email', function (done) {
        testing.validateEmail('test@test.com').should.equal(true);
        testing.validateEmail('test@testcom').should.equal(false);
        testing.validateEmail('test@.testcom').should.equal(false);
        testing.validateEmail('test.@testcom').should.equal(false);
        testing.validateEmail('test@testcom.').should.equal(false);
        testing.validateEmail('.test@testcom').should.equal(false);
        testing.validateEmail('te.st@testcom').should.equal(false);
        testing.validateEmail('te.st@test.com').should.equal(true);
        testing.validateEmail(0).should.equal(false);
        testing.validateEmail({test: 'test'}).should.equal(false);
        testing.validateEmail([0, 1, 2]).should.equal(false);

        done();
    });
});
