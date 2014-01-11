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
        var isView = self instanceof ub.View;

        /**
         * Each view must have a root element, and the DOM events fired
         * at the root element will act as the DOM events for this
         * component.
         */
        if (isView && self.components.root) {
            self.components.root.config.events.forEach(function(eventName) {
                if (self._inPorts[eventName]) {
                    ub.Component.connect(
                        self.components.root, eventName,
                        self, eventName
                    );
                }
            });
        }
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
        return utils.extend(Object.keys(ports).reduce(function(store, portName) {
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
        }, {}), Object.keys(config.config).reduce(function(store, configName) {
            var configOptions = config.config[configName];

            /*
                If the config option is not write once (can be set after initialization)
                then create a input of that name. Make sure no custom configuration
                for this port has been provided.
             */
            if (configOptions.constant === false && !(configName in ports)) {
                store[configName] = new ub.Observer(function(val) {
                    self.config[configName] = val;
                });
            }

            return store;
        }, {}));
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

    function parseViewConfig(self, config) {
        var picture = config.picture.call(self);
        var ViewConstructor = picture.name;

        var children = picture.children ? typeof picture.children === 'string' ?
            picture.children : picture.children.map(parseViewConfig) : {};

        var configs = utils.extend({}, picture);
        delete configs.props;

        picture.props.children = children;

        return new ViewConstructor(utils.extend(configs, {
            props: utils.extend({}, picture.props, self.config.props)
        }));
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

        var isView = self instanceof ub.View;

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

        return ub.Utils.Class(classConfig);
    };

    utils.createView = function(config) {

        return ub.Utils.Class(utils.extend({

            extends: config.extends || ub.ComplexView,

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

})(window.uibase, jQuery);
