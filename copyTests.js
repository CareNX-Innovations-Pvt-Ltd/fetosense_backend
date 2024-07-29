const { MongoClient, BulkWriteOperation } = require('mongodb');

const uri = 'mongodb+srv://dba:%5Eaddy%23007%23@fetosense.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=160000&authSource=quickstartDB';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function copyData(modCompleted) {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db("fetosense-v2");
        const sourceCollection = database.collection("tests");
        const destinationCollection = database.collection("testsMeta");

        const batchSize = 1000; // Example batch size
        let skip = 0;
        let documentsProcessed = 0;
        colms = ["_id", "__v", "weight", "testByMother", "testById", "sync", "stranded", "shortDynamicLink", "patientId",
            "organizationName", "organizationId", "motherName", "motherId", "modifiedTimeStamp", "modifiedAt", "mobileNo",
            "mhrAveragePDF", "mhrAverage", "longDynamicLink", "lmp", "live", "lengthOfTest", "interpretationType",
            "interpretationExtraComments", "imgSynced", "imageLocalPath", "imageFirePath", "id", "hasFHR2", "gAge",
            "fisherScore", "edd", "documentId", "doctorName", "doctorId", "deviceName", "deviceId", "delete", "createdOn",
            "createdBy", "autoModifiedTimeStamp", "autoInterpreter", "autoInterpretations",
            "audioSynced", "audioLocalPath", "audioFirePath", "associations", "FisherScoreArray"];
        colsDic = {};
        for (let c of colms) {
            colsDic[c] = 1;
        }
        const sort = { modifiedTimeStamp: 1 }; // Sort in descending order to get the latest document
        const options = { projection: { _id: 0, modifiedTimeStamp: 1 }, sort };
        let lastdoc = await destinationCollection.findOne({}, options);
        modCompleted = lastdoc.modifiedTimeStamp;
        console.log("modCompleted", modCompleted);
        while (true) {
            const cursor = sourceCollection.find({ modifiedTimeStamp: { "$lt": modCompleted } }, { projection: colsDic })
                .sort({ modifiedTimeStamp: -1 })
                .skip(skip)
                .limit(batchSize)
                .maxTimeMS(600000); // Example: 10 minutes (600,000 milliseconds)

            const batch = await cursor.toArray();

            if (batch.length === 0) {
                break; // No more documents to process
            }
            let bigDatas = ["autoFetalMovement", "autoMovementEntries", "bpmEntries", "tocoEntries", "uactEntries", "movementEntries", "mhrEntries", "bpmEntries2"];
            for (el of batch) {
                for (let b of bigDatas) {
                    delete el[b];
                }
            }
            // Insert batch into destination collection
            await destinationCollection.insertMany(batch);

            documentsProcessed += batch.length;
            skip += batchSize;

            console.log(`Processed ${documentsProcessed} documents ${batch[0].modifiedTimeStamp} -- ${new Date(batch[0].modifiedTimeStamp)}`);
            console.log("data", Object.keys(batch[0]));
        }

        console.log('Data copy process completed.');

    } catch (err) {
        console.error('Error during data copy:', err);
    } finally {
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}

async function copyDataOld() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB');

        const database = client.db("fetosense-v2");
        const sourceCollection = database.collection("tests");
        const destinationCollection = database.collection("testsMeta");

        // Query documents from source collection sorted by modifiedTimeStamp ascending
        colms = ["_id", "__v", "weight", "testByMother", "testById", "sync", "stranded", "shortDynamicLink", "patientId",
            "organizationName", "organizationId", "motherName", "motherId", "modifiedTimeStamp", "modifiedAt", "mobileNo",
            "mhrAveragePDF", "mhrAverage", "longDynamicLink", "lmp", "live", "lengthOfTest", "interpretationType",
            "interpretationExtraComments", "imgSynced", "imageLocalPath", "imageFirePath", "id", "hasFHR2", "gAge",
            "fisherScore", "edd", "documentId", "doctorName", "doctorId", "deviceName", "deviceId", "delete", "createdOn",
            "createdBy", "autoModifiedTimeStamp", "autoInterpreter", "autoInterpretations",
            "audioSynced", "audioLocalPath", "audioFirePath", "associations", "FisherScoreArray"];
        colsDic = {};
        for (let c of colms) {
            colsDic[c] = 1;
        }
        const cursor = sourceCollection.find({}, colsDic).sort({ modifiedTimeStamp: 1 });

        let bulkOps = [];
        const batchSize = 10; // Example batch size


        // Process each document one by one
        while (await cursor.hasNext()) {
            const doc = await cursor.next();

            // Build bulk update or insert operation
            bulkOps.push({
                updateOne: {
                    filter: { modifiedTimeStamp: doc.modifiedTimeStamp },
                    update: { $set: doc },
                    upsert: true // Insert if document doesn't exist
                }
            });

            // Execute bulk write operation in batches
            if (bulkOps.length === batchSize) {
                await destinationCollection.bulkWrite(bulkOps);
                bulkOps = []; // Clear bulkOps array after execution
                console.log(`Processed batch of ${batchSize} documents`);
            }
        }

        // Final batch write (if any remaining documents)
        if (bulkOps.length > 0) {
            await destinationCollection.bulkWrite(bulkOps);
            console.log(`Processed final batch of ${bulkOps.length} documents`);
        }

        console.log('Data copy process completed.');

    } catch (err) {
        console.error('Error during data copy:', err);
    } finally {
        // Close the connection
        await client.close();
        console.log('Disconnected from MongoDB');
    }
}


copyData(1717909759276);