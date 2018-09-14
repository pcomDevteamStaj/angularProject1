const express = require ('express');
const oracledb = require ('oracledb');
const bodyParser = require ('body-parser');
const fs = require ('fs');
const config = require ('./config/config.js');

var app = express ();
app.use (bodyParser.urlencoded ({ extended: true }));
app.use (bodyParser.json ());



/**
 * Global Variables
 */
var TABLE_NAME = "GNL_USER";

/**
 * Register New User
 */
app.post ("/", function (req, res) {
    "use strict";
    /*
    console.log ("--- APP.JS ---")
    */
    console.log ("Username: " + req.param ('USER'));
    console.log ("Password: " + req.param ('PASS'));
    console.log ("Mail: " + req.param ('MAIL'));
    console.log ("Title: " + req.param ('TITLE'));
    console.log ("Phone: " + req.param ('PHONE'));
    console.log ("Gender: " + req.param ('GENDER'));
    /*
    console.log ("--------------");
    */
    oracledb.getConnection ({
            user: config.user,
            password: config.password,
            connectString: config.connectString
        }, function (err, connection) {
            if (err) {
                console.error ("Error #01: " + err.message);
                return;
            }

            connection.execute (
                "INSERT INTO GNL_USER (USER_ID, USER_NAME, USER_MAIL, USER_PASS, USER_TITLE, USER_PHONE, USER_GENDER, USER_RANK) VALUES (GNL_USER_SEQ.nextVal, _username, _mail, _password, _title, _phone, _gender, _rank)",
                {_username: "test_user_0", _mail: "test_mail_0", _password: "test_password_0", _title: "test_title_0", _phone: "test_phone_0", _gender: "test_gender_0", _rank: 0},
                {autoCommit: true},
                function (err, result) {
                    if (err) {
                        console.log ("Error #02: " + err.message);
                        return;
                    }

                    connection.release (function (err) {
                        if (err) {
                            console.log ("Error #03: " + err.message);
                            return;
                        }

                        console.log ("Connection released!");
                    });
                }
            );
        }
    );
});

/**
 * Login via Username and Password
 */
app.get ('/', function (req, res) {
    "use strict";
    
    console.log ("Username: " + req.param ('USER'));
    console.log ("Password: " + req.param ('PASS'));

    /*var data = JSON.stringify ({isAllowed: req.param ('PASS') === '123456'});
    res.setHeader ('Access-Control-Allow-Origin', '*');
    res.write (data);
    res.end ();
    */
    oracledb.getConnection ({
            user: config.user,
            password: config.password,
            connectString: config.connectString
        }, function (err, connection) {
            if (err) {
                console.error ("Error #04: " + err.message);
                return;
            }

            connection.execute (
                "SELECT * FROM GNL_USER WHERE USER_NAME = :name",
                {name: req.param ('USER')},
                function (err, result) {
                    if (err) {
                        console.log ("Error #05: " + err.message);
                        return;
                    }

                    // Get User
                    var user = result.rows [0];
                    console.log ("Password is " + (req.param ('PASS') === user [3]));
                    var data = JSON.stringify ({isAllowed: req.param ('PASS') === user [3]});
                    res.setHeader ('Access-Control-Allow-Origin', '*');
                    res.write (data);
                    res.end ();

                    connection.release (function (err) {
                        if (err) {
                            console.log ("Error #06: " + err.message);
                            return;
                        }

                        console.log ("Connection released!");
                    });
                }
            );
        }
    );
    
});

/**
 * Get Data from User Table
 */
