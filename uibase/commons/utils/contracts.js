(function(ub) {
    "use strict";

    var utils = ub.Utils;

    // Creates a contract for a value of type s
    var typeOf = function(s) {
        return function(v) {
            if (typeof v !== s) {
                throw new TypeError("Expected a" + (s === "object" ? "n" : "") + s + ".");
            }
            return v;
        };
    };

    utils.func = typeOf("function");
    utils.str = typeOf("string");
    utils.obj = typeOf("object");
    utils.bool = typeOf("boolean");
    utils.num = typeOf("number");

    // Creates a contract for an object inheriting from ctor
    utils.instanceOf = function(ctor) {
        return function(inst) {
            if (!(inst instanceof ctor)) {
                throw new TypeError("Expected an instance of " + ctor);
            }
            return inst;
        };
    };

    // Asserts n is a signed 32-bit number
    utils.int32 = function(n) {
        if ((n | 0) !== n) {
            throw new TypeError("Expected a 32-bit integer.");
        }
        return n;
    };

    // Asserts int32 and nonnegative
    utils.nat32 = function(n) {
        if ((n | 0) !== n || n < 0) {
            throw new TypeError("Expected a 32-bit natural.");
        }
        return n;
    };

    // Creates a contract for an array whose
    // elements all satisfy the contract c
    utils.arrOf = function(c) {
        utils.func(c);
        return function(a) {
            return utils.arr(a).map(function(x) {
                return c(x);
            });
        };
    };
})(window.uibase);