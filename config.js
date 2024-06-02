configValue = {
	"fetosense-v2": {
		mongoUrl: 'mongodb://dba:^addy#007#@c.fetosense.mongocluster.cosmos.azure.com:10260/fetosense-v2?ssl=true',
		mongodbName: 'fetosense-v2',
		apiUrl: "https://www.caremother.co:3006/api",
		apiUrlLocal: "http://localhost:3006/api",
		SSLPrivateKey: '/etc/letsencrypt/live/caremother.co/privkey.pem',
		SSLCertificate: '/etc/letsencrypt/live/caremother.co/fullchain.pem',
		production: true,
		SSLHost: false,
		projectId: "fetosense-v2",
		firebaseApiUrl: "https://us-central1-fetosense-v2.cloudfunctions.net/",
		port: "3006",
		logging: true
	}
};
exports.configValue = configValue['fetosense-v2'];

