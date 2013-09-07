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

        js = js.reverse();

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

            if (Array.isArray(node.scripts)) {
                js.concat(node.scripts); //TODO: handle path
            } else if (typeof node.scripts === "string") {
                js.push(path + node.scripts);
            }

            if (Array.isArray(node.styles)) {
                css.concat(node.styles); //TODO: handle path
            } else if (typeof node.styles === "string") {
                css.push(path + node.styles);
            }

            resolvedNodes[nodeName] = true;

            if (Array.isArray(node.dependencies)) {
                node.dependencies.forEach(function (dependency) {
                    if (!resolvedNodes[dependency] && packages[dependency]) {
                        resolveNode(dependency);
                    }
                });
            }
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
                this.router = new ub.Router();
                try {
                    this.apps = JSON.parse(loadFile("/uibase/apps.json"));
                    this._configApps();
                    this._loadBasePackages();
                } catch (ex) {
                    throw new Error("Invalid application config");
                }
            }
        },

        _loadBasePackages: {
            value: function () {
                try {
                    this.packages = JSON.parse(loadFile("/uibase/packages.json"));
                    console.log("application config loaded... routing now");
                    this.router.route();
                } catch (ex) {
                    throw new Error("Invalid base package");
                }
            }
        },

        _loadApplicationPackages: {
            value: function (name) {
                var oThis = this,
                    app = oThis.apps[name];

                loadFile(app.appFolder + "packages.json", true, function (resp) {
                    try {
                        oThis._initApplication(JSON.parse(resp));
                    } catch (ex) {
                        console.log(ex);
                        throw new Error("Invalid application package");
                    }
                });
            }
        },

        _configApps: {
            value: function () {
                var oThis = this,
                    apps = oThis.apps,
                    router = oThis.router;

                Object.keys(apps).forEach(function (app) {
                    router.bind(apps[app].url, function () {
                        router.unbind(this.apps[app].url);
                        this._loadApplicationPackages(app);
                    }, oThis);
                });
            }
        },

        _initApplication: {
            value: function (appPkgs) {
                var oThis = this,
                    router = oThis.router;

                Object.keys(appPkgs).forEach(function (packageName) {
                    var pkg = appPkgs[packageName];

                    pkg.basePath = appPkgs.basePath;

                    if (pkg.hasOwnProperty("url")) {
                        router.bind(pkg.url, function (params) {
                            this._loadView(packageName, params);
                        }, oThis);
                    }
                });
                this.packages = mergePackages(this.packages, appPkgs);
                resolvePackage("base", this.packages, function () {
                    console.log("base loaded... routing now");
                    oThis.router.route();
                });
            }
        },

        _loadView: {
            value: function (pkgName, params) {
                var oThis = this;

                resolvePackage(pkgName, this.packages, function () {
                    console.log("view loaded with params ", params);
                    oThis.onLoad(params);
                });
            }
        },

        onLoad: {
            value: function (params) {
                loginView(params);
            },
            writable: true
        }
    });

    ub.init();

})(window.UIBase);
