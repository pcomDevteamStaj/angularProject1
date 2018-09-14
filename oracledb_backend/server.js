const http = require ('http');
const express = require ('express');
const config = require ('./config/config.js');

let httpServer;

function initialize () {
    return new Promise ((resolve, reject) => {
        const app = express ();
        httpServer = http.createServer (app);

        app.get ('/*', (req, res) => {
            res.write ("url: " + req.url);
            res.write ("\n");
            res.end ("Test server is running!");
        });

        httpServer.listen (config.port, err => {
            if (err) {
                console.log ("Error #01: " + err);
                return;
            }

            console.log ("Web server listening on localhost:" + config.port);
            resolve ();
        });
    });
}

module.exports.initialize = initialize;