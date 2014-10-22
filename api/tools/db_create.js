var options;
try {
    options = require('../config');
} catch(e) {
    console.error('ERROR: Configuration is missing!');
    console.error('Make a copy of config.js.example named config.js');
    console.error('and change the options!');
    process.exit(1);
}

var knex = require('knex')(options.DB);

// since knex uses connection pool, need to fake a query to check if sql if reachable
knex.raw('select 1+1 as result')
    .then(function (result) {
        // it worked... silent pass!
    })
    .catch(function () {
        console.log('ERROR: Could not access your database. Check the config and make sure SQL is running!');
        process.exit(1);
    });

// create tables
knex.schema
    .createTable('images', function (table) {
        table.increments(); // pk / id
        table.string('file_name', 30).notNullable().unique();
        table.string('cannonical_name', 30).notNullable().unique();
        table.string('url').notNullable().unique();
        table.string('type', 3).notNullable();
        table.timestamps();
    })
    .then(function () {
        console.log('All tables created!');
        knex.destroy();
    })
    .catch(function (error) {
        console.log('There was an error creating the tables:');
        console.log(error);
        knex.destroy();
    });
