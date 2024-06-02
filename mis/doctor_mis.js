/*jshint esversion: 6 */
const Devices = require("../models/users"); // Import devices model
const general=require("../general/general");
exports.getData = (req, res, next) => {
    const fromDate = req.body.fromDate ? new Date(req.body.fromDate):null;
    const toDate = req.body.toDate ? new Date(req.body.toDate):null;
    const organization=req.body.organizationId;
     var query={
        "type":"doctor",
        "delete": false
    }

    if (organization) {
        query["organizationId"] = organization
    }

    if (req.body.fromDate != 'undefined' && req.body.fromDate != null) {
        query["createdOn"] = { "$gte": fromDate, "$lt": toDate }
    }
    else {
        query["createdOn"] = { "$lte": toDate }
    }
      
    const deviceQuery = Devices.find(query);
    deviceQuery.then(documents => {
        res.status(200).json({
            message: "Doctor fetched successfully!",
            data: documents,
            count: documents.length
        });
    })
        .catch(error => {
            console.log("Error", error);
            res.status(500).json({
                message: "Fetching Doctor failed!"
            });
        });
};

