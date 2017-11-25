
// pool.js
var pg = require('pg');

var config = {
    database: 'to_do_app', // the name of our database
    host: 'localhost', // where is your database (which computer)
    port: 5432, // the port number for your database, 5432 is default
    max: 10, // how many connections at one time
    idleTimeoutMillies: 30000 // 30 seconds to try to connect to our database
};

module.exports = new pg.Pool(config);