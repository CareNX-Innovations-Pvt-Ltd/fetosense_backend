const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");
var https = require('https');
var fs = require('fs');
const config = require('./config');
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
    
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || config.configValue.port);
app.set("port", port);
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
server.listen(port,() => console.info(`Server has started on ${port}`))

