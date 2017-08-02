var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var auth = require('./../shared/auth');

describe('CreateHash', function() {
  it('createHash(pw) should return a string', function() {
    var pw = "testPassword";
    var hash = auth.createHash(pw);
    expect(hash).to.be.a('string');
  });
});
describe('CheckHash', function() {
  it('checkHash() should return true if sent with correct hash and false otherwise', function() {
    var pw = "testPassword";
    var falsePw = 'wrongPw';
    var hash = auth.createHash(pw);
    expect(auth.checkHash(hash, pw)).to.be.true;
    expect(auth.checkHash(hash, falsePw)).to.be.false;
  });
});
