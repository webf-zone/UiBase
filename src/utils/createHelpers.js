'use strict';

var jQuery = require('jquery');
var Class = require('./class');
var Component = require('component');
var HtmlElement = require('htmlElement');
var ComplexView = require('complexView');
var View = require('view');
var Observable = require('observable');
var Observer = require('observer');

var extend = jQuery.extend;

var RESERVED_CONFIG_PARAMS = {
    components: true,
    connections: true,
    inputs: true,
    outputs: true,
    picture: true,
    construct: true,
    beh: true,
    config: true
};

function createComponents(self, comps) {
    return Object.keys(comps).reduce(function(store, compName) {
        var compConfig = extend({}, comps[compName]),
            CompConstructor = comps[compName].name;

        delete compConfig.name;
        store[compName] = new CompConstructor(compConfig);

        return store;
    }, {});
}

function createConnections(self, conns) {
    /**
     * Each view must have a root element, and the DOM events fired
     * at the root element will act as the DOM events for this
     * component.
     *
     * Check View.renderView function.
     */

    return Object.keys(conns).reduce(function(store, connName) {
        var source = conns[connName][0].split('.'),
            sink = conns[connName][1].split('.'),
            sourceComp = source[0] === 'this' ? self : self.components[source[0]],
            sinkComp = sink[0] === 'this' ? self : self.components[sink[0]];

        store[connName] = Component.connect(
            sourceComp, source[1],
            sinkComp  , sink[1]
        );

        return store;
    }, {});
}

function getBehFor(self, portName, config) {
    var behConfig = config.beh[portName];

    // TODO: Handle onError
    function onNext(beh, port, value) {
        var output,
            next;

        if (typeof beh === 'function') {
            output = (beh.bind(self))(value);
        } else if (typeof beh.success === 'function') {
            output = (beh.success.bind(self))(value);
        }

        output = output === undefined ? {} : output;

        next = output.next;
        if (next) {
            if (next.success) {
                self.inputs[port]._onNext = onNext.bind(self, next, port);
            } else {
                Object.keys(next).forEach(function(inputName) {
                    if (inputName in self.inputs) {
                        self.inputs[inputName]._onNext = onNext.bind(self, next[inputName], inputName);
                    }
                });
            }

            delete output.next;
        }

        Object.keys(output).forEach(function(outputName) {
            if (outputName === 'picture' && self instanceof View) {
                self._viewState = extend(self._viewState, output[outputName]);
                View.enqueueUpdate(self);
            } else {
                //TODO: Handle errors
                self.outputs[outputName].write('success', output[outputName]);
            }
        });
    }

    return new Observer(onNext.bind(self, behConfig, portName));
}

function createInPorts(self, ports, config) {
    config.config = config.config || {};

    return extend(Object.keys(ports).reduce(function(store, portName) {
        var portConfig = ports[portName];

        if (portConfig.success) {
            store[portName] = new Observer(
                portConfig.success.bind(self),
                portConfig.error.bind(self),
                portConfig.complete.bind(self)
            );
        } else if (typeof portConfig === 'string') {
            var compName = portConfig.split('.')[0],
                compPort = portConfig.split('.').slice(1).join('.');

            if (!(compName in self.components)) {
                throw new Error('createInPorts(): No such component defined: ' + compName);
            } else {
                // TODO: Check for valid port
                if (self.components[compName] instanceof HtmlElement) {
                    self.components[compName].addInput(compPort);
                }
                store[portName] = self.components[compName].inputs[compPort];
            }
        } else {
            store[portName] = getBehFor(self, portName, config);
        }

        return store;
    }, {}), Object.keys(config.config).reduce(function(store, configName) {
        var configOptions = config.config[configName];

        /*
         If the config option is not write once (can be set after initialization)
         then create a input of that name. Make sure no custom configuration
         for this port has been provided.
         */
        if (configOptions.constant === false && !(configName in config.beh)) {
            store[configName] = new Observer(function(val) {
                self.config[configName] = val;
            });
        }

        return store;
    }, {}), {
        props: (function() {
            if (self.components.root) {
                return self.components.root.inputs.props;
            }

            return new Observer(function(partialProps) {
                if (self.components.root) {
                    var obv = new Observable(function(observer) {
                        this.write = function(val) {
                            observer.onNext(val.value);
                            val.dispose();
                        };
                    });

                    var dispose = obv.subscribe(self.components.root.inputs.props);

                    obv.write({ value: partialProps, dispose: dispose });
                }
            });
        }())
    });
}

