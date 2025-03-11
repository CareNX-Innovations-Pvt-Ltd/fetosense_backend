/**
 * @file server.js
 * @description Entry point for the Fetosense backend server. Handles HTTP/HTTPS server creation and starts the application.
 */

const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");
var https = require('https');
var fs = require('fs');
const config = require('./config');

/**
 * Normalize a port into a number, string, or false.
 * @function normalizePort
 * @param {string|number} val - The port value from the environment or configuration.
 * @returns {number|string|boolean} - The normalized port number, named pipe, or false if invalid.
 */

// var privateKey = fs.readFileSync("key.pem", 'utf8');
// var certificate = fs.readFileSync("cert.pem", 'utf8');
// var credentials = { key: privateKey, cert: certificate };
const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Event listener for HTTP server "error" event.
 * @function onError
 * @param {Error} error - The error object.
 * @throws {Error} - Throws the error if it is not related to listening.
 */

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 * @function onListening
 */
    
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

/**
 * Port number for the server, retrieved from environment variables or configuration.
 * @constant {number|string} port
 */


const port = normalizePort(process.env.PORT || config.configValue.port);
app.set("port", port);

/**
 * The HTTP or HTTPS server instance.
 * @constant {http.Server|https.Server} server
 */

var server = null;
if (config.configValue.SSLHost) {
  console.log("SSLPrivateKey", config.configValue.SSLPrivateKey, "SSLCertificate", config.configValue.SSLCertificate);
  server = https.createServer({
    key: fs.readFileSync(config.configValue.SSLPrivateKey, 'utf8'),
    cert: fs.readFileSync(config.configValue.SSLCertificate, 'utf8'),
  }, app);
}
else {
  server = http.createServer(app);
}
server.on("error", onError);
server.on("listening", onListening);
//,'192.168.0.103'

/**
 * Start the server and listen on the specified port.
 */

server.listen(port,() => console.info(`Server has started on ${port}`))

