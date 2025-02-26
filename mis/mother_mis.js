/*jshint esversion: 6 */

/**
 * @file mis/mother-mis.js
 * @module mis/mother-mis
 * @description Fetches mother-related data based on filters and enriches it with organization and device information.
 */

const Users = require("../models/users"); // Import devices model
const general = require("../general/general");

/**
 * Fetches mother data based on filters and enriches it with organization and device details.
 * 
 * - Filters mothers based on date range and organization ID.
 * - Retrieves associated organization and device information.
 * - Adjusts timestamps to IST (UTC+5:30).
 * - Merges organization and device details into the mother data.
 * 
 * @function getData
 * @param {Object} req - Express request object containing:
 *   @param {string} [req.body.fromDate] - The start date for filtering mothers.
 *   @param {string} [req.body.toDate] - The end date for filtering mothers.
 *   @param {string} [req.body.organizationId] - The organization ID to filter mothers.
 * @param {Object} res - Express response object used to send HTTP responses.
 * @param {Function} next - Express next function (not used in this function).
 * @returns {void} - Sends the filtered mother data or an error response.
 */

exports.getData = (req, res, next) => {
    console.log("body", JSON.stringify(req.body));
    var fromDate = req.body.fromDate ? new Date(req.body.fromDate) : null;
    if (fromDate) {
        fromDate.setHours(fromDate.getHours() + 5);
        fromDate.setMinutes(fromDate.getMinutes() + 30);
        fromDate.setHours(0, 0, 0, 0);
        console.log("fromDate", fromDate);
    }
    var toDate = req.body.toDate ? new Date(req.body.toDate) : null;
    if (toDate) {
        toDate.setHours(toDate.getHours() + 5);
        toDate.setMinutes(toDate.getMinutes() + 30);
        toDate.setHours(23, 59, 59, 999);
        console.log("toDate", toDate);
    }
    const organization = req.body.organizationId;
    var query = { 
        "type": "mother" ,
        "delete": false
    }
    var deviceQry = { "type": "device" };
    var orgQry = { "type": "organization" };
    if (organization) {
        query["organizationId"] = organization;
        deviceQry["organizationId"] = organization;
        orgQry["documentId"] = organization;
    }

    if (req.body.fromDate != 'undefined' && req.body.fromDate != null) {
        query["createdOn"] = { "$gte": fromDate, "$lt": toDate }
    }
    else {
        query["createdOn"] = { "$lte": toDate }
    }
    console.log(JSON.stringify(query));
    const usrQry = Users.find(query);
    var documents = null;
    var organizations = {};
    usrQry.then(udocs => {
        documents = udocs;
        return Users.find(orgQry, {"documentId": 1, "status":1});

    }).then(odocs => {
        for(od of odocs){
            organizations[od.documentId] = JSON.parse(JSON.stringify(od));
        }
        return Users.find(deviceQry, {"documentId": 1, "appVersion":1});

    }).then(ddocs => {
        var allDevices = {};
        for (var d of ddocs) {
            d=JSON.parse(JSON.stringify(d));
            //console.log(d, d["appVersion"]);
            allDevices[d.documentId] = d["appVersion"];
        }
        //console.log("organizations", organizations);
        for (var i = 0; i<documents.length; i++) {
            documents[i] = JSON.parse(JSON.stringify(documents[i]));
            //console.log(documents[i].deviceId, allDevices[documents[i].deviceId]);
            documents[i]["appVersion"] = allDevices[documents[i].deviceId] ? allDevices[documents[i].deviceId] : null;
            documents[i]["status"] = organizations[documents[i].organizationId] ? organizations[documents[i].organizationId].status : null;
            //if(i<10){console.log("documents[i].organizationId", documents[i].organizationId,"organizations[documents[i].organizationId].status", organizations[documents[i].organizationId].status )}
        }
        res.status(200).json({
            message: "Mother fetched successfully!",
            data: documents,
            count: documents.length
        });
    })
        .catch(error => {
            console.log("Error", error);
            res.status(500).json({
                message: "Fetching Mother failed!"
            });
        });
};

