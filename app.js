/*jshint esversion: 6 */

/**
 * @file app.js
 * @description Main Express application for the Fetosense backend.
 */

const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require('./config');
const gen = require('./general/general');
const diviceMis = require('./mis/device_mis');



// importing routs
const general = require('./routes/general');
const mis = require('./routes/mis');
const analytics = require('./routes/analytics');
const aggregations = require('./routes/aggregations');
const graph = require('./routes/graph');
const search = require('./routes/search');


//db.createUser({user: "root",pwd: "caremother2019",roles: [ { role: "userAdmin", db:"caremotherdummy" } ]})
console.log(config.configValue.mongoUrl, 'config');


const app = express();


/**
 * MongoDB Database Connection
 * - Connects to the MongoDB database using Mongoose.
 * - Logs success or failure messages.
 * - Sets maxTimeMS to 60000ms for queries.
 */

var databaseName = config.configValue.mongodbName;
if (config.configValue.mongoUrl) {
  var url = config.configValue.mongoUrl;
}
//'mongodb://localhost/newdbcoll'``
//"mongodb://root:caremother2019@35.200.231.168:27017/caremotherdummy?authSource=admin"
//caremotherdummy    caremother_v2

mongoose.set('maxTimeMS', 60000);

mongoose
  .connect(url, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, maxTimeMS: 60000 })
  .then(() => {
    console.log("Connected to database! =====>", databaseName);
  })
  .catch((err) => {
    console.log("Connection failed!", err);
  });


/**
 * Middleware
 * - Body-parser: Parses incoming JSON and URL-encoded payloads.
 * - CORS Headers: Allows all origins and specifies accepted methods and headers.
 * - API Key Validation: Ensures authenticated access to API endpoints.
 */

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST"//, PATCH, PUT, DELETE, OPTIONS"
  );
  try {
    //var url= req.url.replace(/\/$/, "");
    //console.log("next", url.substr(1).split("/")[url.substr(1).split("/").length -1]);
    //console.log(req.body);
    if (req.method == "POST") {
      //console.log(req.body);
      gen.checkApiKeys(req.body, ["Any"]);
    }
  }
  catch (err) {
    console.log("Unauthorised ", req.body);
    return res.status(401).json({
      message: "Unauthorised",
      statusCode: 401,
      err: err
    });
  }
  next();
});


/**
 * API Routes
 * - `/api/general` → Handles general operations (MongoDB insert, find, update, delete, aggregate).
 * - `/api/mis` → Handles MIS-related operations.
 * - `/api/analytics` → Provides analytics data.
 * - `/api/aggregations` → Handles data aggregation.
 * - `/api/search` → Provides search functionality.
 */

app.use("/api/general", general);
app.use("/api/mis", mis);
app.use("/api/analytics", analytics);
app.use("/api/aggregations", aggregations);
app.use("/api/search", search);
//app.use("/api/graph", graph);



module.exports = app;