app.get ('/user', function (req, res) {
    "use strict";
    
    // Display User List
    if (!req.param ('USER')) {
        console.log ("[GET from '/user'] User List");
        oracledb.getConnection({
            user: config.user,
            password:config.password,
            connectString:config.connectString
        }, function(err,connection){
            if(err){
                console.log("ERROR: connection" + err.message);
                return;
            }
            connection.execute("SELECT * FROM "+ TABLE_NAME, 
            function(err,result){
                if(err){
                    console.log("ERROR: 152" + err.message);
                    return;
                }
                //res = result.rows;
                res.setHeader ('Access-Control-Allow-Origin', '*');
                res.write (JSON.stringify (result));
                res.end ();
                /*connection.release (function (err) {
                    if (err) {
                        console.log ("Error #06: " + err.message);
                        return;
                    }

                    console.log ("Connection released!");
                });*/
                return;
            });
        });
        /*var result = {
            rows: [],
        }

        result.rows = [];
        for (var i = 0; i < 10; i++) {
            result.rows [i] = [i, "user #" + i];
        }*/

        
    }else{
        // Display Specific User

        console.log ("[GET from '/user'] Username: " + req.param ('USER'));
        var username = req.param('USER');
        /*var result = {
            rows: [],
        }

        result.rows = [];
        result.rows [0] = [10, req.param ('USER'), "SURNAME", "Bilkent University Main Campus"];

        if (TABLE_NAME === "GNL_USER") {
            result.rows [0] = [10, req.param ('USER'), "test@mail.com", "Job", "532 000 00 00", "Male", 4];
        }

        res.setHeader ('Access-Control-Allow-Origin', '*');
        res.write (JSON.stringify (result));
        res.end ();
        */

        oracledb.getConnection({
            user: config.user,
            password: config.password,
            connectString: config.connectString
        },function(err,connection){
            if(err){
                console.log("ERROR: " + err.message);
                return;
            }
            connection.execute("SELECT * FROM "+TABLE_NAME+" WHERE USER_NAME = :name",{name: username},
                function(err,result){
                    if(err){
                        console.log("ERROR: 188 "+err.message);
                        return;
                    }

                    res.setHeader('Access-Control-Allow-Origin','*');
                    res.write(JSON.stringify(result));
                    res.end();
            });
        });
    }

    
    
});

/**
 * Change Database & Config File
 */
app.get ('/settings', function (req, res) {
    "use strict";

    console.log ("Username: " + req.param ('USER'));
    console.log ("Password: " + req.param ('PASS'));
    console.log ("connectString: " + req.param ('CONN_STR'));

    // Check whether Client sended the parameters
    if (req.param ('USER') == null || req.param ('PASS') == null || req.param ('CONN_STR') == null) {
        console.error ("GET ['/settings'] has not enough parameters!");
        // Send Error Message to Client
        res.write (JSON.stringify ({}));
        res.end ();
        return;
    }

    res.setHeader ('Access-Control-Allow-Origin', '*');
    
    // Try Connection
    oracledb.getConnection ({
        user: req.param ('USER'),
        password: req.param ('PASS'),
        connectString: req.param ('CONN_STR')
    }, function (err, connection) {
        if (err) {
            console.error ("Error #12: " + err.message);
            // Send Error Message to Client
            res.write (err.message);
            res.end ();
            return;
        }

        // Write Config File
        fs.writeFile ('./config/config.json', JSON.stringify ({'port':process.env.HTTP_PORT || 3000, 'username': req.param ('USER'), 'password':req.param ('PASS'), 'connectString': req.param ('CONN_STR')}), (err) => {
            if (err) {
                console.log ("Error #14: " + err.message);
            }

            console.log ("Database Config File has been saved!");
        });

        // Read Config File
        fs.readFile ('./config/config.json', (err, data) => {
            JSON.parse (data, (key, value) => {
                console.log (key + ":" + value);
            });
        });

        // Release Connection
        /*
        connection.release (function (err) {
            if (err) {
                console.log ("Error #06: " + err.message);
                return;
            }

            console.log ("Connection released!");
        });
        */
    });
});

/**
 * Get Table Names and Columns
 */
