require('./setup/db')(function(err, db) {
    "use strict";

    (function() {
        var ObjectID = require('mongodb').ObjectID;

        /* BASE MODEL */
        function BaseModel(collectionName) {
            var _collection = null;

            this.collectionName = collectionName;

            this.getCollection = function(callback) {
                if (_collection) {
                    callback(null, _collection);
                    return;
                }

                db.collection(this.collectionName, function(err, collection) {
                    if (err) {
                        callback(err, null);
                        return;
                    }

                    _collection = collection;
                    callback(null, collection);
                });
            };

            this.safeQuery = function(query) {
                if (query) {
                    return query;
                }
                return {};
            };

            this.safeOptions = function(options) {
                if (options) {
                    return options;
                }
                return {};
            };

            this.addWriteConcern = function(options) {
                options = this.safeOptions(options);
                options.w = options.w || 1;
                return options;
            };
        }

        BaseModel.prototype.getById = function(id, callback) {
            var self = this;

            this.getCollection(function(err, collection) {
                collection.findOne({ _id: new ObjectID(id) }, function(err, doc) {
                    if (err) {
                        callback(err, null);
                        return;
                    }

                    callback(null, doc);
                });
            });
        };

        BaseModel.prototype.get = function(query, options, callback) {
            var self = this;

            this.getCollection(function(err, collection) {
                query = self.safeQuery(query);
                options = self.safeOptions(options);

                collection.find(query, options).toArray(function(err, results) {
                    if (err) {
                        callback(err, null);
                        return;
                    }

                    callback(null, results);
                });
            });
        };

        BaseModel.prototype.insert = function(docs, options, callback) {
            var self = this;

            this.getCollection(function(err, collection) {
                if (err) {
                    callback(err, null);
                    return;
                }

                if (!Array.isArray(docs)) {
                    docs = [docs];
                }
                docs = docs.map(function(doc) {
                    delete doc._id;
                    return doc;
                });

                options = self.addWriteConcern(options);
                collection.insert(docs, options, function(err, insertedDocs) {
                    if (err) {
                        callback(err, null);
                        return;
                    }

                    callback(null, insertedDocs === docs.length);
                });
            });
        };

        BaseModel.prototype.update = function(doc, options, callback) {
            var self = this;

            this.getCollection(function(err, collection) {
                if (err) {
                    callback(err, null);
                    return;
                }

                var id = doc._id;
                delete doc._id;

                options = self.addWriteConcern(options);
                collection.update({ _id: new ObjectID(id) }, doc, options, function(err, updatedDocs) {
                    if (err) {
                        callback(err, null);
                        return;
                    }

                    callback(null, updatedDocs === 1);
                });
            });
        };

        BaseModel.prototype.remove = function(id, options, callback) {
            var self = this;

            this.getCollection(function(err, collection) {
                if (err) {
                    callback(err, null);
                    return;
                }

                options = self.addWriteConcern(options);
                collection.remove({ _id: new ObjectID(id) }, options, function(err, removedDocs) {
                    if (err) {
                        callback(err, null);
                        return;
                    }

                    callback(null, removedDocs === 1);
                });
            });
        };

        /* TASK */
        function Task() { }
        Task.prototype = new BaseModel('Tasks');
        module.exports.Task = new Task();
    })();
});