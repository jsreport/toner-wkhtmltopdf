/*! 
 * Copyright(c) 2014 Jan Blaha 
 * 
 * Recipe rendering pdf files using wkhtmltopdf.
 */

var uuid = require("uuid").v1,
    path = require("path"),
    fs = require("fs"),
    childProcess = require('child_process'),
    mkdirp = require('mkdirp'),
    extend = require("node.extend"),
    wkhtmltopdf = require("wkhtmltopdf-installer");

function createParams(request, options, id) {
    var params = [];

    params.push("--disable-local-file-access");

    if (options.pageHeight) {
        params.push("--page-height");
        params.push(options.pageHeight);
    }

    if (options.pageWidth) {
        params.push("--page-width");
        params.push(options.pageWidth);
    }

    if (options.pageSize) {
        params.push("--page-size");
        params.push(options.pageSize);
    }

    if (options.marginBottom || options.marginBottom === 0) {
        params.push("--margin-bottom");
        params.push(options.marginBottom);
    }

    if (options.marginLeft || options.marginLeft === 0) {
        params.push("--margin-left");
        params.push(options.marginLeft);
    }

    if (options.marginRight || options.marginRight === 0) {
        params.push("--margin-right");
        params.push(options.marginRight);
    }

    if (options.marginTop || options.marginTop === 0) {
        params.push("--margin-top");
        params.push(options.marginTop);
    }

    if (options.orientation) {
        params.push("--orientation");
        params.push(options.orientation);
    }

    if (options.title) {
        params.push("--title");
        params.push(options.title);
    }

    if (options.header) {
        if (options.headerHeight) {
            params.push("--header-spacing");
            params.push(options.headerHeight);
        }

        params.push("--header-html");
        params.push("file:///" + path.join(request.toner.options.tempDirectory, id + "header.html"));
    }

    if (options.footer) {
        if (options.footerHeight) {
            params.push("--footer-spacing");
            params.push(options.footerHeight);
        }

        params.push("--footer-html");
        params.push("file:///" + path.join(request.toner.options.tempDirectory, id + "footer.html"));
    }

    if (options.toc && JSON.parse(options.toc)) {
        params.push("toc");

        if (options.tocHeaderText) {
            params.push("--toc-header-text");
            params.push(options.tocHeaderText);
        }

        if (options.tocLevelIndentation) {
            params.push("--toc-level-indentation ");
            params.push(options.tocLevelIndentation);
        }

        if (options.tocTextSizeShrink) {
            params.push("--toc-text-size-shrink ");
            params.push(options.tocTextSizeShrink);
        }
    }

    params.push(path.join(request.toner.options.tempDirectory, id + ".html"));
    params.push(path.join(request.toner.options.tempDirectory, id + ".pdf"));

    return params;
};

function processPart(options, req, type, id, cb) {

    if (!options[type])
        return cb();

    var _req = extend(true, {}, req);
    extend(true,  _req.template, {content: options[type], recipe: "html"});
    _req.options.isChildRequest = true;

    req.toner.render(_req, function(err, res) {
        if (err)
            return cb(err);

        fs.writeFile(path.join(req.toner.options.tempDirectory, id + type + ".html"), res.content, cb);
    });
}

function processHeaderAndFooter( options, req, id, cb) {
    processPart(options, req, "header", id, function(err) {
        if (err)
            return cb(err);

        processPart(options, req, "footer", id, cb);
    });
}

function recipe(req, res, cb) {
    req.template.wkhtmltopdf = req.template.wkhtmltopdf || {};
    var options = req.template.wkhtmltopdf || {};

    var id = uuid();
    fs.writeFile(path.join(req.toner.options.tempDirectory, id + ".html"), res.content, function(err) {
        if (err)
            return cb(err);

        processHeaderAndFooter( options, req, id, function(err) {
            if (err)
                return cb(err);

            var parameters = createParams(req, options, id);

            childProcess.execFile(wkhtmltopdf.path, parameters, function (err, stederr, stdout) {
                if (err) {
                    return cb(err);
                }

                res.headers["Content-Type"] = "application/pdf";
                res.headers["Content-Disposition"] = "inline; filename=\"report.pdf\"";
                res.headers["File-Extension"] = "pdf";

                fs.readFile(path.join(req.toner.options.tempDirectory, id + ".pdf"), function(err, buf) {
                    if (err)
                        return cb(err);

                    res.content = buf;
                    cb();
                });
            });
        });
    });
};

module.exports = function (options) {
    return recipe;
};
