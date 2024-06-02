/*jshint esversion: 6 */
const mongoose = require("mongoose");

var caremotherPublic = {
  mongoUrl: 'mongodb://dba:^addy#007#@c.fetosense.mongocluster.cosmos.azure.com:10260/carenx-public?ssl=true',
  mongodbName: 'caremother-public',

  // API Hosted Url
  apiUrl: "https://www.caremother.co:3004/api",
  apiUrlLocal: "http://localhost:3004/api",
  // SSL configuration url for service Hosting on ssl
  SSLPrivateKey: '/etc/letsencrypt/live/caremother.co/privkey.pem',
  SSLCertificate: '/etc/letsencrypt/live/caremother.co/fullchain.pem',
  // Flag to check/ deploy project on live
  production: true,
  SSLHost: false,
  projectId: "caremother-public",
  firebaseApiUrl: "https://us-central1-caremother-public.cloudfunctions.net/",
  port: "3004",
  logging: true
}

var connBB = mongoose.createConnection(caremotherPublic.mongoUrl, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });


const usersSchema = mongoose.Schema({
  _id: String,
  documentId: String
},
  {
    collection: 'Users',
    strict: false
  });

exports.BBUsers = connBB.model("BBUsers", usersSchema);
