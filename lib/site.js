var http = require("http");
var url = require("url");
var path = require("path");
var fs = require("fs");

var exports = module.exports;

// Server configuration
exports.conf = {
	"ip" : "127.0.0.1",
	"port" : 80,
	"root" : process.cwd(),
	"index" : [ "index.html" ]
};

exports.conf.mimeTypes = {
	defaultType : "text/html",
	"bin" : "application/octet-stream",
	"css" : "text/css",
	"gif" : "image/gif",
	"html": "text/html",
	"ico" : "image/x-icon",
	"jpg" : "image/jpeg",
	"js"  : "text/javascript",
	"mkd" : "text/plain",
	"pdf" : "application/pdf",
	"php" : "text/html",
	"png" : "image/png",
	"svg" : "image/svg+xml",
	"txt" : "text/plain",
	"xml" : "text/xml"
};

// Create server
exports.createServer = function () {
	var conf = exports.conf;

	// Create the Server
	var server = http.createServer(function(req, res) {
		var parsed = url.parse(req.url);

		req.path = path.join(conf.root, parsed.pathname);

		// Check if file exists
		fs.stat(req.path, function(err, stats) {

			// If an error occurs
			if (err) {
				console.log(err);
				res.writeHead(404);
				res.end();
			// If it's a file
			} else if (stats.isFile()) {

				var ext = path.extname(req.path).substr(1);
				var mimeType = (conf.mimeTypes[ext] != undefined) ?
						conf.mimeTypes[ext] : conf.mimeTypes.defaultType;

				// Set the HTTP header
				var head = {
					"Content-Type" : mimeType,
					"Content-Length" : stats.size
				};

				// Read the file
				fs.readFile(req.path, function(err, data) {
					if (err)
						console.log(err);

					res.writeHead(200, head);
					res.end(data);
				});
			}
			// If it's a directory
			else if (stats.isDirectory()) {
				var file;
				var index = conf.index;

				// Check for index files in the directory
				for (var i = 0; i < def.length; ++i) {
					file = path.join(conf.root, index[i]);

					// Get stats of file
					var stats = fs.statSync(file);

					// If it exists
					if (stats.isFile()) {
						// Do the same as with a regular file
						var ext = path.extname(file).substr(1);
						var mimeType = (conf.mimeTypes[ext] != undefined) ?
								conf.mimeTypes[ext] :
								conf.mimeTypes.defaultType;

						var head = {
							"Content-Type" : mimeType,
							"Content-Length" : stats.size
						};

						fs.readFile(file, function (err, data) {
							res.writeHead(200, head);
							res.end(data);
						});

						// Stop looking for index files
						break;
					}
				}
			}
			// If it doesn't exist or an error occurs.
			else {
				res.writeHead(404);
				res.end();
			}
		});
	});

	// Make listen
	server.listen(conf.port, conf.ip);

	// Log status message
	console.log("Created HTTP Server at " + conf.ip + ":" + conf.port);

	return server;
};
