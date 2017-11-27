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

router.delete('/:id', function (req, res) {
    var listItemToRemove = req.params.id;
    // Attempt to connect to database
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            // There was an error connecting to the database
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            // We connected to the database!!!
            // Now, we're going to GET things from thd DB
            client.query(`DELETE FROM ${currentTable.is} WHERE id=$1;`, [listItemToRemove], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    // Query failed. Did you test it in Postico?
                    // Log the error
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});


router.post('/', function (req, res) {
    var $tracker = 0;
    currentTable = req.body
    var sqlQueryString = '';
    sqlQueryString += `INSERT INTO ${currentTable.is}` 
    sqlQueryString += "(completion_status"
    for (let index = 2; index < currentTable.columnNames.length; index++) {
        sqlQueryString += `, ${currentTable.columnNames[index]}`;
    };
    sqlQueryString += ') '//end INSERT INTO
    sqlQueryString += "VALUES ('n'";
    for (let index = 0; index < currentTable.newItem.length; index++) {
        $tracker++
        sqlQueryString += ' , $'+$tracker;
    };
    sqlQueryString += ');';
    console.log(sqlQueryString);

    var sqlCleanserArray = [];
    for (let index = 0; index < currentTable.newItem.length; index++) {
        sqlCleanserArray.push(currentTable.newItem[index]);
    };
    console.log(sqlCleanserArray);
    // Attempt to connect to database
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            // There was an error connecting to the database
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            // We connected to the database!!!
            // Now, we're going to GET things from thd DB
            client.query(sqlQueryString, sqlCleanserArray, function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    // Query failed. Did you test it in Postico?
                    // Log the error
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(201);
                }
            });
        }
    });
});

router.put('/:id', function (req, res) {
    console.log('in router.put')
    var itemIDToCheck = req.params.id;
    // Attempt to connect to database
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            // There was an error connecting to the database
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            // We connected to the database!!!
            // Now, we're going to GET things from thd DB
            client.query(`UPDATE ${currentTable.is} SET completion_status=$1 WHERE id=$2;`, [req.body.completionStatus, itemIDToCheck], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    // Query failed. Did you test it in Postico?
                    // Log the error
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    });
});



module.exports = router;