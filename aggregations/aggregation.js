/**
 * @file aggregations/aggregations.js
 * @module aggregations
 * @description Functions to aggregate data for tests, mothers, devices, doctors, and platform-registered mothers.
 */

const users = require("../models/users"); // Import user model
const tests = require("../models/tests"); // Import tests model
const general = require("../general/general"); // import general functions

/**
 * Handles aggregation based on the request parameter.
 * @function aggregateData
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next function.
 */

exports.aggregateData = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'OPTIONS') {
        var aggregateParameter = req.body.aggregateParameter;
        var organizationId = req.body.organizationId;
        if (!aggregateParameter) {
            return res.status(400).json({
                "message": "Invalid Data"
            });
        }
        if (aggregateParameter.toLowerCase().includes("test")) {
            aggregateTests(organizationId).then(() => {
                return res.status(200).json({
                    "message": "Tests Aggregated Successfully!!"
                });
            }).catch(err => {
                return res.status(500).json({
                    "message": err.toString()
                });
            });
        }
        else if (aggregateParameter.toLowerCase().includes("platform mothers")) {
            aggregatePlatformRegMothers(organizationId).then(() => {
                return res.status(200).json({
                    "message": "Platform Mothers Aggregated Successfully!!"
                });
            }).catch(err => {
                return res.status(500).json({
                    "message": err.toString()
                });
            });
        }
        else if (aggregateParameter.toLowerCase().includes("mother")) {
            aggregateMothers(organizationId).then(() => {
                return res.status(200).json({
                    "message": "Mothers Aggregated Successfully!!"
                });
            }).catch(err => {
                return res.status(500).json({
                    "message": err.toString()
                });
            });
        }
        else if (aggregateParameter.toLowerCase().includes("device")) {
            aggregateDevices(organizationId).then(() => {
                return res.status(200).json({
                    "message": "Devices Aggregated Successfully!!"
                });
            }).catch(err => {
                return res.status(500).json({
                    "message": err.toString()
                });
            });
        }
        else if (aggregateParameter.toLowerCase().includes("doctor")) {
            aggregateDoctors(organizationId).then(() => {
                return res.status(200).json({
                    "message": "Doctors Aggregated Successfully!!"
                });
            }).catch(err => {
                return res.status(500).json({
                    "message": err.toString()
                });
            });
        }
        else {
            return res.status(400).json({
                "message": "Invalid Request"
            });
        }
    }
    else {
        return res.status(400).json({
            "message": "Invalid Request"
        });
    }
};

/**
 * Aggregates test data.
 * @function aggregateTests
 * @param {string} organizationId - The organization ID.
 * @returns {Promise<void>}
 */

function aggregateTests(organizationId) {
    return new Promise((resolve, reject) => {
        var query = [];
        if (organizationId) {
            query.push({ "$match": { "organizationId": organizationId } });
        }
        query.push({
            "$project": {
                "organizationId": 1
            }
        });
        query.push({
            "$group": {
                "_id": { "organizationId": "$organizationId" },
                "total": { "$sum": 1 }
            }
        });
        tests.aggregate(query).then(data => {
            var finalDic = {};
            for (org of data) {
                var orgId = org._id.organizationId;
                if (![null, undefined, "null", "undefined"].includes(orgId)) {
                    if (!(orgId in finalDic)) { finalDic[orgId] = {}; }
                    finalDic[orgId]["noOfTests"] = org.total;
                }
            }
            if (Object.keys(finalDic).length) {
                var firestoreUpdateList = [];
                for (elid in finalDic) {
                    var element = finalDic[elid];
                    element['documentId'] = elid;
                    firestoreUpdateList.push(element);
                }
                //console.log("firestoreUpdateList", firestoreUpdateList);
                general.updateToFirestore("users", firestoreUpdateList).then(() => {
                    return resolve();
                }).catch(err => {
                    return reject(err);
                });
            }
        }).catch(err => {
            return reject(err);
        });
    });
}
exports.aggregateTests = aggregateTests;

/**
 * Aggregates mother data.
 * @function aggregateMothers
 * @param {string} organizationId - The organization ID.
 * @returns {Promise<void>}
 */

function aggregateMothers(organizationId) {
    return new Promise((resolve, reject) => {
        var query = [];
        var match = { "type": "mother" };
        if (organizationId) {
            match["organizationId"] = organizationId;
        }
        query.push({ "$match": match });
        query.push({
            "$project": {
                "organizationId": 1
            }
        });
        query.push({
            "$group": {
                "_id": { "organizationId": "$organizationId" },
                "total": { "$sum": 1 }
            }
        });
        users.aggregate(query).then(data => {
            var finalDic = {};
            for (org of data) {
                var orgId = org._id.organizationId;
                if (![null, undefined, "null", "undefined"].includes(orgId)) {
                    if (!(orgId in finalDic)) { finalDic[orgId] = {}; }
                    finalDic[orgId]["noOfMother"] = org.total;
                }
            }
            if (Object.keys(finalDic).length) {
                var firestoreUpdateList = [];
                for (elid in finalDic) {
                    if (!elid) { continue; }
                    var element = finalDic[elid];
                    element['documentId'] = elid;
                    firestoreUpdateList.push(element);
                }
                //console.log(JSON.stringify(firestoreUpdateList));
                general.updateToFirestore("users", firestoreUpdateList).then(() => {
                    return resolve();
                }).catch(err => {
                    return reject(err);
                });
            }
        }).catch(err => {
            return reject(err);
        });
    });
}
exports.aggregateMothers = aggregateMothers;

