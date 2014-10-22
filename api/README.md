Requirements
------------
* Node.js (latest)
* An AWS S3 bucket with the following credentials:
    * User Access Key
    * Secret Key
    * Bucket name
* One of the following SQL systems running:
    * Postgres (tested)
    * MySQL
    * SQLite3

**DO NOT** use your root AWS account information. Use [IAM](http://aws.amazon.com/iam/).

Install
-------

* `npm install`
* Open `config.js.example` and fill it out
* Once you have created the database and user, go into `/tools` and run `node db_create.js` to create the tables needed
* Run `node server.js`