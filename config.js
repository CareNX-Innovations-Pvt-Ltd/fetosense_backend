configValue = {
	"fetosense-v2": {
		mongoUrl: 'mongodb+srv://dba:Kul-adi_0070@prod-carenx-database.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000',
		old_mongoUrl: 'mongodb://dba:^addy#007#@c.fetosense.mongocluster.cosmos.azure.com:10260/fetosense-v2?ssl=true',
		mongodbName: 'fetosense-v2',
		apiUrl: "https://backend.carenx.com:3006/api",
		apiUrlLocal: "http://localhost:3006/api",
		SSLPrivateKey: '/etc/letsencrypt/live/backend.carenx.com/privkey.pem',
		SSLCertificate: '/etc/letsencrypt/live/backend.carenx.com/fullchain.pem',
		production: true,
		SSLHost: true,
		projectId: "fetosense-v2",
		firebaseApiUrl: "https://us-central1-fetosense-v2.cloudfunctions.net/",
		port: "3006",
		logging: true
	}
};
exports.configValue = configValue['fetosense-v2'];

