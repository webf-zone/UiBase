;(function (ub) {
    "use strict";

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


    ub.Router = function () {
        this.routes = Object.create(null);
    };

    ub.Router.prototype = {

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
                href,
                i;

            url = url || window.location.pathname;
/*
            href = window.location.href;

            if (href[href.length - 1] !== '/') {
                href += '/';
            }
*/
            //url = href.replace(ub.basePath, '');

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


})(window.uibase);
