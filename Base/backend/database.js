const express = require ('express');
const oracledb = require ('oracledb');
const bcrypt = require ('bcrypt');
const config = require ('./dbconfig');
const UserStruct = require ('./models/user');

module.exports = class Database {
  constructor () {
    oracledb.getConnection (
      // Database Connection
      {
        user: config.user,
        password: config.password,
        connectString: config.connectString
      },
      function (err, connection) {
        if (err) {
          console.error ("Error #01: " + err.message);
          return;
        }
        this.conn = connection;
        console.log ("Connection is successful!");
      }
    );
  }

  login (username, password) {
    console.log ("Login as ['" + username + "', '" + password + "']");

    this.conn.execute (
      "SELECT * FROM GNL_USER WHERE USER_NAME = '" + username + "'",
      function (err, result) {
        if (err) {
          console.error ("Error #02: " + err.message);
          doRelease (this.conn);
          return;
        }
  
        console.log ("\n--- Login Result ---");
        console.log (result.rows);
        console.log ("------------\n");
        
        // Check Password
        var user = result.rows [0];
        bcrypt.compare (password, user[3], function (err, pwMatch) {
          var payload = new UserStruct;
  
          if (err) {
            console.log ("Error #03: " + err.message);
            return;
          }
  
          if (!pwMatch) {
            console.log ("Password is wrong!");
            return;
          }
  
          payload = {
            _id: user[0],
            _username: user [1],
            _email: user[2],
            _title: user[3],
            _phone: user[5],
            _gender: user[6],
            _rank: user[7]
          }
  
          console.log ("Payload: " + payload);
        }); 
  
        doRelease (this.conn);
      }
    );
  }

  signUp (userInfo, unhashedPassword) {
    var userStruct = new UserStruct ({
      _username: userInfo [1],
      _email: userInfo [2],
      _title: userInfo [3],
      _phone: userInfo [4],
      _gender: userInfo [5]
    });

    this.encrypt (userStruct, unhashedPassword);
  }

  encrypt (userStruct, unhashedPassword) {
    var salt;
  
    bcrypt.genSalt (10, function (err, salt) {
      if (err) {
        console.log ("Error #04: " + err);
        return;
      }
  
      console.log ("Salt: " + salt);
  
      bcrypt.hash (unhashedPassword, salt, function (err, hash) {
        if (err) {
          console.log ("Error #05: " + err);
          return;
        }
  
        console.log ("Hash: " + hash);
        this.commitToOracle (userStruct, hash);
      });
    });
  }

  commitToOracle (userStruct, hashedPassword) {
    console.log ("userStruct: " + userStruct);

    this.conn.execute (
      "INSERT INTO GNL_USER (USER_ID, USER_NAME, USER_MAIL, USER_PASS, USER_TITLE, USER_PHONE, USER_GENDER, USER_RANK) VALUES (GNL_USER_SEQ.nextVal, :username, :mail, :password, :title, :phone, :gender, :rank)",
      {username: userStruct._username, mail: userStruct._email, password: hashedPassword, title: userStruct._title, phone: userStruct._phone, gender: userStruct._gender, rank: userStruct._rank},
      {autoCommit: true},
      function (err, result) {
        if (err) {
          console.log ("Error #06: " + err);
          return;
        }
  
        console.log ("User have added to server!");
  
        console.log ("\n--- Sing Up Result ---");
        console.log (result.rows);
        console.log ("------------\n");
      }
    );
  }

  doRelease (connection) {
    console.log ("doRelease: " + connection);
  }

  test () {
    console.log ("Test function of Database Class!");
  }
}