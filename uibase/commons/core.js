/*
 * UIBase Web Application Front-end Framework - Core
 * <http://www.uibase.net> | License: <http://www.uibase.net/license>
 * Copyright 2009-2013 Usable Bytes Pvt Ltd
 * @author Kumar Bhot <http://www.webuiarchitect.com>
 *
 */

;(function($u) {
"use strict";

var UIBase = function() {};

if (typeof $u === "undefined") {

    UIBase.prototype = {
        //set environment
        initialize: function() {
            var oThis = this,
                oUrl = oThis.parseUrl(window.location),
                corePackages = JSON.parse(oThis.Utils
                        .readFile("/uibase/packages.json"));

            console.log(oUrl);
            
            if (typeof oUrl.path.page !== "undefined") {
                oThis.pathInfo = oUrl;
                oThis.prepareBase(corePackages);
            }
        },

        prepareBase: function(oPkg) {
            var oThis = this;

            oThis.Utils.loadPackage(oPkg, "base");
        },

        onUIBaseReady: function() {
            //$u;
        },

        //interpret the url
        parseUrl: function(loc) {
            var arrPath = [],
                lenArrPath = 0,
                oPath = {},
                arrParams = [],
                oParams = {},
                sUrlParams = '';

            if (typeof loc === "object") {
                arrPath = $u.ArrayUtils.trimAll(loc.pathname.split('/'));
                lenArrPath = arrPath.length;
                sUrlParams = loc.search;

                //path
                switch (lenArrPath) {
                    case 0:
                        oPath = {
                            "app": "default",
                            "page": "default"
                        };
                        
                        break;
                    case 1:
                        oPath = {
                            "app": arrPath[0],
                            "page": "default"
                        };
                        
                        break;
                    case 2:
                        oPath = {
                            "app": arrPath[0],
                            "page": arrPath[1]
                        };
                        
                        break;
                    default:
                        oPath = {
                            "app": arrPath[0],
                            "module": arrPath[1],
                            "page": arrPath[2]
                        };
                        
                        if (lenArrPath > 3) {
                            arrPath.splice(3).forEach(function(e, i) {
                                sUrlParams += "&uibase_param_" +
                                        i + "=" + e + "&";
                            });
                        }
                        
                        break;
                }
                
                arrParams = $u.ArrayUtils.trimAll
                                (sUrlParams.replace('?', '').split('&'));

                //query params
                arrParams.forEach(function(i) {
                    var arrParam = i.split('='),
                        sKey = arrParam[0],
                        sVal = arrParam[1];

                    oParams[sKey] = sVal;
                });

                return {
                    "path": oPath,
                    "params": oParams
                };
            }/* else if (typeof loc === "string") {
                //TODO:
            } else {
                //TODO: throw exception
            }*/
        }
    };

    $u = new UIBase();

    $u.ArrayUtils = {
        "trimAll": function(arr) {
            var retArr = [];

            arr.forEach(function(i) {
                if (typeof i !== "undefined" && i !== '') {
                    retArr.push(i);
                }
            });

            return retArr;
        }
    };
    
    $u.Utils = {
        "readFile": function(sPath) {
            var xhr = new XMLHttpRequest();
            
            xhr.open("GET", sPath, false);
            xhr.send();
            
            return xhr.responseText;
        },
        
        "loadPackage": function(oPkg, sPkg) {
            //var scripts, markup, styles, dependencies,
            var    curPkg, targetPkg, basePath;
                
            if (typeof oPkg === "object") {
                basePath = oPkg.basePath;
                targetPkg = oPkg[sPkg];
                
                //basePath, targetPkg must exist
                if (typeof basePath !== "undefined" &&
                        typeof targetPkg === "object") {
                        
                    Object.keys(targetPkg).forEach(function(i) {
                        curPkg = targetPkg[i];
                        
                        switch (i) {
                            case "dependencies":
                                if (typeof curPkg === "string") {
                                    $u.Utils.loadPackage(oPkg, curPkg);
                                } else if (Array.isArray(curPkg)) {
                                    curPkg.forEach(function(p) {
                                        $u.Utils.loadPackage(oPkg, p);
                                    });
                                }
                                
                                break;
                            case "markup":
                                
                                
                                break;
                            case "scripts":
                                if (typeof curPkg === "string") {
                                    $u.Utils.loadScript(curPkg, basePath);
                                } else if (Array.isArray(curPkg)) {
                                    curPkg.forEach(function(p) {
                                        $u.Utils.loadScript(p, basePath);
                                    });
                                }
                            
                                break;
                            case "styles":
                                if (typeof curPkg === "string") {
                                    $u.Utils.loadStyle(curPkg, basePath);
                                } else if (Array.isArray(curPkg)) {
                                    curPkg.forEach(function(p) {
                                        $u.Utils.loadStyle(p, basePath);
                                    });
                                }
                                
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
        },
        
        //load single script file
        "loadScript": function(file, sPath) {
            var eleScript = document.createElement("script"),
                docHead = document.getElementsByTagName("head")[0];
                
            if (typeof file === "string") {
                eleScript.src = sPath + file;
                docHead.appendChild(eleScript);
            } else if (Array.isArray(file)) {
                file.forEach(function(f) {
                    eleScript.src = sPath + f;
                    docHead.appendChild(eleScript);
                });
            }
        },
        
        //load single stylesheet
        "loadStyle": function(file, sPath) {
            var eleStyle = document.createElement("link"),
                docHead = document.getElementsByTagName("head")[0];
                
            if (typeof file === "string") {
                eleStyle.type = "text/css";
                eleStyle.rel = "stylesheet";
                eleStyle.href = sPath + file;
                docHead.appendChild(eleStyle);
            } else if (Array.isArray(file)) {
                file.forEach(function(f) {
                    eleStyle.type = "text/css";
                    eleStyle.rel = "stylesheet";
                    eleStyle.href = sPath + f;
                    docHead.appendChild(eleStyle);
                });
            }
        }
    };

    window.uibase = $u;
    $u.initialize();

}
})(window.uibase);
