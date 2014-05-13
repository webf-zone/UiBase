'use strict';

var LocalStorage = (function() {

    var serialize = function(data) {
        return JSON.stringify(data);
    };

    var parse = function(data) {
        return JSON.parse(data);
    };

    var read = function(location) {
        var value = localStorage.getItem(location);

        return value;
    };

    var write = function(location, value) {
        localStorage.setItem(location, value);
    };

    var insert = function(location, entity, cb) {
        var entityCollection = parse(read(location)) || [],
            entityValue = entity.get();

        entityCollection.push(entityValue);
        write(location, serialize(entityCollection));

        cb(entityCollection);
    };

    var remove = function(location, entity, cb) {
        var entityCollection = parse(read(location)) || [];

        var idx = -1;

        entityCollection.some(function(en, i) {
            if (entity.isIdenticalTo(en)) {
                idx = i;
            }
        });
        
        entityCollection.splice(idx, 1);

        write(location, serialize(entityCollection));

        cb(entityCollection);
    };

    var query = function(location, filter, cb) {
        var entityCollection = parse(read(location)) || [];

        cb(entityCollection);
    };

    return {
        insert: insert,
        remove: remove,
        query: query
    };
}());

module.exports = LocalStorage;
