/*jshint esversion: 6 */

/**
 * @file search/search.js
 * @module search/search
 * @description Handles searching for mothers in the BabyBeat and Fetosense databases.
 */

const Users = require("../models/users"); // Import devices model
const BBUsers = require("../models/babybeat").BBUsers;
const general = require("../general/general");

/**
 * Searches for mothers based on the provided search string.
 * 
 * - Uses regex matching for flexible name searching.
 * - Filters based on `searchDocumentId` (BabyBeat doctor association).
 * - Filters based on `orgDocumentId` (Fetosense organization association).
 * - Sorts results to prioritize names that start with the search string.
 * 
 * @function searchMother
 * @param {Object} req - Express request object.
 *   @param {string} [req.body.searchDocumentId] - (Optional) Doctor's document ID for filtering BabyBeat mothers.
 *   @param {string} [req.body.orgDocumentId] - (Optional) Organization ID for filtering Fetosense mothers.
 *   @param {string} req.body.searchString - Search term (minimum 3 characters required).
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 * @returns {void} - Sends JSON response containing matched mothers or an error message.
 */

exports.searchMother = (req, res, next) => {
    const searchDocumentId = req.body.searchDocumentId ? req.body.searchDocumentId : null;
    const orgDocumentId = req.body.orgDocumentId ? req.body.orgDocumentId : null;
    const searchString = req.body.searchString ? req.body.searchString : "";
    try {
        general.checkApiKeys(req.body, ["Admin"]);
    }
    catch (err) {
        return res.status(401).json({
            message: "Unauthorised",
            statusCode: 401,
            err: err
        });
    }
    if (searchString.length < 3) {
        return res.status(401).json({
            message: "short/ no search string",
            statusCode: 400
        });
    }

    // var query={"isDeleted": false}
    // var queryBB = { $text: { $search: searchString } };
    // var queryFeto = { $text: { $search: searchString } };
    var queryBB = { "fullName": { $regex: searchString, $options: 'xi' } };
    var queryFeto = { "name": { $regex: searchString, $options: 'xi' } };
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    if (searchDocumentId) {
        queryBB["association.babybeat_doctor.documentId"] = searchDocumentId;
    }
    if (orgDocumentId) {
        queryFeto["organizationId"] = orgDocumentId;
        queryFeto["type"] = "mother";
    }

    var allMoms = [];
    BBUsers.find(queryBB, { "fullName": 1, "edd": 1 }).then(bbres => {
        //console.log(JSON.stringify(bbres));
        for (let b of bbres) {
            var bb = JSON.parse(JSON.stringify(b));
            bb["type"] = "BabyBeat";
            bb["documentId"] = bb._id;
            allMoms.push(bb);
        }
        return Users.find(queryFeto, { "name": 1, "edd": 1, "lmp": 1 });
    }).then(fres => {
        //console.log(JSON.stringify(fres));
        for (let f of fres) {
            var fd = JSON.parse(JSON.stringify(f));
            allMoms.push({ "fullName": fd.name, "edd": fd.edd, "lmp": fd.lmp, "type": "Fetosense", "documentId": fd._id });
        }
        allMoms = general.sortByKeyStartsWith(allMoms, "fullName", searchString);
        return res.status(200).json({
            data: allMoms,
            message: "Searching successfull!!",
            statusCode: 200
        });
    }).catch(error => {
        console.log("Error", error);
        return res.status(500).json({
            message: "Searching Failed!!",
            statusCode: 500
        });
    });
};