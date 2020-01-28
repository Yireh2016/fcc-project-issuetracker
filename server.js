"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

var MongoClient = require("mongodb").MongoClient;

const uri = `mongodb://${process.env.DBUSER}:${
  process.env.DBPASSWD
}@ds063124.mlab.com:63124/fcc`;

var apiRoutes = require("./routes/api.js");
var fccTestingRoutes = require("./routes/fcctesting.js");
var runner = require("./test-runner");

var app = express();

app.use(helmet.xssFilter());
app.use("/public", express.static(process.cwd() + "/public"));

app.use(cors({ origin: "*" })); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Sample front-end
app.route("/:project/").get(function(req, res) {
  res.sendFile(process.cwd() + "/views/issue.html");
});

//Index page (static HTML)
app.route("/").get(function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

MongoClient.connect(uri, (err, db) => {
  if (err) console.log("Database error:  " + err);

  console.log("Database connected");

  //For FCC testing purposes
  fccTestingRoutes(app);

  //Routing for API
  apiRoutes(app, db);

  //404 Not Found Middleware
  app.use(function(req, res, next) {
    res
      .status(404)
      .type("text")
      .send("Not Found");
  });

  //Start our server and tests!
  app.listen(process.env.PORT || 8080, function() {
    console.log("Listening on port " + process.env.PORT || 8080);
    if (process.env.NODE_ENV === "test") {
      console.log("Running Tests...");
      setTimeout(function() {
        try {
          runner.run();
        } catch (e) {
          var error = e;
          console.log("Tests are not valid:");
          console.log(error);
        }
      }, 3500);
    }
  });
});

module.exports = app; //for testing
