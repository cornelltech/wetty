var bcrypt = require('bcrypt-nodejs');
var jwt    = require('jsonwebtoken');


function createHash(password){
  return bcrypt.hashSync(password);
}
 
function checkHash(hash, password){
  return bcrypt.compareSync(password, hash);
}

function generateJwt(user){
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    exp: parseInt(expiry.getTime() / 1000),
    user: user
  }, 'something_very_secret');
}

module.exports = {
  createHash,
  checkHash,
  generateJwt
};


