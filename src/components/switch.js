'use strict';

var ub = require('uibase');

var Switch = ub.createComponent({

    _disposables: {},

    config: {
    },

    inputs: {
        input: {}
    },

    outputs: {
        output: true,
        destroy: true
    },

    beh: {
        input: {
            success: function(components) {
                var self = this;

                if (Array.isArray(components)) {
                    Object.keys(self._disposables).forEach(function (outputName) {
                        self._disposables[outputName].call(self);
                        delete self._disposables[outputName];
                    });

                    components.forEach(function (component) {
                        self._onInput = function () {};
                        Object.keys(component.inputs).forEach(function (inputName) {
                            if (inputName in self.inputs) {
                                var oldOnInput = self._onInput;
                                self._onInput = function () {
                                    component.inputs[inputName].onNext.apply(component, arguments);
                                    oldOnInput();
                                };
                            }
                        });
                        Object.keys(component.outputs).forEach(function (outputName) {
                            self._onOutput = function () {};
                            if (outputName in self.outputs) {
                                var oldOnOutput = self._onOutput;
                                self._onOutput = function (observer) {
                                    self._disposables[outputName] = components.outputs[outputName].subscribe(observer);
                                    oldOnOutput();
                                };
                            } else {
                                self.outputs[outputName] = new ub.Observable(function (observer) {
                                    self.outputs[outputName].write = function(type, val) {
                                        if (type === 'success') {
                                            observer.onNext(val);
                                        } else if (type === 'error') {
                                            observer.onError(val);
                                        }
                                    };
                                    if (self._onOutput) {
                                        self._onOutput(observer);
                                    }
                                });
                                var oldOnOutput = self._onOutput;
                                self._onOutput = function (observer) {
                                    self._disposables[outputName] = components.outputs[outputName].subscribe(observer);
                                    oldOnOutput();
                                };
                            }
                        });
                    });
                } else if (components instanceof ub.Component) {
                    Object.keys(components.inputs).forEach(function (inputName) {
                        if (inputName in self.inputs) {
                            self._onInput = function () {
                                components.inputs[inputName].onNext();
                            };
                        }
                    });

                    Object.keys(self._disposables).forEach(function (outputName) {
                        self._disposables[outputName].call(self);
                        delete self._disposables[outputName];
                    });
                    Object.keys(components.outputs).forEach(function (outputName) {
                        if (outputName in self.outputs) {
                            self._onOutput = function (observer) {
                                self._disposables[outputName] = components.outputs[outputName].subscribe(observer);
                            };
                        }
                    });
                }
            },
            error: function(errors) {
                return {
                    output: errors
                };
            }
        }
    },

    beforeInputConnect: function (inputName) {
        var self = this;

        if (self.inputs[inputName]) {
            return;
        }

        self.inputs[inputName] = new ub.Observer(function () {
            if (self._onInput) {
                self._onInput();
            }
        });
    },

    beforeOutputConnect: function (outputName) {
        var self = this;

        if (self.outputs[outputName]) {
            return;
        }

        self.outputs[outputName] = new ub.Observable(function (observer) {
            self.outputs[outputName].write = function(type, val) {
                if (type === 'success') {
                    observer.onNext(val);
                } else if (type === 'error') {
                    observer.onError(val);
                }
            };
            if (self._onOutput) {
                self._onOutput(observer);
            }
        });
    }
});

module.exports = Switch;
