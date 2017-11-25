var express = require('express');
var router = express.Router();

var pool = require('../modules/pool');

var currentTable = {};

//posts currentTable to server
router.post('/currentTable', function(req,res) {
    console.log('in router.post list');
    console.log('req.body', req.body);
    currentTable.is = req.body.is
    console.log('currentTable.is =',currentTable.is);
    res.sendStatus(200);
});

//gets currentTable from database
router.get('/', function (req, res) {
    console.log('in router.get table')
    // Attempt to connect to database
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            // There was an error connecting to the database
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            // We connected to the database!!!
            // Now, we're going to GET things from thd DB
            client.query(`SELECT * FROM ${currentTable.is};`,
                            function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    // Query failed. Did you test it in Postico?
                    // Log the error
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                }
            });
        }
    });
});

module.exports = router;