require('dotenv').config();

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

exports.configValue = configValue['fetosense-v2'];
