/*jshint esversion: 6 */

const users = require("../models/users"); // Import user model
const dataset = require("../models/dataset"); // Import dataset model
const devices = require("../models/devices"); // Import devices model
const notifications = require("../models/notifications"); // Import notifications model
const tests = require("../models/tests"); // Import tests model
const audio = require("../models/audio"); // Import audio model
const ValidTests = require("../models/valid_tests"); // Import ValidTests model

var request = require('request');

var config = require("../config");

var log = require('../logger.js').LOG;
const apiKeys = require("../apiKeys.json"); // Import Tracker Model

const firestoreApiUrl = "https://us-central1-" + config.configValue.projectId + ".cloudfunctions.net/updateToFirestore/";

const collections = {
    'users': users,
    'dataset': dataset,
    'devices': devices,
    "notifications": notifications,
    "tests": tests,
    "ValidTests": ValidTests,
    "audio": audio
};

JSON.dateParser = function (key, value) {
    var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
    var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;
    if (typeof value === 'string') {
        var a = reISO.exec(value);
        if (a)
            return new Date(value);
        a = reMsAjax.exec(value);
        if (a) {
            var b = a[1].split(/[-+,.]/);
            return new Date(b[0] ? +b[0] : 0 - +b[1]);
        }
    }
    return value;
};

exports.mongoInsert = async (req, res, next) => {
    // get post body parameter
    console.log("Insertig data");
    var data = req.body.data;
    var collection = req.body.collection;
    try {
        checkApiKeys(req.body, ["Admin"]);
    }
    catch (err) {
        console.error("Error", err);
        return res.status(401).json({
            message: "Unauthorised",
            statusCode: 401,
            err: err
        });
    }
    data = JSON.parse(data, JSON.dateParser);
    if (data.constructor === Array) {
        for (elm of data) {
            await new Promise((resolve, reject) => {
                insertDataToMongoDB(elm, collection)
                    .then(() => { resolve() })
                    .catch(err => {
                        res.status(400).json({
                            message: "Error",
                            statusCode: 400,
                            err: err
                        }); reject(err)
                    });
            })
        }
        return res.status(200).json({
            message: "Records Updated",
            statusCode: 200
        });
    }
    else {
        insertDataToMongoDB(data, collection).then((retStr) => {
            return res.status(200).json({
                message: retStr,
                statusCode: 200
            });
        }).catch(err => {
            console.error(err);
            return res.status(400).json({
                message: "Error",
                statusCode: 400,
                err: err
            });
        });
    }
};

function insertDataToMongoDB(data, collection) {
    return new Promise((resolve, reject) => {
        //console.log(data);
        if (!(data && collection && data.documentId && collections[collection])) {
            console.log("Found Err", data, collection);
            return reject(new Error("bad request, data provided is improper."));
        }
        log.info("{datetime:'" + new Date().toISOString() + "', collection:'" + collection + "', documentId:'" + data.documentId + "'}");

        if (!("_id" in data) && ("documentId" in data)) { data["_id"] = data["documentId"].toString() }
        var options = { upsert: true, new: true, setDefaultsOnInsert: false, useFindAndModify: false };
        var userQuery = collections[collection].findOneAndUpdate({ "_id": data["documentId"] }, data, options);
        userQuery.then(() => {
            return resolve("Data inserted properly");
        }).catch(error => {
            console.log(error, 'error')
            log.error(error);
            return reject(error);
        });
    });
}

exports.mongoAggregate = (req, res, next) => {
    // get post body parameter
    var query = req.body.query;
    var collection = req.body.collection;
    try {
        checkApiKeys(req.body, ["Admin"]);
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorised",
            statusCode: 401,
            err: err
        });
    }
    if (query.constructor == String) {
        query = JSON.parse(query, JSON.dateParser);
    } else {
        query = JSON.parse(JSON.stringify(query), JSON.dateParser);
    }

    if (!(query && collection && collections[collection])) {
        return res.status(400).json({
            message: "bad request, data provided is improper.",
            statusCode: 400
        });
    }
    var userQuery = collections[collection].aggregate(query);
    userQuery.then((result) => {
        res.status(200).json(result);
    }).catch(error => {
        console.log(error, 'error')
        log.error(error);
        try {
            res.status(500).json({
                message: "Internal Server Error",
                error: JSON.stringify(error)
            });
        } catch (err) {
            console.log("err", err);
        }
    });
};

