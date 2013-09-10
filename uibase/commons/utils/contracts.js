(function(ub) {
    "use strict";

    var utils = ub.Utils;

    var getClassName = Function.prototype.call.bind({}.toString);

    var classOf = function(s) {
        return function(v) {
            if (getClassName(v) !== "[object " + s + "]") {
                throw new TypeError("Expected " + s);
            }
            return v;
        };
    };

    utils.error = function(e) {
        return (console && typeof console.error === "function") ? console.error(e.message) : 0;
    };

    utils.arr = classOf("Array");
    utils.date = classOf("Date");
    utils.re = classOf("RegExp");

    // Creates a contract for a value of type s
    var typeOf = function(s) {
        return function(v) {
            if (typeof v !== s) {
                utils.error(new TypeError("Expected a " + (s === "object" ? "n" : "") + s + "."));
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
            var msg = msg || "Expected an instance of " + ctor.prototype.constructor;
            if (!(inst instanceof ctor)) {
                utils.error(new TypeError(msg));
            }
            return inst;
        };
    };

    // Asserts n is a signed 32-bit number
    utils.int32 = function(n) {
        if ((n | 0) !== n) {
            utils.error(new TypeError("Expected a 32-bit integer."));
        }
        return n;
    };

    // Asserts int32 and nonnegative
    utils.nat32 = function(n) {
        if ((n | 0) !== n || n < 0) {
            utils.error(new TypeError("Expected a 32-bit natural."));
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
