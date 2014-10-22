'use strict';
var restify = require('restify'),
    aws = require('aws-sdk'),
    crypto = require('crypto');

// configuration
var options;
try {
    options = require('./config.js');
    // check to make sure it has been edited
    if(options.AWS.ACCESS_KEY === 'YOUR_KEY_HERE'){
        throw new Error();
    }
} catch(e) {
    console.error('ERROR: Configuration is missing!');
    console.error('Make a copy of config.js.example named config.js');
    console.error('and change the options!');
    process.exit(1);
}

// initialize database & orm
var knex = require('knex')(options.DB),
    bookshelf = require('bookshelf')(knex);

// bookshelf orm uses a connection pool so lets do a quick query to
// ensure db is reachable
knex.raw('select 1+1 as result')
    .then(function (result) {
        // silent pass
    })
    .catch(function (err) {
        console.error('ERROR: Database unreachable. Make sure your database');
        console.error('server is running and your config details are correct!');
        process.exit(1);
    });

// create server & use some middleware
var server = restify.createServer();
server.use(restify.bodyParser());
server.use(restify.queryParser());
// dependency & model / route injection
var dependencyBox = {
    crypto: crypto,
    aws: aws,
    bookshelf: bookshelf,
    restify: server,
    options: options
};
var models = require('./models/index.models.js')(dependencyBox);
var routes = require('./routes/index.routes.js')(dependencyBox, models);
// start server
server.listen(options.API.port, function () {
    console.log('API now online at: %s', server.url);
});