function createOutPorts(self, ports) {
    self.outputs = self.outputs || {};

    return Object.keys(ports).reduce(function(store, portName) {
        var portConfig = ports[portName];

        if (portConfig === true) {
            store[portName] = new Observable(function(observer) {
                self.outputs[portName].write = function(type, val) {
                    if (type === 'success') {
                        observer.onNext(val);
                    } else if (type === 'error') {
                        observer.onError(val);
                    }
                };
            });
        } else if (typeof portConfig === 'function') {
            store[portName] = new Observable(
                portConfig.bind(self)
            );
        } else {
            var compName = portConfig.split('.')[0],
                compPort = portConfig.split('.').slice(1).join('.');

            if (!(compName in self.components)) {
                throw new Error('createInPorts(): No such component defined: ' + compName);
            } else {
                // TODO: Check for valid port
                if (self.components[compName] instanceof HtmlElement) {
                    self.components[compName].addOutput(compPort);
                }
                store[portName] = self.components[compName].outputs[compPort];
            }
        }

        return store;
    }, {});
}

function parseViewConfig(self, config) {
    var picture = config.picture.call(self, self._viewState);

    if (picture instanceof View) {
        return picture;
    }

    var ViewConstructor = picture.name;

    var children = picture.children ? typeof picture.children === 'string' ?
        picture.children : picture.children.map(parseViewConfig.bind(self, self)) : undefined;

    var configs = extend({}, picture);
    delete configs.children;

    picture.props.children = children;

    return new ViewConstructor(configs);
}

function removeReservedConfigParams(config) {
    var cleanConfig = extend({}, config);

    Object.keys(RESERVED_CONFIG_PARAMS).forEach(function(configName) {
        delete cleanConfig[configName];
    });

    return cleanConfig;
}

function createProperties(self, config, instanceConfig) {
    self.components = createComponents(self, config.components || {});

    self.inputs = createInPorts(self, config.inputs || {}, config);
    self.outputs = createOutPorts(self, config.outputs || {});

    self.connections = createConnections(self, config.connections || {});

    self.config = {};

    var isView = self instanceof View;

    if (isView)
        config.config.props = {
            optional: true,
            default: {}
        };

    /**
     * Iterate over the config options that this component can accepts
     * and populate them for the current instance using the instance
     * configuration.
     */
    Object.keys(config.config).forEach(function(configName) {
        var localConfig = config.config;

        var optional = localConfig[configName].optional || false;

        instanceConfig = instanceConfig || {};

        /**
         * If the configuration options is mandatory and it has not been
         * passed for the instance, throw and error.
         */
        if (!optional && typeof instanceConfig[configName] === 'undefined') {
            throw new Error('Missing required configuration: ' + configName);
        }

        if (typeof instanceConfig[configName] !== 'undefined' &&
            localConfig[configName].type &&
            typeof instanceConfig[configName] !== localConfig[configName].type) {
            throw new TypeError('Expected ' + configName + ' to be of type ' + localConfig[configName].type);
        }

        if (typeof instanceConfig[configName] !== 'undefined' &&
            localConfig[configName].assert &&
            !localConfig[configName].assert.call(self, instanceConfig[configName])) {
            throw new Error('Assertion failed for configuration parameter: ' + configName);
        }

        self.config[configName] = instanceConfig[configName] !== undefined ?
            instanceConfig[configName] : localConfig[configName].default;

        // Send IIP
        if (configName in self.inputs || configName === 'props') {
            var obv = new Observable(function(observer) {
                this.write = function(val) {
                    observer.onNext(val.value);
                    val.dispose();
                };
            });

            var dispose = obv.subscribe(self.inputs[configName]);

            obv.write({ value: self.config[configName], dispose: dispose });
        }
    });

    self._viewState = extend(true, {}, self.config);

    if (typeof config.construct === 'function') {
        config.construct.call(self, instanceConfig);
    }
}

var createComponent = function(config) {

    config = config || {};

    var classConfig = extend({

        extends: config.extends || Component,

        construct: function(instanceConfig) {
            var self = this,
                pConfig;

            /**
             * parentConfig is a configuration option of type function,
             * which returns the configuration options required for
             * the parent (by inheritance) component.
             * The function takes the component instance configuration
             * as parameter.
             */
            if (config.parentConfig) {
                pConfig = config.parentConfig(instanceConfig);
            } else {
                pConfig = instanceConfig;
            }

            self._super(pConfig);
            createProperties(self, config, instanceConfig);
        }
    }, removeReservedConfigParams(config));

    return Class(classConfig);
};

var createView = function(config) {

    return Class(extend({

        extends: config.extends || ComplexView,

        construct: function(instanceConfig) {
            var self = this,
                pConfig;

            if (config.parentConfig) {
                pConfig = config.parentConfig(instanceConfig);
            } else {
                pConfig = instanceConfig;
            }

            self._super(pConfig);
            createProperties(self, config, instanceConfig);
        },

        render: function() {
            return parseViewConfig(this, config);
        }
    }, removeReservedConfigParams(config)));
};

module.exports = {
    createComponent: createComponent,
    createView: createView
};
