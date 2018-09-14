const express = require ('express');

var app = express ();

app.post ("/user-panel/:USER_NAME&:PASSWORD", function (req, res) {
  
});

var server = app.listen (3000, function () {
  "use strict";

  var host = server.address ().address;
  var port = server.address ().port;

  console.log ("Server is listening at %s:%s", host, port);
});