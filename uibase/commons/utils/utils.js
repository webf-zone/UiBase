(function(ub, jQuery) {
    'use strict';

    var utils = ub.Utils = {};

    utils.extend = jQuery.extend;


    var RESERVED_CONFIG_PARAMS = {
        components: true,
        connections: true,
        inPorts: true,
        outPorts: true,
        picture: true,
        construct: true,
        beh: true,
        config: true
    };

    function createComponents(self, comps) {
        return Object.keys(comps).reduce(function(store, compName) {
            var compConfig = utils.extend({}, comps[compName]),
                CompConstructor = comps[compName].name;

            delete compConfig[name];
            store[compName] = new CompConstructor(compConfig);

            return store;
        }, {});
    }

    function createConnections(self, conns) {
        return Object.keys(conns).reduce(function(store, connName) {
            var source = conns[connName][0].split('.'),
                sink = conns[connName][1].split('.'),
                sourceComp = source[0] === 'this' ? self : self.components[source[0]],
                sinkComp = sink[0] === 'this' ? self : self.components[sink[0]];

            store[connName] = ub.Component.connect(
                sourceComp, source[1],
                sinkComp  , sink[1]
            );

            return store;
        }, {});
    }

    function getBehFor(self, portName, config) {
        var behConfig = config.beh[portName];

        // TODO: Handle onError
        function onNext(beh, value) {
            var output = (beh.success.bind(self))(value);

            var next = output.next;
            if (next) {
                self._inPorts[portName]._onNext = onNext.bind(self, next);
                delete output.next;
            }

            Object.keys(output).forEach(function(outputName) {
                //TODO: Handle errors
                self._outPorts[outputName].write('success', output[outputName]);
            });
        }

        return new ub.Observer(onNext.bind(self, behConfig));
    }

    function createInPorts(self, ports, config) {
        return Object.keys(ports).reduce(function(store, portName) {
            var portConfig = ports[portName];

            if (portConfig.success) {
                store[portName] = new ub.Observer(
                    portConfig.success.bind(self),
                    portConfig.error.bind(self),
                    portConfig.complete.bind(self)
                );
            } else if (typeof portConfig === 'string') {
                var compName = portConfig.split('.')[0],
                    compPort = portConfig.split('.')[1];

                if (!(compName in self.components)) {
                    throw new Error('createInPorts(): No such component defined: ' + compName);
                } else {
                    // TODO: Check for valid port
                    store[portName] = self.components[compName].inPorts[compPort];
                }
            } else {
                store[portName] = getBehFor(self, portName, config);
            }

            return store;
        }, {});
    }

    function createOutPorts(self, ports) {
        self._outPorts = self._outPorts || {};

        return Object.keys(ports).reduce(function(store, portName) {
            var portConfig = ports[portName];

            if (portConfig === true) {
                store[portName] = new ub.Observable(function(observer) {
                    self._outPorts[portName].write = function(type, val) {
                        if (type === 'success') {
                            observer.onNext(val);
                        } else if (type === 'error') {
                            observer.onError(val);
                        }
                    };
                });
            } else if (typeof portConfig === 'function') {
                store[portName] = new ub.Observable(
                    portConfig.bind(self)
                );
            } else {
                var compName = portConfig.split('.')[0],
                    compPort = portConfig.split('.')[1];

                if (!(compName in self.components)) {
                    throw new Error('createInPorts(): No such component defined: ' + compName);
                } else {
                    // TODO: Check for valid port
                    store[portName] = self.components[compName].outPorts[compPort];
                }
            }

            return store;
        }, {});
    }

    function parseViewConfig(config) {
        var ViewConstructor = config.picture.name;

        return new ViewConstructor({
            props: utils.extend({}, config.picture.props, config.picture.children.map(parseViewConfig))
        });
    }

    function removeReservedConfigParams(config) {
        var cleanConfig = utils.extend({}, config);

        Object.keys(RESERVED_CONFIG_PARAMS).forEach(function(configName) {
            delete cleanConfig[configName];
        });

        return cleanConfig;
    }

    function createProperties(self, config, instanceConfig) {
        self.components = createComponents(self, config.components || {});

        self.connections = createConnections(self, config.connections || {});

        self._inPorts = createInPorts(self, config.inPorts || {}, config);
        self._outPorts = createOutPorts(self, config.outPorts || {});

        self.config = {};

        Object.keys(config.config).forEach(function(configName) {
            var localConfig = config.config;

            var optional = localConfig[configName].optional || false;

            instanceConfig = instanceConfig || {};

            if (!optional && typeof instanceConfig[configName] === 'undefined') {
                throw new Error('Missing required configuration: ' + configName);
            }

            if (typeof instanceConfig[configName] !== 'undefined' &&
                localConfig[configName].assert &&
                !localConfig[configName].assert.call(self, instanceConfig[configName])) {
                throw new Error('Assertion failed for configuration parameter: ' + configName);
            }

            self.config[configName] = instanceConfig[configName] || localConfig[configName].default;
        });

        if (typeof config.construct === 'function') {
            config.construct.call(self, instanceConfig);
        }
    }

    utils.createComponent = function(config) {

        config = config || {};

        var classConfig = utils.extend({

            extends: config.extends || ub.Component,

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
            }
        }, removeReservedConfigParams(config));

        console.log(classConfig);

        return ub.Utils.Class(classConfig);
    };

    utils.createView = function(config) {

        return ub.Utils.Class(utils.extend({

            extends: config.extends || ub.ComplexView,

            construct: function() {
                var self = this;

                self._super();
                createProperties(self, config);
            },

            render: function() {
                return parseViewConfig(config);
            }
        }, removeReservedConfigParams(config)));
    };

})(window.uibase, jQuery);
