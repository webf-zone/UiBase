'use strict';

var utils = require('utils');

var Model = utils.Class({

    construct: function() {
        var self = this;

        self._attributes = {};

        Object.keys(self.defaults).forEach(function(prop) {
            self._attributes[prop] = self.defaults[prop];
        });

        Object.seal(self._attributes);
    },

    _setAttribute: function(key, value) {
        var self = this;

        if (!(key in self._attributes)) {
            throw new Error('The key does not belong to this Model -> ' + key);
        }

        self._attributes[key] = value;
    },

    set: function(key, value) {
        var self = this,
            map = {},
            isMap = false;

        isMap = typeof key === 'object' && value === undefined;

        if (isMap) {
            map = key;
            Object.keys(map).forEach(function(k) {
                self._setAttribute(k, map[k]);
            });
        } else {
            self._setAttribute(key, value);
        }
    },

    get: function() {
        var self = this,
            toReturnAllAttributes = (arguments.length === 0),
            attrName,
            returnValue;

        if (toReturnAllAttributes) {
            returnValue = self._attributes;
        } else {
            attrName = arguments[0];
            returnValue = self._attributes[attrName];
        }

        return returnValue;
    },

    /**
     * Entities compare by identity, not by attributes.
     * Must be overridden.
     *
     * @param other The other entity.
     * @return true if the identities are the same, regardless of other attributes.
     */
    isIdenticalTo: function(other) {
        return (this === other);
    }
});

module.exports = Model;
