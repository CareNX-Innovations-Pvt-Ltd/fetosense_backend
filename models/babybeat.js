require('dotenv').config();
const mongoose = require("mongoose");

var caremotherPublic = {
  mongoUrl: process.env.CAREMOTHER_MONGO_URL,
  old_mongoUrl: process.env.CAREMOTHER_OLD_MONGO_URL,
  mongodbName: process.env.CAREMOTHER_MONGODB_NAME,
  apiUrl: process.env.CAREMOTHER_API_URL,
  apiUrlLocal: process.env.CAREMOTHER_API_URL_LOCAL,
  SSLPrivateKey: process.env.CAREMOTHER_SSL_PRIVATE_KEY,
  SSLCertificate: process.env.CAREMOTHER_SSL_CERTIFICATE,
  production: process.env.CAREMOTHER_PRODUCTION === "true",
  SSLHost: process.env.CAREMOTHER_SSL_HOST === "true",
  projectId: process.env.CAREMOTHER_PROJECT_ID,
  firebaseApiUrl: process.env.CAREMOTHER_FIREBASE_API_URL,
  port: process.env.CAREMOTHER_PORT,
  logging: process.env.CAREMOTHER_LOGGING === "true"
};

var connBB = mongoose.createConnection(caremotherPublic.mongoUrl, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });

const usersSchema = mongoose.Schema({
  _id: String,
  documentId: String
}, {
  collection: 'Users',
  strict: false
});

exports.BBUsers = connBB.model("BBUsers", usersSchema);
