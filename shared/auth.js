var bcrypt = require('bcrypt-nodejs');


function createHash(password){
  return bcrypt.hashSync(password);
}
 
function checkHash(hash, password){
  return bcrypt.compareSync(password, hash);
}

module.exports = {
  createHash,
  checkHash
};
