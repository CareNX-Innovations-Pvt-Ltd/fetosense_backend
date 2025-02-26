/*jshint esversion: 6 */

/**
 * @file mis/device-mis.js
 * @module mis/device-mis
 * @description Fetches device-related data, processes organization information, and calculates statistics.
 */

const Users = require("../models/users"); // Import devices model
const general = require("../general/general");

/**
 * Fetches device data based on filters and enriches it with organization details.
 * 
 * - Filters devices based on date range, organization ID, and activity status.
 * - Retrieves associated organization details.
 * - Merges organization information into the device data.
 * 
 * @function getData
 * @param {Object} req - Express request object containing:
 *   @param {string} [req.body.fromDate] - The start date for filtering devices.
 *   @param {string} [req.body.toDate] - The end date for filtering devices.
 *   @param {string} [req.body.dateFilterCriteria="createdOn"] - The field used for date filtering.
 *   @param {string} [req.body.organizationId] - The organization ID to filter devices.
 * @param {Object} res - Express response object used to send HTTP responses.
 * @param {Function} next - Express next function (not used in this function).
 * @returns {void} - Sends the filtered and processed device data or an error response.
 */

exports.getData = (req, res, next) => {
    const fromDate = req.body.fromDate ? new Date(req.body.fromDate) : null;
    const toDate = req.body.toDate ? new Date(req.body.toDate) : null;
    const dateFilterCriteria = req.body.dateFilterCriteria ? req.body.dateFilterCriteria : "createdOn";
    const organization = req.body.organizationId;
    // var query={"isDeleted": false}
    var query = { 
        "type": "device" ,
        "isActive": {"$ne": false}
    };
    var queryOrg = { "type": "organization" };

    if (organization) {
        query["organizationId"] = organization;
        queryOrg["documentId"] = organization;
    }

    if (req.body.fromDate != 'undefined' && req.body.fromDate != null) {
        query[dateFilterCriteria] = { "$gte": fromDate, "$lt": toDate }
    }
    else {
        query[dateFilterCriteria] = { "$lte": toDate }
    }

    var orgDic = {};
    //console.log("query", query);
    //console.log("queryOrg", queryOrg);
    const deviceQuery = Users.find(query);
    const orgQuery = Users.find(queryOrg);
    orgQuery.then(orgs => {
        for (var org of orgs) {
            orgDic[org.documentId] = JSON.parse(JSON.stringify(org));
        }
        //console.log("orgDic", orgDic);
        return deviceQuery;

    }).then(documents => {
        //console.log("documents.lenght", documents.length)
        orgDic = JSON.parse(JSON.stringify(orgDic));
        //console.log("orgDic", orgDic);
        for (ctr = 0; ctr < documents.length; ctr++) {
            doc = documents[ctr];
            doc = JSON.parse(JSON.stringify(doc));
            orgn = (doc["organizationId"] in orgDic) ? orgDic[doc["organizationId"]] : {};
            // console.log("orgDic[doc['organizationId']]",orgDic[doc["organizationId"]], JSON.parse(JSON.stringify(orgDic[doc["organizationId"]])));
            // console.log("org1", orgn);
            orgn = JSON.parse(JSON.stringify(orgn));
            // console.log("org2", orgn);
            // console.log("org.documentId", doc["organizationId"], orgn.documentId, doc["organizationId"] in orgDic, orgn);
            doc.status = orgn.status ? orgn.status : null;
            doc.addressLine = orgn.addressLine ? orgn.addressLine : null;
            doc.city = orgn.city ? orgn.city : null;
            doc.state = orgn.state ? orgn.state : null;
            doc.lastSeenTime = doc.lastSeenTime ? doc.lastSeenTime : null;
            doc.contactPerson = orgn.contactPerson ? orgn.contactPerson : null;
            doc.contactEmail = orgn.email ? orgn.email : null;
            doc.contactMobile = orgn.mobile ? orgn.mobile : null;

            documents[ctr] = doc;
            //console.log("doc", doc);
        }
        //console.log("documents", documents);
        return res.status(200).json({
            message: "Devices fetched successfully!",
            data: documents,
            count: documents.length
        });
    })
        .catch(error => {
            console.log("Error", error);
            res.status(500).json({
                message: "Fetching Devices failed!"
            });
        });
};

/**
 * Computes the average of an array of numbers.
 * 
 * - Uses `reduce` to sum all elements and divides by the array length.
 * 
 * @function average
 * @param {number[]} array - The array of numbers to calculate the average.
 * @returns {number} - The computed average.
 */

const average = (array) => array.reduce((a, b) => a + b) / array.length;