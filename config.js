configValue = {
	"fetosense-v2": {
		mongoUrl: 'mongodb://fetosense:C-nx#25*@fetosense-db-cluster.cluster-cziak2w6e5md.us-east-1.docdb.amazonaws.com:27017/fetosense-v2?directConnection=true&retryWrites=false&tls=true&tlsCAFile=global-bundle.pem',
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

