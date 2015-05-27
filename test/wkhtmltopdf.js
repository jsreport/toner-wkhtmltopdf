var should = require("should");
var path = require("path");
var wkhtmltopdf = require("../lib/wkhtmltopdf")();

describe('wkhtmltopdf', function(){

    beforeEach(function() {
    });

    it("should render valid PDF", function(done) {
        var res = { content: new Buffer("foo"), headers: {}};
        wkhtmltopdf({ toner: { options: { tempDirectory: require("os").tmpDir() }} ,  template: {}}, res, function(err) {

            if (err)
                return done(err);

            res.content.toString().should.containEql("%PDF");
            done();
        });
    });

    it("should render header in toner", function(done) {
        var res = { content: new Buffer("foo"), headers: {}};
        var req = { template: { wkhtmltopdf: { header: "header"}}, options: {}};

        var monitor = false;
        function render(req, cb) {
            monitor = true;
            cb(null, { content: new Buffer(req.template.content)});
        }

        req.toner = {
            render: render,
            options: { tempDirectory: require("os").tmpDir() }
        };

        wkhtmltopdf(req, res, function(err) {
            if (err)
                return done(err);

            monitor.should.be.ok;
            done();
        });
    });
});