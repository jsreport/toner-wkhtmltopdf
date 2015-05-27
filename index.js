var wkhtmltopdf = require("./lib/wkhtmltopdf.js")

module.exports = function(options) {
    return wkhtmltopdf(options);
};