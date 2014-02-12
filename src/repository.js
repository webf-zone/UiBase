'use strict';

var utils = require('utils');

var Repository = utils.Class({

    construct: function(entityType, adapter, location) {
        var self = this;

        self._adapter = adapter;
        self._location = location;
        self._EntityType = entityType;
    },

    insert: function(entity, cb) {
        var self = this;

        self._adapter.insert(self._location, entity, self._castToEntity.bind(self, cb));
    },

    query: function(filter, cb) {
        var self = this;

        self._adapter.query(self._location, filter, self._castToEntity.bind(self, cb));
    },

    update: function(entity, cb) {
        var self = this;

        self._adapter.update(self._location, entity, cb);
    },

    remove: function(entity, cb) {
        var self = this;

        self._adapter.remove(self._location, entity, self._castToEntity.bind(self, cb));
    },

    _castToEntity: function(cb, collection) {
        var self = this;

        cb(collection.map(function(data) {
            return self._EntityType.rebuild(data);
        }));
    }
});

module.exports = Repository;
