var htmlSnapshots = require('html-snapshots');
var ROOT = "webroot"

var result = htmlSnapshots.run({
    source: ROOT + "/robots.txt",
    hostname: "fstricks.com",
    outputDir: ROOT + "/snapshots",
    outputDirClean: true,
    selector: "html"
});