/**
 * Aggregates device data.
 * @function aggregateDevices
 * @param {string} organizationId - The organization ID.
 * @returns {Promise<void>}
 */

function aggregateDevices(organizationId) {
    return new Promise((resolve, reject) => {
        var query = [];
        var match = { "type": "device" };
        if (organizationId) {
            match["organizationId"] = organizationId;
        }
        query.push({ "$match": match });
        query.push({
            "$project": {
                "organizationId": 1
            }
        });
        query.push({
            "$group": {
                "_id": { "organizationId": "$organizationId" },
                "total": { "$sum": 1 }
            }
        });
        users.aggregate(query).then(data => {
            var finalDic = {};
            for (org of data) {
                var orgId = org._id.organizationId;
                if (![null, undefined, "null", "undefined"].includes(orgId)) {
                    if (!(orgId in finalDic)) { finalDic[orgId] = {}; }
                    finalDic[orgId]["noOfDevice"] = org.total;
                }
            }
            if (Object.keys(finalDic).length) {
                var firestoreUpdateList = [];
                for (elid in finalDic) {
                    var element = finalDic[elid];
                    element['documentId'] = elid;
                    firestoreUpdateList.push(element);
                }
                general.updateToFirestore("users", firestoreUpdateList).then(() => {
                    return resolve();
                }).catch(err => {
                    return reject(err);
                });
            }
        }).catch(err => {
            return reject(err);
        });
    });
}
exports.aggregateDevices = aggregateDevices;

/**
 * Aggregates doctor data.
 * @function aggregateDoctors
 * @param {string} organizationId - The organization ID.
 * @returns {Promise<void>}
 */

function aggregateDoctors(organizationId) {
    return new Promise((resolve, reject) => {
        var query = [];
        var match = { "type": "doctor" };
        if (organizationId) {
            match["organizationId"] = organizationId;
        }
        query.push({ "$match": match });
        query.push({
            "$project": {
                "organizationId": 1
            }
        });
        query.push({
            "$group": {
                "_id": { "organizationId": "$organizationId" },
                "total": { "$sum": 1 }
            }
        });
        users.aggregate(query,).then(data => {
            var finalDic = {};
            for (org of data) {
                var orgId = org._id.organizationId;
                if (![null, undefined, "null", "undefined"].includes(orgId)) {
                    if (!(orgId in finalDic)) { finalDic[orgId] = {}; }
                    finalDic[orgId]["noOfDoctor"] = org.total;
                }
            }
            if (Object.keys(finalDic).length) {
                var firestoreUpdateList = [];
                for (elid in finalDic) {
                    var element = finalDic[elid];
                    element['documentId'] = elid;
                    firestoreUpdateList.push(element);
                }
                general.updateToFirestore("users", firestoreUpdateList).then(() => {
                    return resolve();
                }).catch(err => {
                    return reject(err);
                });
            }
        }).catch(err => {
            return reject(err);
        });
    });
}
exports.aggregateDoctors = aggregateDoctors;

/**
 * Aggregates platform-registered mothers.
 * @function aggregatePlatformRegMothers
 * @param {string} organizationId - The organization ID.
 * @returns {Promise<void>}
 */

function aggregatePlatformRegMothers(organizationId) {
    return new Promise((resolve, reject) => {
        var query = [];
        var match = { "type": "mother", "isSmsToMotherSent": true };
        if (organizationId) {
            match["organizationId"] = organizationId;
        }
        query.push({ "$match": match });
        query.push({
            "$project": {
                "organizationId": 1,
                "isPlatformReg": 1,
                "isSmsToMotherSent": 1
            }
        });
        query.push({
            "$group": {
                "_id": { "organizationId": "$organizationId" },
                "totalMothersSmsSent": { "$sum": 1 },
                "totalMotherRegPlatform": { "$sum": { "$cond": [{ "$eq": ["$isPlatformReg", true] }, 1, 0] } },
            }
        });
        users.aggregate(query).then(data => {
            var finalDic = {};
            for (org of data) {
                var orgId = org._id.organizationId;
                if (![null, undefined, "null", "undefined"].includes(orgId)) {
                    if (!(orgId in finalDic)) { finalDic[orgId] = {}; }
                    finalDic[orgId]["totalMotherRegPlatform"] = org.totalMotherRegPlatform;
                    finalDic[orgId]["totalMothersSmsSent"] = org.totalMothersSmsSent;
                }
            }
            if (Object.keys(finalDic).length) {
                var firestoreUpdateList = [];
                for (elid in finalDic) {
                    var element = finalDic[elid];
                    element['documentId'] = elid;
                    firestoreUpdateList.push(element);
                }
                general.updateToFirestore("users", firestoreUpdateList).then(() => {
                    return resolve();
                }).catch(err => {
                    return reject(err);
                });
            }
        }).catch(err => {
            return reject(err);
        });
    });
}
exports.aggregatePlatformRegMothers = aggregatePlatformRegMothers;
