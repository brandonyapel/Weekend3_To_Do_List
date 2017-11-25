//requires in express allowsus to use express functionality as app
var express = require('express');
var app = express();

//requires in body-paser allows us to use body parser to send data to route functions
var bodyParser = require('body-parser');

//sets port to 5000
var port = 5000;

//Makes body Parser work
app.use(bodyParser.urlencoded({ extended: true}));

//links blank url to our public directory and displays index.html
app.use(express.static('server/public'));



app.listen(port,function(){
    console.log('starting up server');
    console.log('listening on port',port);
});