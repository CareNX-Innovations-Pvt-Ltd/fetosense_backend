/*jshint esversion: 6 */
const Tests = require("../models/tests"); // Import tests model
const Users = require("../models/users"); // Import users model
const general = require("../general/general");

const average = (array) => array.reduce((a, b) => a + b) / array.length;

exports.getData = (req, res, next) => {
    console.log("Test_MIS", req.body);
    const fromDate = req.body.fromDate ? new Date(req.body.fromDate) : null;
    const toDate = req.body.toDate ? new Date(req.body.toDate) : null;
    const organization = req.body.organizationId;
    const doctorId = req.body.doctorId;
    var query = {
        "delete": false
    };
    var uquery = { "type": "mother" };
    console.log("fromDate", fromDate, "toDate", toDate);

    if (req.body.fromDate != 'undefined' && req.body.fromDate != null) {
        query["createdOn"] = { "$gte": fromDate, "$lt": toDate }
        uquery["$or"] = [{ "createdOn": { "$gte": fromDate, "$lt": toDate } }, { "modifiedAt": { "$gte": fromDate, "$lt": toDate } }]
    }
    else {
        query["createdOn"] = { "$lte": toDate }
    }

    if (organization) {
        query["organizationId"] = organization;
        uquery["organizationId"] = organization;
    }

    if (doctorId) {
        query["doctorId"] = doctorId;
        uquery["doctorId"] = doctorId;
    }
    var project = {
        // "associations":1, "audioFirePath":1, "audioLocalPath":1, "audioSynced":1, "createdBy":1, "createdOn":1, "delete":1, "deviceId":1, "deviceName":1,
        // "doctorId":1, "doctorName":1, "documentId":1, "gAge":1, "id":1, "imageFirePath":1, "imageLocalPath":1, "imgSynced":1, "interpretationExtraComments":1,
        // "interpretationType":1, "lengthOfTest":1, "modifiedAt":1, "modifiedTimeStamp":1, "motherId":1, "motherName":1,"organizationId":1, "organizationName":1,
        // "testById":1, "testByMother":1, "weight":1
        "createdOn": 1, "motherName": 1, "gAge": 1, "lengthOfTest": 1, "autoInterpretations": 1, "autoMovementEntries": 1,
        "movementEntries": 1, "testByMother": 1, "doctorName": 1, "organizationName": 1, "id": 1, "documentId": 1, "organizationId": 1, "motherId": 1,
        "tocoEntries": 1, "deviceId": 1, "autoFetalMovement": 1, "fisherScore": 1
    };
    var momDict = {};
    var finalLst = [];

    console.log("uquery", uquery);
    Users.find(uquery, { "age": 1 }, {}).then((moms) => {
        console.log("moms", moms.length);
        for (var i = 0; i < moms.length; i++) {
            var mom = general.clone(JSON.parse(JSON.stringify(moms[i])));
            momDict[mom._id] = mom.age;
        }
        console.log("tquery", query);
        return testsQuery = Tests.find(query, project, {});
    }).then(documents => {
        for (var i = 0; i < documents.length; i++) {
            var doc = general.clone(JSON.parse(JSON.stringify(documents[i])));
            var autoCnt = 0;
            doc.autoMovementEntries = doc.autoMovementEntries ? doc.autoMovementEntries : [];
            for (var ac of doc.autoMovementEntries) { if (ac >= 5) { autoCnt += 1; } }
            doc["noAutoMovementEntries"] = autoCnt;


            doc.autoFetalMovement = doc.autoFetalMovement ? doc.autoFetalMovement : [];
            doc["noAutoFetalMovement"] = doc.autoFetalMovement.length;


            var mcnt = 0;
            doc.movementEntries = doc.movementEntries ? doc.movementEntries : [];
            for (var mc of doc.movementEntries) { if (mc >= 5) { mcnt += 1; } }
            doc["noMovementEntries"] = mcnt;
            doc["age"] = momDict[doc.motherId] ? momDict[doc.motherId] : 0;
            if (doc.tocoEntries && typeof doc.tocoEntries === 'string') { doc.tocoEntries = JSON.parse(doc.tocoEntries); }
            doc.testType = (doc.tocoEntries) && (doc.tocoEntries.length) && (average(doc.tocoEntries) > 1) ? "CTG" : "NST";
            delete doc.autoMovementEntries;
            delete doc.movementEntries;
            finalLst.push(doc);
        }
        //console.log("momDict", momDict);
        res.status(200).json({
            message: "Tests fetched successfully!",
            data: finalLst,
            count: finalLst.length
        });
    }).catch(error => {
        console.error(error);
        res.status(500).json({ message: "Fetching Tests failed!" });
    });
};




