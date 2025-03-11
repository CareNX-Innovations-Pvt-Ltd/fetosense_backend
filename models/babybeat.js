require('dotenv').config();
const mongoose = require("mongoose");

/**
 * @file models/babybeat.js
 * @module models/babybeat
 * @description Configuration and MongoDB connection for BabyBeat users.
 */

/**
 * Environment variables for CareMother Public configuration.
 * @constant {Object} caremotherPublic
 * @property {string} mongoUrl - Primary MongoDB connection URL.
 * @property {string} old_mongoUrl - Old MongoDB connection URL.
 * @property {string} mongodbName - MongoDB database name.
 * @property {string} apiUrl - API base URL.
 * @property {string} apiUrlLocal - Local API URL.
 * @property {string} SSLPrivateKey - SSL private key.
 * @property {string} SSLCertificate - SSL certificate.
 * @property {boolean} production - Whether the environment is production.
 * @property {boolean} SSLHost - Whether SSL is enabled for the host.
 * @property {string} projectId - Firebase project ID.
 * @property {string} firebaseApiUrl - Firebase API URL.
 * @property {string} port - Application port.
 * @property {boolean} logging - Logging enabled status.
 */

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

/**
 * MongoDB connection to BabyBeat database.
 * @constant {mongoose.Connection} connBB
 */

var connBB = mongoose.createConnection(caremotherPublic.mongoUrl, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });

/**
 * Schema for BabyBeat users collection.
 * @typedef {Object} BBUsersSchema
 * @property {string} _id - Unique user identifier.
 * @property {string} documentId - Document ID reference.
 */

const usersSchema = mongoose.Schema({
  _id: String,
  documentId: String
}, {
  collection: 'Users',
  strict: false
});


/**
 * Mongoose model for BabyBeat users.
 * @type {mongoose.Model<BBUsersSchema>}
 */

exports.BBUsers = connBB.model("BBUsers", usersSchema);
