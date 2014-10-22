module.exports = function routeHandler(dependencyBox, models) {
    'use strict';
    var server = dependencyBox.restify;

    // aws config cache
    var AWS_ACCESS_KEY = dependencyBox.options.AWS.S3_CLIENT_CONFIG.ACCESS_KEY;
    var AWS_SECRET_KEY = dependencyBox.options.AWS.S3_CLIENT_CONFIG.SECRET_KEY;
    var S3_BUCKET = dependencyBox.options.AWS.S3_CLIENT_CONFIG.BUCKET;
    var aws = dependencyBox.aws;

    // CORS ROUTE HANDLERS BEGIN
    server.pre(function corsMiddleware(req, res, next) {
        //TODO: change to final url/make configurable for peoples
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'content-type');
        return next();
    });
    server.opts(/\.*/, function (req, res, next) {
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'content-type');
        res.send(200);
        return next();
    });
    // CORS ROUTE HANDLERS END

    // MAIN ROUTES BEGIN
    server.get('/images', function (req, res, next) {
        // bookshelf's fetchAll surprisingly has no way to set order
        // of return set so i have to use the underlying knex query system
        dependencyBox.bookshelf.knex
            .select('*')
            .from('images')
            .orderBy('created_at', 'desc')
            .then(function (images) {
                res.send(images);
                return next();
            })
            .catch(function (err) {
                res.send(500, err);
                return next();
            });
    });

    server.get('/images/:id', function (req, res, next) {
        var id = req.params.id;
        if(!id) {
            res.send(500, 'ERROR: Must specify an image ID.');
            return next();
        }

        models.Image.forge({id: id})
            .fetch({required: true})
            .then(function (image) {
                res.send(image);
                return next();
            })
            .catch(function (err) {
                res.send(500, 'ERROR: Requested image does not exist!');
                return next();
            })
    });

    server.post('/images', function (req, res, next) {
        var file_name = req.params.file_name,
            cannonical_name = req.params.cannonical_name,
            url = req.params.url,
            type = req.params.type;

        if(!file_name || !cannonical_name || !url || !type) {
            res.send(500, "ERRPR: Require a JSON string with cannonical_name, file_name, url and type properties!");
            return next();
        }

        models.Image.forge({file_name: file_name,
            cannonical_name: cannonical_name,
            url: url,
            type: type })
            .save()
            .then(function (model) {
                res.send(model.toJSON());
                return next();
            })
            .catch(function (error) {
                res.send(500, error);
                return next();

            });
    });

    server.del('/images/:id', function (req, res, next) {
        var id = req.params.id;
        if(!id) {
            res.send(500, 'ERROR: Must specify an image ID.');
            return next();
        }

        // delete model from database
        models.Image.forge({id: id})
            .destroy()
            .then(function () {
                res.send(200);
                return next();
            })
            .catch(function (err) {
                res.send(500, 'ERROR: There was an error deleting the image from the DB.');
                return next();
            });
    });
    // MAIN ROUTES END

    // S3 SIGNING ROUTE
    // originally from taken from https://devcenter.heroku.com/articles/s3-upload-node
    server.get('/sign_s3', function(req, res, next){
        var mime_type = req.query.s3_object_type;
        var file_name = req.query.s3_object_name;
        var cannonical_name = file_name.slice( 0, file_name.lastIndexOf('.') );
        if(mime_type.indexOf('image/') !== 0) {
            res.send(400, "ERROR: Expected an image, but got a " + mime_type + " instead!");
            return next();
        }
        aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
        var s3 = new aws.S3();
        var s3_params = {
            Bucket: S3_BUCKET,
            Key: file_name,
            Expires: 60,
            ContentType: mime_type,
            ACL: 'public-read'
        };
        s3.getSignedUrl('putObject', s3_params, function(err, data){
            if(err){
                res.send(500, err)
            }
            else{
                var return_data = {
                    signed_request: data,
                    url: 'http://'+S3_BUCKET+'.s3.amazonaws.com/' + file_name,
                    file_name: file_name,
                    cannonical_name: cannonical_name,
                    mime_type: mime_type
                };
                res.write(JSON.stringify(return_data));
                res.end();
            }
        });
    });
};
