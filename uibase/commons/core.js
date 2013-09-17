;(function (ub) {
    "use strict";

//http://localhost/UiBase/abc/login/5/
//http://localhost/predeect/login/

    function loadElement(url, isScript, cb) {
        var el = document.createElement(isScript ? "script" : "link"),
            headEl = document.head;

        if (isScript) {
            el.type = "text/javascript";
            el.src = url;
            if (typeof cb  === "function") {
                el.onreadystatechange = function() {
                    if (this.readyState === 'complete' || this.readyState === 'loaded') {
                        cb();
                    }
                };
                el.onload = cb;
            }
        } else {
            el.type = "text/css";
            el.rel = "stylesheet";
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

    function mergePackages(pkg1, pkg2) {
        var packages = {},
            pkgName,
            props;

        for (pkgName in pkg1) {
            if (pkg1.hasOwnProperty(pkgName)) {
                packages[pkgName] = pkg1[pkgName];
            }
        }

        for (pkgName in pkg2) {
            if (pkg2.hasOwnProperty(pkgName)) {
                if (packages.hasOwnProperty(pkgName)) {
                    //merging properties
                    for (props in pkg2[pkgName]) {
                        if (pkgName !== "basePath")
                            packages[pkgName][props] = pkg2[pkgName][props];
                    }
                }  else {
                    packages[pkgName] = pkg2[pkgName];
                }
            }
        }

        return packages;
    }

    function loadFile(url, async, cb) {
        var xhr = new XMLHttpRequest();

        async = (async && typeof cb === "function");
        xhr.open("GET", url, async);
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

    function resolvePackage(pkgName, packages, callback) {
        var js = [],
            css = [],
            resolvedNodes = {};

        if (!packages.hasOwnProperty(pkgName)) {
            throw new Error("cannot find package --> " + pkgName);
        }

        function resolveNode(nodeName) {
            var node = packages[nodeName],
                path = node.basePath || packages.basePath;

            if (Array.isArray(node.dependencies)) {
                node.dependencies.forEach(function (dependency) {
                    if (!resolvedNodes[dependency] && packages[dependency]) {
                        resolveNode(dependency);
                    }
                });
            }

            if (Array.isArray(node.scripts)) {
                js = js.concat(node.scripts.map(function(script) {
                    return path + script;
                })); //TODO: handle path
            } else if (typeof node.scripts === "string") {
                js.push(path + node.scripts);
            }

            if (Array.isArray(node.styles)) {
                css.concat(node.styles); //TODO: handle path
            } else if (typeof node.styles === "string") {
                css.push(path + node.styles);
            }

            resolvedNodes[nodeName] = true;
        }

        if (packages[pkgName]) {
            resolveNode(pkgName);
        } else {
            throw new Error("Failed to resolve " + pkgName);
        }
        loadCSSFiles(css);
        loadJSFiles(js, callback);
    }


    Object.defineProperties(ub, {
        init: {
            value: function () {
                var oThis = this;
                this.router = new ub.Router();
                try {
                    this._loadBasePackages();
                    resolvePackage("base", this.packages, function () {
                        console.log("base loaded...");
                        oThis._readUrls(JSON.parse(loadFile("/uibase/urls.json")));
                    });
                } catch (ex) {
                    throw new Error("Invalid application config");
                }
            }
        },

        _readUrls: {
            value: function(urls, parentUrl) {
                var oThis = this,
                    router = this.router;

                Object.keys(urls).forEach(function(url) {
                    var routeUrl = (parentUrl ? parentUrl : "") + url;

                    if (urls[url].include) {
                        router.bind(routeUrl + ".*", function() {
                            router.unbind(routeUrl + ".*");

                            loadFile(urls[url].include + "packages.json", true, function (resp) {
                                try {
                                    oThis._readPackages(JSON.parse(resp));
                                } catch (ex) {
                                    console.log(ex);
                                    throw new Error("Invalid application package");
                                }
                            });

                            loadFile(urls[url].include + "urls.json", true, function (urls) {
                                oThis._readUrls(JSON.parse(urls), routeUrl);
                            });
                        });
                    } else {
                        router.bind(routeUrl, function (params) {
                            this._loadView(urls[url], params);
                        }, oThis);
                    }
                    router.route();
                });
            }
        },

        _readPackages: {
            value: function (appPkgs) {
                var oThis = this;

                Object.keys(appPkgs).forEach(function (packageName) {
                    var pkg = appPkgs[packageName];

                    pkg.basePath = appPkgs.basePath;
                });
                this.packages = mergePackages(this.packages, appPkgs);
            }
        },

        _loadBasePackages: {
            value: function () {
                try {
                    this.packages = JSON.parse(loadFile("/uibase/packages.json"));
                    console.log("base package loaded...");
                } catch (ex) {
                    throw new Error("Invalid base package");
                }
            }
        },

        _loadView: {
            value: function (urlEntry, params) {
                var oThis = this;

                var pkgName = urlEntry.package;

                resolvePackage(pkgName, this.packages, function () {
                    console.log("view loaded with params ", params);
                    oThis.onLoad(urlEntry.view, params);
                });
            }
        },

        onLoad: {
            value: function (view, params) {
                var ViewName = ub.Views[view];

                var currentView = new ViewName();

                $("body").append(currentView.render());
            },
            writable: true
        }
    });

    ub.init();

})(window.uibase);
