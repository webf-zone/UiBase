'use strict';

var $ = require('jquery');
var View = require('view');
var HtmlElement = require('htmlElement');
var ComplexView = require('complexView');
var utils = require('utils');
var Model = require('model');
var Repository = require('repository');
var Router = require('router');
var Observer = require('observer');
var Observable = require('observable');
var CreateHelpers = require('./utils/createHelpers');

require('./core.css');

/* jshint boss:true */

var basePath = document.getElementsByTagName('base')[0].href;

var staticPath = basePath.split('/');
staticPath[0] = window.location.protocol;
staticPath[2] = window.location.hostname;
staticPath = staticPath.join('/');

basePath = staticPath.replace(window.location.protocol + '//' + window.location.hostname, '');

var options = (window.uibase && window.uibase.options) || {};

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

            if (!options.testing) {
                oThis.router = new Router();
                oThis._parseUrls(JSON.parse(loadFile('urls.json')), basePath);
            }
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
    Utils: utils,
    View: View,
    HtmlElement: HtmlElement,
    ComplexView: ComplexView,
    Model: Model,
    Repository: Repository,
    Observer: Observer,
    Observable: Observable,
    createComponent: CreateHelpers.createComponent,
    createView: CreateHelpers.createView
});

ub.init();
