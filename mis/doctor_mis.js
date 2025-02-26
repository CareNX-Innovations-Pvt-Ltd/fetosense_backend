/*jshint esversion: 6 */

/**
 * @file mis/doctor-mis.js
 * @module mis/doctor-mis
 * @description Fetches doctor-related data based on filters.
 */

const Devices = require("../models/users"); // Import devices model
const general=require("../general/general");

/**
 * Fetches doctor data based on filters.
 * 
 * - Filters doctors based on date range and organization ID.
 * - Ensures only non-deleted doctors are retrieved.
 * 
 * @function getData
 * @param {Object} req - Express request object containing:
 *   @param {string} [req.body.fromDate] - The start date for filtering doctors.
 *   @param {string} [req.body.toDate] - The end date for filtering doctors.
 *   @param {string} [req.body.organizationId] - The organization ID to filter doctors.
 * @param {Object} res - Express response object used to send HTTP responses.
 * @param {Function} next - Express next function (not used in this function).
 * @returns {void} - Sends the filtered doctor data or an error response.
 */

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

