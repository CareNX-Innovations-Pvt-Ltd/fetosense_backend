/**
 * @file config.js
 * @description Configuration settings for the Fetosense backend, loaded from environment variables.
 */

require('dotenv').config();


/**
 * Configuration object containing environment variables for the Fetosense application.
 * 
 * @constant {Object} configValue
 * @property {string} mongoUrl - MongoDB connection URL.
 * @property {string} old_mongoUrl - Previous MongoDB connection URL (if applicable).
 * @property {string} mongodbName - Name of the MongoDB database.
 * @property {string} apiUrl - API base URL.
 * @property {string} apiUrlLocal - Local API base URL.
 * @property {string} SSLPrivateKey - Path to the SSL private key.
 * @property {string} SSLCertificate - Path to the SSL certificate.
 * @property {boolean} production - Indicates if the application is running in production mode.
 * @property {boolean} SSLHost - Indicates if SSL is enabled for the host.
 * @property {string} projectId - Firebase project ID.
 * @property {string} firebaseApiUrl - Firebase API base URL.
 * @property {string} port - Server port number.
 * @property {boolean} logging - Indicates if logging is enabled.
 */

configValue = {
	"fetosense-v2": {
		mongoUrl: process.env.MONGO_URL,
		old_mongoUrl: process.env.OLD_MONGO_URL,
		mongodbName: process.env.MONGODB_NAME,
		apiUrl: process.env.API_URL,
		apiUrlLocal: process.env.API_URL_LOCAL,
		SSLPrivateKey: process.env.SSL_PRIVATE_KEY,
		SSLCertificate: process.env.SSL_CERTIFICATE,
		production: process.env.PRODUCTION === "true",
		SSLHost: process.env.SSL_HOST === "true",
		projectId: process.env.PROJECT_ID,
		firebaseApiUrl: process.env.FIREBASE_API_URL,
		port: process.env.PORT,
		logging: process.env.LOGGING === "true"
	}
};

/**
 * Exports the configuration object for `fetosense-v2`.
 * @module config
 * @type {Object}
 */

exports.configValue = configValue['fetosense-v2'];