app.get ('/database', function (req, res) {
    "use strict";

    
    if (req.param ("TABLE_NAME")) {
        console.log ("[GET] column_name FROM /database");
        console.log ("PREV_TABLE_NAME: " + TABLE_NAME);
        console.log ("TABLE_NAME: " + req.param ("TABLE_NAME"));
        TABLE_NAME = req.param ("TABLE_NAME");
        oracledb.getConnection({
            user: config.user,
            password:config.password,
            connectString:config.connectString
        }, function(err,connection){
            if(err){
                console.log("ERROR: connection" + err.message);
                return;
            }
            connection.execute("SELECT column_name FROM USER_TAB_COLUMNS WHERE table_name='" +req.param("TABLE_NAME") +"'", 
            function(err,result){
                if(err){
                    console.log("ERROR:" + err.message);
                    return;
                }
                //res = result.rows;
                console.log(result.rows);
                var data  = {
                    rows:[],
                }

                for(var i = 0;i < result.rows.length;i++){
                    data.rows[i] = result.rows[i][0];
                }
                res.setHeader ('Access-Control-Allow-Origin', '*');
                res.write (JSON.stringify (data));
                res.end ();
                /*connection.release (function (err) {
                    if (err) {
                        console.log ("Error #06: " + err.message);
                        return;
                    }

                    console.log ("Connection released!");
                });*/
                return;
            });
        });
        
        /*
        var result = {
            rows: [],
        }
        
        result.rows = [];

        result.rows [0] = "USER_ID";
        result.rows [1] = "USER_NAME";
        result.rows [2] = "USER_SURNAME";
        result.rows [3] = "USER_ADDRESS";

        if (TABLE_NAME === "GNL_USER") {
            result.rows [0] = "USER_ID";
            result.rows [1] = "USER_NAME";
            result.rows [2] = "USER_MAIL";
            result.rows [3] = "USER_TITLE";
            result.rows [4] = "USER_PHONE";
            result.rows [5] = "USER_GENDER";
            result.rows [6] = "USER_RANK";
        }
        
        res.setHeader ('Access-Control-Allow-Origin', '*');
        res.write (JSON.stringify (result));
        res.end ();
        return;
        */
    }else{
        console.log ("[GET] table_name FROM /database")
    
        /*var result = {
            rows: [],
        }
        
        result.rows = [];

        result.rows [0] = "GNL_USER";
        for (var i = 1; i < 6; i++) {
            result.rows [i] = "table_" + i;
        }*/
        oracledb.getConnection({
            user: config.user,
            password: config.password,
            connectString: config.connectString
        },function(err, connection){
            if(err){
                console.log("ERROR:"+ err.message);
                return;
            }
            connection.execute("SELECT * FROM user_tables",
                function(err, result){
                    if(err){
                        console.log("ERROR: " + err.message);
                        return;
                    }
                    var data = {
                        rows:[],
                    }
                    for(var i = 0;i<result.rows.length;i++){
                        data.rows[i] = result.rows[i][0];
                    }
                    res.setHeader('Access-Control-Allow-Origin','*');
                    res.write(JSON.stringify(data));
                    res.end();

                    
                }            
        );

        });
        /*res.setHeader ('Access-Control-Allow-Origin', '*');
        res.write (JSON.stringify (result));
        res.end ();*/
    }

    
});

app.get ('/data', function (req, res) {
    "use strict";
    key = req.param("KEYWORD");
    clmn = req.param("CLMN");
    console.log ("KEYWORD: " + req.param ("KEYWORD"));
    oracledb.getConnection({
        user: config.user,
        password: config.password,
        connectString: config.connectString
    },function(err,connection){
        if(err){
            console.log("ERROR:" + err.message);
            return;
        }
        connection.execute("SELECT * FROM "+TABLE_NAME+" WHERE %"+key+"% LIKE "+clmn,
            function(err,result){
                if(err){
                    console.log("ERROR:" + err.message);
                    return;
                }
                res.setHeader('Access-Control-Allow-Origin','*');
                res.write(JSON.stringify(result));
                res.end();
            });
    });
    
    /*
    var result = {
        rows: [],
    }
    
    result.rows = [];

    if (req.param ("KEYWORD")) {
        result.rows [0] = "2";
        result.rows [1] = "user";
        result.rows [2] = "mail";
        result.rows [3] = "title";
        result.rows [4] = "phone";
        result.rows [5] = "gender";
        result.rows [6] = "4";
    }
    
    res.setHeader ('Access-Control-Allow-Origin', '*');
    res.write (JSON.stringify (result));
    res.end ();
    */
});

app.post ('/data', function (req, res) {
    "use strict";

    console.log ("[POST] update TO /data");

    console.log ("ID: " + req.param ("ID"));
    console.log ("CLMN: " + req.param ("CLMN"));
    console.log ("DATA: " + req.param ("DATA"));

    var clmn = JSON.parse(req.param ("CLMN"));
    var data = JSON.parse(req.param ("DATA"));

    var sqlConn = "UPDATE " + TABLE_NAME + " SET ";
    for (var i = 0; i < clmn.length; i++) {
        sqlConn += clmn [i] + " = '" + data [i] + "'";

        if (i < clmn.length - 1) {
            sqlConn += ", "
        }
    }
    sqlConn += " WHERE " + clmn [0] + " = " + data [0];

    console.log ("sqlConn: " + sqlConn);
    res.setHeader ('Access-Control-Allow-Origin', '*');
    res.write (JSON.stringify ({rows: ""}));
    res.end ();
});
//Create TABLE

app.post('/table',function(req,res){
    "use strict";
    console.log("[POST] create table to /table");
    console.log("TABLE NAME: "+req.param("TABLE_NAME"));
    console.log("COLUMNS: "+ req.param("CLMNS"));
    console.log("SET: "+ req.param("SET"));
    sqlRest = "";
    var clmns = JSON.parse(req.param("CLMNS"));
     
});


/**
 * Listen PORT
 */
var server = app.listen (3000, function () {
    "use strict";

    var host = server.address ().address;
    var port = server.address ().port;

    console.log ("Server is listening at %s:%s", host, port);
});