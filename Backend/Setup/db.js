(function() {
    "use strict";

    var
        config = require('./config'),
        MongoClient = require('mongodb').MongoClient;

    module.exports = function(callback) {
        MongoClient.connect(config.connectionString, function(err, db) {
            if (err) {
                callback(err, null);
                return;
            }

            callback(null, db);
        });
    };
})();