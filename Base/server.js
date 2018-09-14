/*
const app = require("./backend/app");
const debug = require("debug")("login-test");
const http = require("http");

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

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
*/
var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app;
var router;
var port = 3000;

app = express();

app.use(morgan('combined')); //logger
app.use(bodyParser.json());

router = express.Router();

router.get('/public_things', function(req, res) {
   res.json({"message": "Here are the public things..."});
});

app.use('/api', router);

app.listen(port, function() {
    console.log('Web server listening on localhost:' + port);
});
