(function() {
    "use strict";

    var models = require('./models.js');

    module.exports = function(app) {
        app.use(require('./setup/express').setupHeaders);

        app.get('/', function(req, res, next) {
            res.status(200).send('Welcome to the mean-tasks API.');
        });

        app.get('/tasks/:id?', function(req, res, next) {
            var id = req.params.id;
            if (id) {
                models.Task.getById(id, function(err, result) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).json(result);
                });
            }
            else {
                models.Task.get({}, {}, function(err, results) {
                    if (err) {
                        return next(err);
                    }
                    res.json(results);
                });
            }
        });

        app.post('/tasks', function(req, res, next) {
            models.Task.insert(req.body, function(err, result) {
                if (err) {
                    return next(err);
                }
                res.status(201).end();
            });
        });

        app.put('/tasks', function(req, res, next) {
            models.Task.update(req.body, {}, function(err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).end();
            });
        });

        app.delete('/tasks/:id', function(req, res, next) {
            models.Task.remove(req.params.id, {}, function(err, result) {
                if (err) {
                    return next(err);
                }
                res.status(200).end();
            });
        });
    };
})();