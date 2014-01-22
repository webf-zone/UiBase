'use strict';

var $ = require('jquery');
var View = require('./view');
var HtmlElement = require('./htmlElement');
var utils = require('./utils/utils');

require('./core.css');

/* jshint boss:true */

var scripts = document.getElementsByTagName('script');

var basePath = document.getElementsByTagName('base')[0].href;

var staticPath = basePath.split('/');
staticPath[0] = window.location.protocol;
staticPath[2] = window.location.hostname;
staticPath = staticPath.join('/');

basePath = staticPath.replace(window.location.protocol + '//' + window.location.hostname, '');

function pathToRegEx (path) {
    var regX,
        pattern = '^',
        params = [];

    if (path instanceof RegExp) {
        regX = path;
    } else {

        path.split('/').forEach(function (fragment) {
            if (fragment.length > 0) {
                pattern += '\\/+';
                //TODO: add support for types
                if (fragment.charAt(0) === ':') {
                    pattern += '([a-zA-Z0-9-_~\\.%]+)';
                    params.push(fragment.slice(1));
                } else {
                    pattern += fragment;
                }
            }
        });

        if (pattern !== '^') {
            pattern += '/?$';
        } else {
            pattern += '\\/';
        }
        regX = new RegExp(pattern);
        regX._params = params;
    }

    return regX;
}


var Router = function () {
    this.routes = Object.create(null);
};

Router.prototype = {

    bind: function (path, callback, context) {
        this.routes[path] = {
            regEx: pathToRegEx(path),
            callback: context ? callback.bind(context) : callback
        };
    },

    unbind: function (path) {
        delete this.routes[path];
    },

    route: function (url) {
        var oThis = this,
            routes = oThis.routes,
            keys = Object.keys(routes),
            route,
            params,
            length,
            i;

        url = url || window.location.pathname;
        /*
         href = window.location.href;

         if (href[href.length - 1] !== '/') {
         href += '/';
         }
         */
        //url = href.replace(basePath, '');

        if (url[url.length - 1] !== '/') {
            url += '/';
        }

        for (i = 0, length = keys.length; i < length; i++) {
            route = routes[keys[i]];
            params = oThis._match(route.regEx, url);
            if (params) {
                route.callback(params);
                break;
            }
        }
    },

    _match: function (regX, path) {
        var urlParts = regX._params,
            matches = regX.exec(path),
            i = 0,
            length,
            params;

        if (matches) {
            params = {};
            length = matches.length;

            if (!urlParts) {
                for (i = 1; i < length; i++) {
                    params[i - 1] = matches[i];
                }
            }

            if (urlParts && urlParts.length > 0) {
                urlParts.forEach(function (part) {
                    if (++i < length) {
                        params[part] = decodeURIComponent(matches[i]);
                    }
                });
            }
        }

        return params;
    }
};

function loadElement(url, isScript, cb) {
    var el = document.createElement(isScript ? 'script' : 'link'),
        headEl = document.head;

    url = staticPath + url;

    if (isScript) {
        el.type = 'text/javascript';
        el.src = url;
        if (typeof cb  === 'function') {
            el.onreadystatechange = function() {
                if (this.readyState === 'complete' || this.readyState === 'loaded') {
                    cb();
                }
            };
            el.onload = cb;
        }
    } else {
        el.type = 'text/css';
        el.rel = 'stylesheet';
        el.href = url;
    }

    headEl.appendChild(el);
}

function loadCSSFiles(css) {
    var loadedCSSFiles = {};

    css.forEach(function (path) {
        if (!loadedCSSFiles[path]) {
            loadElement(path);
            loadedCSSFiles[path] = true;
        }
    });
}

function loadJSFiles(js, callback) {
    var loadedjsFiles = {},
        i = 0,
        onFileLoad;

    onFileLoad = function() {
        i++;
        if (i < js.length) {
            if (loadedjsFiles[js[i]]) {
                onFileLoad();
            } else {
                loadElement(js[i], true, onFileLoad);
            }
        } else {
            callback();
        }
    };

    loadElement(js[i], true, onFileLoad);
}

function loadFile(url, async, cb) {
    var xhr = new XMLHttpRequest();

    async = (async && typeof cb === 'function');
    xhr.open('GET', staticPath + url, async);
    if (async) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                cb(xhr.responseText);
            }
        };
    }
    xhr.send();
    return xhr.responseText;
}

var ub = {};
Object.defineProperties(ub, {
    init: {
        value: function () {
            var oThis = this;
            oThis.router = new Router();
            oThis._parseUrls(JSON.parse(loadFile('urls.json')), basePath);
        }
    },

    _parseUrls: {
        value: function(urls, parentUrl, realPath) {
            var oThis = this,
                router = this.router;

            realPath = realPath || '/';

            Object.keys(urls).forEach(function(url) {
                var routeUrl = (parentUrl ? parentUrl : '') + url;

                if (urls[url].include) {
                    router.bind(routeUrl + '.*', function() {
                        router.unbind(routeUrl + '.*');

                        var nextRealPath = realPath + urls[url].include;
                        loadFile(urls[url].include + 'urls.json', true, function (urls) {
                            oThis._parseUrls(JSON.parse(urls), routeUrl, nextRealPath);
                        });
                    });
                } else {
                    router.bind(routeUrl, function (params) {
                        this._loadView(urls[url], params, realPath);
                    }, oThis);
                }
                router.route();
            });
        }
    },

    _loadView: {
        value: function (urlEntry, params, realPath) {
            var oThis = this;

            loadJSFiles([realPath + urlEntry.url], function() {
                oThis.onLoad(window.UIBCurrentViewConstructor, params);
            });
        }
    },

    onLoad: {
        value: function (ViewConstruct, params) {
            var currentView = new ViewConstruct(params);

            $('body').html('');
            View.renderView(currentView, $('body'));
        },
        writable: true
    }
});

module.exports = utils.extend(ub, {
    utils: utils,
    View: View,
    HtmlElement: HtmlElement
});

ub.init();
