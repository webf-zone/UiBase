/*global describe, expect, it */
(function(ub) {
    "use strict";

    var utils = ub.Utils;

    describe("UIBase.Utils", function() {

        it("should have a method extend", function() {
            expect(utils.extend).to.be.a("function");
        });
    });
})(this.uibase);