exports.mongoFind = (req, res, next) => {
    // get post body parameter
    // reqDummy = {
    //     "query": { "modifiedTimeStamp": { "$gt": 0 } },
    //     "project": { "documentId": 1, "modifiedTimeStamp": 1 },
    //     "options": { "limit": 4, "sort": { "modifiedTimeStamp": -1 } },
    //     "collection": "Users",
    //     "apiKey": ""
    // }

    var query = req.body.query;
    var options = req.body.options;
    var project = req.body.project;
    var collection = req.body.collection;
    console.log("query", query, "options", options, "project", project, "collection", collection);
    try {
        checkApiKeys(req.body, ["Admin"]);
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorised",
            statusCode: 401,
            err: err
        });
    }
    if (query.constructor == String) {
        query = JSON.parse(query, JSON.dateParser);
    } else {
        query = JSON.parse(JSON.stringify(query), JSON.dateParser);
    }

    if (options && options.constructor == String) {
        options = JSON.parse(options, JSON.dateParser);
        options['maxTime'] = 20000;
    }
    if (project && project.constructor == String) {
        project = JSON.parse(project, JSON.dateParser);
    }

    if (!(query && collection && collections[collection])) {
        return res.status(400).json({
            message: "bad request, data provided is improper.",
            statusCode: 400
        });
    }
    var userQuery = collections[collection];
    if (!project) { project = null; }
    if (options) { userQuery = userQuery.find(query, project, options); } else { userQuery = userQuery.find(query, project); }

    userQuery.maxTime(20000).then((result) => {
        res.status(200).json(result);
    }).catch(error => {
        console.log(error, 'error')
        try {
            res.status(500).json({
                message: "Internal Server Error",
                error: JSON.stringify(error)
            });
        } catch (err) {
            console.log("err", err);
        }
    });
};

exports.mongoUpdate = async (req, res, next) => {
    // get post body parameter
    var data = req.body.data;
    var collection = req.body.collection;
    try {
        checkApiKeys(req.body, ["Admin"]);
    }
    catch (err) {
        return res.status(401).json({
            message: "Unauthorised",
            statusCode: 401,
            err: err
        });
    }
    if (data.constructor === Object) {
        data = JSON.stringify(data);
    }
    data = JSON.parse(data, JSON.dateParser);
    if (data.constructor === Array) {
        for (elm of data) {
            await new Promise((resolve, reject) => {
                updateDataToMongoDB(elm, collection)
                    .then(() => { resolve() })
                    .catch(err => {
                        res.status(400).json({
                            message: "Error",
                            statusCode: 400,
                            err: err
                        }); reject(err)
                    });
            })
        }
        return res.status(200).json({
            message: "Records Updated",
            statusCode: 200
        });
    }
    else {
        updateDataToMongoDB(data, collection).then((retStr) => {
            return res.status(200).json({
                message: retStr,
                statusCode: 200
            });
        }).catch(err => {
            return res.status(400).json({
                message: "Error",
                statusCode: 400,
                err: err
            });
        });
    }
};

function updateDataToMongoDB(data, collection) {
    return new Promise((resolve, reject) => {
        //console.log(data);
        if (!(data && collection && data.documentId && collections[collection])) {
            console.log("Found Err", "bad request, data provided is improper.");
            return reject(new Error("bad request, data provided is improper."));
        }
        log.info("{datetime:'" + new Date().toISOString() + "', collection:'" + collection + "', documentId:'" + data.documentId + "'}");

        //if (!("_id" in data) && ("documentId" in data)) { data["_id"] = data["documentId"].toString() }
        var options = { multi: false };
        var userQuery = collections[collection].update({ "documentId": data["documentId"] }, data, options);
        userQuery.then(() => {
            return resolve("Data updated properly");
        }).catch(error => {
            console.log(error, 'error')
            log.error(error);
            return reject(error);
        });
    });
}

