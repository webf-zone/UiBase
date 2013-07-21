/*global describe, expect, it */
(function(ub) {
    "use strict";

    var utils = ub.Utils;

    //Helpers

    function getHelpers() {
        var Animal = utils.Class({
            init: function() {
                this.constructor.count++;
                this.eyes = false;
            },

            static: {
                count: 0,
                test: function() {
                    return this.match ? true : false;
                }
            }
        });

        var Dog = utils.Class({
            extends: Animal,

            init: function() {
                this._super();
            },
            talk: function() {
                return "Woof";
            },
            static: {
                match : /abc/
            }
        });

        return {
            Animal: Animal,

            Dog: Dog
        };
    }

    describe("UIBase.Utils.Class", function() {
        it("should be a function", function() {
            expect(utils.Class).to.be.a("function");
        });

        it("should return a new class with static and instance properties passed as configuration", function() {
            var helpers = getHelpers();

            new helpers.Animal();
            new helpers.Animal();

            expect(helpers.Animal.count).to.equal(2);
        });

        it("should support inherting static and instance properties", function() {
            var helpers = getHelpers();

            new helpers.Dog();
            new helpers.Animal();
            new helpers.Animal();

            expect(helpers.Animal.count).to.equal(2);
            expect(helpers.Dog.count).to.equal(1);
        });

        it("should allow adding new members to child classes without affecting parent class", function() {
            var helpers = getHelpers();

            new helpers.Dog();
            new helpers.Animal();
            new helpers.Animal();

            expect(helpers.Dog).to.have.property("match");
            expect(helpers.Animal).to.not.have.property("match");
            expect(helpers.Dog.test()).to.be.true;
            expect(helpers.Animal.test()).to.be.false;
        });
    });
})(this.uibase);