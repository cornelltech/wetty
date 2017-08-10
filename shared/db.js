const pg      = require('pg');
var session   = require('express-session');
var pgSession = require('connect-pg-simple')(session);

// create a config to configure both pooling behavior
// and client options
// note: all config is optional and the environment variables
// will be read if the config is not present
var config = {
  user: 'postgres', //env var: PGUSER
  database: 'wetty', //env var: PGDATABASE
  password: 'awesomesauce', //env var: PGPASSWORD
  host: 'db', // Server hosting the postgres database
  port: 5432, //env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};

//this initializes a connection pool
//it will keep idle connections open for 30 seconds
//and set a limit of maximum 10 idle clients
const pool = new pg.Pool(config);

pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool
  // the pool itself will emit an error event with both the error and
  // the client which emitted the original error
  // this is a rare occurrence but can happen if there is a network partition
  // between your application and the database, the database restarts, etc.
  // and so you might want to handle it and at least log it out
  console.error('idle client error', err.message, err.stack);
});

module.exports.pgSession = new pgSession({
  pool: pool,
  tableName: "session" });

//export the query method for passing queries to the pool
function query(text, values, callback) {
  console.log('query:', text, values);
  return pool.query(text, values, callback);
};
module.exports.query = query;

// the pool also supports checking out a client for
// multiple operations, such as a transaction
module.exports.connect = function (callback) {
  return pool.connect(callback);
};

module.exports.setupdb = function () {
  query("CREATE TABLE users ( username varchar(40) PRIMARY KEY, data json )", [], function(err, res) {
    if(err) {
      return console.error('error running query', err);
    }
  });
  query("INSERT INTO users VALUES ('scot', '{ \"hello\": \"some stuff\"}')", [], function(err, res) {
    if(err) {
      return console.error('error running query', err);
    }
  });
}

module.exports.addUser = function(user, data){
  query("INSERT INTO users VALUES ($1::varchar, $2::json)", [user, data], function(err, res) {
    if(err) {
      return console.error('error running query', err);
    }
  });
}
function updateUser(user, newData){
  query("UPDATE users SET data = $1::json WHERE username = $2::varchar", [newData, user], function(err, res) {
    if(err) {
      return console.error('error running query', err);
    }
  });
}
module.exports.updateUser = updateUser;
module.exports.addChapter = function(user, chapter){
  getUser(user, function(user_data){
    console.log(user_data.available_chapters);
    user_data.available_chapters.push(chapter);
    updateUser(user, user_data);
  });
}


function getAllUsers(onSuccess){
  query("SELECT data FROM users", function(err, res) {
    if(err) {
      return console.error('error running query', err);
    }
    if(res.rows){
      onSuccess(res.rows);
    }else{
      onSuccess(false);
    }
  });
}
module.exports.getAllUsers = getAllUsers;
  
function getUser(user, onSuccess){
  query("SELECT data FROM users WHERE username = $1", [user], function(err, res) {
    if(err) {
      return console.error('error running query', err);
    }
    if(res.rows[0]){
      onSuccess(res.rows[0].data);
    }else{
      onSuccess(false);
    }
  });
}
module.exports.getUser = getUser;
function getChapters(onSuccess){
  query("SELECT * FROM chapters", function(err, res) {
    if(err) {
      return console.error('error running query', err);
    }
    onSuccess(res.rows.map(function (x){ return x.name }));
  });
}
module.exports.getChapters = getChapters;