exports.mongoDelete = (req, res, next) => {
    // get post body parameter
    // reqDummy = {
    //     "query": { "modifiedTimeStamp": { "$gt": 0 } },
    //     "project": { "documentId": 1, "modifiedTimeStamp": 1 },
    //     "options": { "limit": 4, "sort": { "modifiedTimeStamp": -1 } },
    //     "collection": "Users",
    //     "apiKey": ""
    // }

    var query = req.body.query;
    var collection = req.body.collection;
    console.log("query", query, "collection", collection);
    try {
        checkApiKeys(req.body, ["Admin"]);
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorised",
            statusCode: 401,
            err: err
        });
    }
    if (query.constructor == String) {
        query = JSON.parse(query, JSON.dateParser);
    } else {
        query = JSON.parse(JSON.stringify(query), JSON.dateParser);
    }
    if (!(query && collection && collections[collection])) {
        return res.status(400).json({
            message: "bad request, data provided is improper.",
            statusCode: 400
        });
    }
    var userQuery = collections[collection];
    userQuery = userQuery.deleteMany(query);
    userQuery.then((result) => {
        res.status(200).json(result);
    }).catch(error => {
        console.log(error, 'error')
        try {
            res.status(500).json({
                message: "Internal Server Error",
                error: JSON.stringify(error)
            });
        } catch (err) {
            console.log("err", err);
        }
    });
};

exports.sendRequestFromServerJSON = (req, res, next) => {
    const url = req.body.url;
    var requestData = req.body.data;
    const method = req.body.method;
    const debug = req.body.debug;
    if (debug) {
        console.log("url", url, "requestData", requestData, "method", method, "debug", debug);
    }
    if (requestData.constructor == String) { requestData = JSON.parse(requestData); }
    try {
        checkApiKeys(req.body, ["Admin"]);
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorised",
            statusCode: 401,
            err: err
        });
    }
    var options = {
        method: method,
        url: url,
        json: requestData
    };

    request(options, function (error, response, body) {
        if (error) {
            return res.status(401).json({
                message: "Unauthorised",
                statusCode: 401,
                err: err
            });
        }
        else {
            return res.status(200).json({
                message: body,
                statusCode: 200
            });
        }
    });
}

function updateToFirestore(collection, data) {
    data = JSON.stringify(data);
    return sendPostRequest(firestoreApiUrl, { "collection": collection, "data": data });
}
exports.updateToFirestore = updateToFirestore;

function sendPostRequest(url, requestData) {
    return new Promise((resolve, reject) => {
        var options = {
            method: 'POST',
            url: url,
            headers:
            {
                'cache-control': 'no-cache',
                'content-type': 'application/x-www-form-urlencoded'
            },
            form: requestData
        };

        request(options, function (error, response, body) {
            if (error) { reject(error); throw new Error(error) };
            resolve();
        });
    });
}
exports.sendPostRequest = sendPostRequest;

function checkApiKeys(data, allowdUsers) {
    var keySet = [];
    var apiKey;
    //console.log(data,allowdUsers,apiKeys )
    if ("apiKey" in data && allowdUsers && apiKeys) {
        apiKey = data["apiKey"];
    } else {
        throw new Error("Unauthorised");
    }
    for (user in apiKeys) {
        if (allowdUsers.includes(user) || allowdUsers.includes("Any")) {
            keySet = keySet.concat(apiKeys[user]);
        }
    }
    if (keySet.includes(apiKey)) {
        return true;
    } else {
        throw new Error("Unautenticated");
    }
}

exports.checkApiKeys = checkApiKeys;

function set2Digit(num) {
    return ("0" + num).substr(-2);
}
exports.set2Digit = set2Digit;

function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

exports.clone = clone;

exports.sortByKey = function (array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

exports.sortByKeyStartsWith = function (array, key, phrase) {
    return array.sort(function (a, b) {
        var x = a[key].toLowerCase(); var y = b[key].toLowerCase();
        phrase = phrase.toLowerCase();
        var xv = x.startsWith(phrase) ? 2 : 0;
        xv += x.includes(" " + phrase) ? 1 : 0;
        var yv = y.startsWith(phrase) ? 2 : 0;
        yv += y.includes(" " + phrase) ? 1 : 0;
        return ((xv > yv) ? -1 : ((xv < yv) ? 1 : 0));
    });
}