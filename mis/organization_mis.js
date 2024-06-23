/*jshint esversion: 6 */
const Users = require("../models/users"); // Import devices model
const Tests = require("../models/tests"); // Import tests model
const aggregations = require("../aggregations/aggregation"); // import aggregations functions

const general = require("../general/general");
const { aggregate } = require("../models/users");
exports.getData = (req, res, next) => {
    const fromDate = req.body.fromDate ? new Date(req.body.fromDate) : null;
    const toDate = req.body.toDate ? new Date(req.body.toDate) : null;

    var query = {
        "type": "organization",
        "isDeleted": { "$ne": true }
    }
    var testAggrQuery = [
        {
            "$project": {
                "organizationId": 1,
                "isDeleted": 1
            }
        },
        // {
        //     "$match": {
        //         "isDeleted": {"$ne": true}
        //     }
        // },
        {
            "$group": {
                "_id": { "organizationId": "$organizationId" },
                "totalTests": { "$sum": 1 }
            }
        }
    ];
    var mothersAggrQuery = [
        {
            "$project": {
                "organizationId": 1,
                "isDeleted": 1,
                "type": 1
            }
        },
        {
            "$match": {
                // "isDeleted": {"$ne": true},
                "type": "mother"
            }
        },
        {
            "$group": {
                "_id": { "organizationId": "$organizationId" },
                "totalMothers": { "$sum": 1 }
            }
        }
    ];

    if (req.body.fromDate != 'undefined' && req.body.fromDate != null) {
        query["createdOn"] = { "$gte": fromDate, "$lt": toDate }
    }
    else {
        query["createdOn"] = { "$lte": toDate }
    }

    var testsCounts = {}; var mothersCounts = {};
    console.log("qry1", query);
    const orgQuery = Users.find(query);
    orgQuery.then(documents => {
        console.log("documents.length", documents.length);
        var allDocuments = JSON.parse(JSON.stringify(documents));
        console.log("testAggrQuery", testAggrQuery);
        // Tests.aggregate(testAggrQuery, {
        //     maxTimeMS: 240000
        // }, function (err, tdocs) {
        //     if (err) {
        //         console.error("Aggregation error:", err);
        //         return;
        //     }
        //     console.log("tdocs.length", tdocs.length);
        //     for (tdoc of tdocs) {
        //         testsCounts[tdoc._id.organizationId] = tdoc.totalTests;
        //     }
        console.log("mothersAggrQuery", mothersAggrQuery);
        Users.aggregate(mothersAggrQuery).then(udocs => {
            console.log("udocs.length", udocs.length);
            for (udoc of udocs) {
                mothersCounts[udoc._id.organizationId] = udoc.totalMothers;
            }
            for (var cnt = 0; cnt < documents.length; cnt++) {
                //allDocuments.push(documents[cnt]);
                var doc = allDocuments[cnt];
                //console.log(doc.documentId);
                if (allDocuments[cnt]["noOfMother"] != mothersCounts[doc.documentId]) {
                    aggregations.aggregateMothers(doc.documentId);
                }
                if (allDocuments[cnt]["noOfTests"] != testsCounts[doc.documentId]) {
                    aggregations.aggregateTests(doc.documentId);
                }
                allDocuments[cnt]["noOfMother"] = mothersCounts[doc.documentId];
                allDocuments[cnt]["noOfTests"] = testsCounts[doc.documentId];
            }
            //console.log(allDocuments[0], allDocuments[0].costructor);
            res.status(200).json({
                message: "Organizations fetched successfully!",
                data: allDocuments,
                count: allDocuments.length
            });
        }).catch(error => {
            console.log("Error", error);
            res.status(500).json({
                message: "Fetching Organizations failed!"
            });
        });

        //})
        // .catch(error => {
        //     console.log("Error", error);
        //     res.status(500).json({
        //         message: "Fetching Organizations failed!"
        //     });
        // });

    }).catch(error => {
        console.log("Error", error);
        res.status(500).json({
            message: "Fetching Organizations failed!"
        });
    });
};

