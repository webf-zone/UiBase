var //static = require("node-static"),
    http = require("http"),
    //util = require("util"),
    webroot = "",
    //file = new (static.Server)(webroot, {
    //    cache: 600,
    //    headers: {"X-Powered-By": "node-static"}
    //}),
    port = 8000;

http.createServer(function(req, res) {
    var sUrl = req.url,
        oUrl = {},
        arrPath = sUrl.split('/').filter(function(i) {return i !== ''}),
        oPath = {
            0: {
                "view": "default"
            },
            1: {
                "view": arrPath[0]
            },
            2: {
                "app": arrPath[0],
                "view": arrPath[1]
            },
            3: {
                "app": arrPath[0],
                "module": arrPath[1],
                "view": arrPath[2]
            }
        }[arrPath.length];
    
    console.log(arrPath);
    console.log(oPath);

    /*file.serve(req, res, function(err, result) {
        if (err) {
            console.error("Error serving %s - %s",
                req.url, err.message);

            if (err.status === 404 || err.status === 500) {
                file.serveFile(util.format("/%d.html", err.status),
                    err.status, {}, req, res);
            } else {
                res.writeHead(err.status, err.headers);
                res.end();
            }
        } else {
            console.log("%s - %s", req.url, res.message);
        }
    });*/
}).listen(port);
