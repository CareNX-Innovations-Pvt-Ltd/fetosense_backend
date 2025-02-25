const users = require("../models/users"); // Import user model
const dataset = require("../models/dataset"); // Import dataset model
const devices = require("../models/devices"); // Import devices model
const notifications = require("../models/notifications"); // Import notifications model
const tests = require("../models/tests"); // Import tests model
const ValidTests = require("../models/valid_tests"); // Import ValidTests model
const general = require("../general/general"); // import general functions

const set2Digit = general.set2Digit;
exports.getDashboardData = (req, res, next) => {
    var loginUserId = req.body.documentId;
    var fromDate = req.body.fromDate ? new Date(req.body.fromDate) : null;
    var toDate = req.body.toDate ? new Date(req.body.toDate) : null;
    try {
        general.checkApiKeys(req.body, ["Admin"]);
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorised",
            statusCode: 401,
            err: err
        });
    }
    return getDashboardData(loginUserId, fromDate, toDate).then(data => {
        return res.status(200).json({
            message: "success",
            data: data,
            statusCode: 200,
            err: null
        })
    }).catch(err => {
        console.error(err);
        return res.status(500).json({
            message: "Some Error occurred",
            statusCode: 500,
            err: err
        })
    });
}

function getDashboardData(loginUserId, fromDate, toDate) {
    var retDict = { "totalDoctors": 0, "totalDevices": 0, "totalOrgs": 0, "totalMothers": 0, "totalTests": 0, "totalMothersSmsSent":0, "totalMotherRegPlatform":0 };
    return new Promise((resolve, reject) => {
        getDirectAnalytics(retDict, fromDate, toDate).then(retDictPopulated => {
            prepareTrend(fromDate, toDate).then(trend => {

                retDictPopulated.trend = trend;
                resolve(retDictPopulated);
            }).catch(err => {
                reject(err);
            });
        }).catch(err => {
            reject(err);
        });
    });
}

function getDirectAnalytics(retDict, fromDate, toDate) {
    return new Promise((resolve, reject) => {
        let usrQry = [
            {
                "$project": {
                    "name": 1,
                    "type": 1,
                    "isPlatformReg": 1,
                    "isSmsToMotherSent": 1
                }
            },
            {
                "$group": {
                    "_id": { "type": "$type" },
                    "total": { "$sum": 1 },
                    "totalMothersSmsSent": { "$sum": { "$cond": [{ "$eq": ["$isSmsToMotherSent", true] }, 1, 0] } },
                    "totalMotherRegPlatform": { "$sum": { "$cond": [{ "$eq": ["$isPlatformReg", true] }, 1, 0] } }
                }
            }
        ];
        let testQry = [
            {
                "$project": {
                    "_id": 1
                }
            },
            {
                "$group": {
                    "_id": null,
                    "total": { "$sum": 1 }
                }
            }
        ];
        if (fromDate && toDate) {
            var dateMatch = [{ "$match": { "createdOn": { "$gte": fromDate, "$lte": toDate } } }]
            usrQry = dateMatch.concat(usrQry);
            testQry = dateMatch.concat(testQry);
        }

        users.aggregate(usrQry).then(response => {
            try {
                for (usrObj of response) {
                    if (usrObj._id.type == "mother") {
                        retDict.totalMothers = usrObj.total;
                        retDict.totalMothersSmsSent = usrObj.totalMothersSmsSent;
                        retDict.totalMotherRegPlatform = usrObj.totalMotherRegPlatform;

                    }
                    if (usrObj._id.type == "device") {
                        retDict.totalDevices = usrObj.total;
                    }
                    if (usrObj._id.type == "organization") {
                        retDict.totalOrgs = usrObj.total;
                    }
                    if (usrObj._id.type == "doctor") {
                        retDict.totalDoctors = usrObj.total;
                    }
                }
                tests.aggregate(testQry).then(respTest => {
                    if (respTest && respTest.length) {
                        retDict.totalTests = respTest[0].total;
                    }
                    resolve(retDict);
                }).catch(err => {
                    reject(err);
                })
            }
            catch (err) {
                reject(err);
            }
        }).catch(err => {
            reject(err);
        })
    })
}

// function prepareTrend(startDate, endDate) {
//     var qry = [
//         { "$match": { "type": "mother", "createdOn": { "$gte": startDate, "$lte": endDate } } },
//         {
//             "$project": {
//                 "day": { "$dayOfMonth": "$createdOn" },
//                 "month": { "$month": "$createdOn" },
//                 "year": { "$year": "$createdOn" },
//             }
//         },
//         {
//             "$group": {
//                 "_id": { "day": "$day", "month": "$month", "year": "$year" },
//                 "mothersRegistered": { "$sum": 1 },
//             }
//         }
//     ];

//     var qryTests = [
//         { "$match": { "createdOn": { "$gte": startDate, "$lte": endDate } } },
//         {
//             "$project": {
//                 "day": { "$dayOfMonth": "$createdOn" },
//                 "month": { "$month": "$createdOn" },
//                 "year": { "$year": "$createdOn" },
//             }
//         },
//         {
//             "$group": {
//                 "_id": { "day": "$day", "month": "$month", "year": "$year" },
//                 "testsTaken": { "$sum": 1 },
//             }
//         }
//     ];
//     //console.log("___debug qry", JSON.stringify(qry[0]));
//     //console.log("___debug qryTests", JSON.stringify(qryTests[0]));
//     return new Promise((resolve, reject) => {
//         try {
//             users.aggregate(qry).then(respUsr => {
//                 var generalDic = {};
//                 //console.log("___debug respUsr.length", respUsr.length);
//                 for (usrObj of respUsr) {
//                     var dateKey = usrObj._id.year + "-" + set2Digit(usrObj._id.month) + "-" + set2Digit(usrObj._id.day);
//                     if (!generalDic[dateKey]) { generalDic[dateKey] = { "mothersRegistered": 0, "testsTaken": 0, "date": dateKey } };
//                     generalDic[dateKey]["mothersRegistered"] = usrObj.mothersRegistered;
//                 }
//                 tests.aggregate(qryTests).then(resptst => {
//                     //console.log("___debug resptst.length", resptst.length);
//                     for (tstObj of resptst) {
//                         var dateKey = tstObj._id.year + "-" + set2Digit(tstObj._id.month) + "-" + set2Digit(tstObj._id.day);
//                         if (!generalDic[dateKey]) { generalDic[dateKey] = { "mothersRegistered": 0, "testsTaken": 0, "date": dateKey } };
//                         generalDic[dateKey]["testsTaken"] = tstObj.testsTaken;
//                     }

//                     var finalLst = [];
//                     var isFirstFound = false;
//                     var curDate = startDate;
//                     while (curDate <= endDate) {
//                         //console.log("___debug ", generalDic, curDate.toISOString().split("T")[0]);
//                         if (curDate.toISOString().split("T")[0] in generalDic) {
//                             isFirstFound = true;
//                             finalLst.push(generalDic[curDate.toISOString().split("T")[0]]);
//                         }
//                         else if (isFirstFound) {
//                             finalLst.push({ "mothersRegistered": 0, "testsTaken": 0, "date": curDate.toISOString().split("T")[0] });
//                         }
//                         else {
//                             // skip
//                         }
//                         curDate.setDate(curDate.getDate() + 1);
//                     }
//                     return resolve(finalLst);
//                 }).catch(err => {
//                     reject(err);
//                 })

//             }).catch(err => {
//                 reject(err);
//             });

//         }
//         catch (err) {
//             return reject(err);
//         }
//     });

// }

function prepareTrend(startDate, endDate) {
    var qry = [
        { "$match": { "type": "mother", "createdOn": { "$gte": startDate, "$lte": endDate } } },
        {
            "$project": {
                "createdOnUTC": "$createdOn",
                "createdOnIST": {
                    "$dateAdd": {
                        "startDate": "$createdOn",
                        "unit": "hour",
                        "amount": 5.5 
                    }
                },
                "day": { "$dayOfMonth": { "$dateAdd": { "startDate": "$createdOn", "unit": "hour", "amount": 5.5 } } },
                "month": { "$month": { "$dateAdd": { "startDate": "$createdOn", "unit": "hour", "amount": 5.5 } } },
                "year": { "$year": { "$dateAdd": { "startDate": "$createdOn", "unit": "hour", "amount": 5.5 } } }
            }
        },
        {
            "$group": {
                "_id": { "day": "$day", "month": "$month", "year": "$year" },
                "mothersRegistered": { "$sum": 1 }
            }
        }
    ];

    var qryTests = [
        { "$match": { "createdOn": { "$gte": startDate, "$lte": endDate } } },
        {
            "$project": {
                "createdOnUTC": "$createdOn",
                "createdOnIST": {
                    "$dateAdd": {
                        "startDate": "$createdOn",
                        "unit": "hour",
                        "amount": 5.5
                    }
                },
                "day": { "$dayOfMonth": { "$dateAdd": { "startDate": "$createdOn", "unit": "hour", "amount": 5.5 } } },
                "month": { "$month": { "$dateAdd": { "startDate": "$createdOn", "unit": "hour", "amount": 5.5 } } },
                "year": { "$year": { "$dateAdd": { "startDate": "$createdOn", "unit": "hour", "amount": 5.5 } } }
            }
        },
        {
            "$group": {
                "_id": { "day": "$day", "month": "$month", "year": "$year" },
                "testsTaken": { "$sum": 1 }
            }
        }
    ];
    return new Promise((resolve, reject) => {
                try {
                    users.aggregate(qry).then(respUsr => {
                        var generalDic = {};
                        //console.log("___debug respUsr.length", respUsr.length);
                        for (usrObj of respUsr) {
                            var dateKey = usrObj._id.year + "-" + set2Digit(usrObj._id.month) + "-" + set2Digit(usrObj._id.day);
                            if (!generalDic[dateKey]) { generalDic[dateKey] = { "mothersRegistered": 0, "testsTaken": 0, "date": dateKey } };
                            generalDic[dateKey]["mothersRegistered"] = usrObj.mothersRegistered;
                        }
                        tests.aggregate(qryTests).then(resptst => {
                            //console.log("___debug resptst.length", resptst.length);
                            for (tstObj of resptst) {
                                var dateKey = tstObj._id.year + "-" + set2Digit(tstObj._id.month) + "-" + set2Digit(tstObj._id.day);
                                if (!generalDic[dateKey]) { generalDic[dateKey] = { "mothersRegistered": 0, "testsTaken": 0, "date": dateKey } };
                                generalDic[dateKey]["testsTaken"] = tstObj.testsTaken;
                            }
        
                            var finalLst = [];
                            var isFirstFound = false;
                            var curDate = startDate;
                            while (curDate <= endDate) {
                                //console.log("___debug ", generalDic, curDate.toISOString().split("T")[0]);
                                if (curDate.toISOString().split("T")[0] in generalDic) {
                                    isFirstFound = true;
                                    finalLst.push(generalDic[curDate.toISOString().split("T")[0]]);
                                }
                                else if (isFirstFound) {
                                    finalLst.push({ "mothersRegistered": 0, "testsTaken": 0, "date": curDate.toISOString().split("T")[0] });
                                }
                                else {
                                    // skip
                                }
                                curDate.setDate(curDate.getDate() + 1);
                            }
                            console.log("Data in prepareTrend before resolve:", finalLst);
                            return resolve(finalLst);
                        }).catch(err => {
                            reject(err);
                        })
        
                    }).catch(err => {
                        reject(err);
                    });
        
                }
                catch (err) {
                    return reject(err);
                }
            });
        
        }
        

//     return new Promise((resolve, reject) => {
//         try {
//             users.aggregate(qry).then(respUsr => {
//                 var generalDic = {};
//                 for (usrObj of respUsr) {
//                     var dateKey = usrObj._id.year + "-" + set2Digit(usrObj._id.month) + "-" + set2Digit(usrObj._id.day);
//                     if (!generalDic[dateKey]) { generalDic[dateKey] = { "mothersRegistered": 0, "testsTaken": 0, "date": dateKey } };
//                     generalDic[dateKey]["mothersRegistered"] = usrObj.mothersRegistered;
//                 }
//                 tests.aggregate(qryTests).then(resptst => {
//                     for (tstObj of resptst) {
//                         var dateKey = tstObj._id.year + "-" + set2Digit(tstObj._id.month) + "-" + set2Digit(tstObj._id.day);
//                         if (!generalDic[dateKey]) { generalDic[dateKey] = { "mothersRegistered": 0, "testsTaken": 0, "date": dateKey } };
//                         generalDic[dateKey]["testsTaken"] = tstObj.testsTaken;
//                     }

//                     var finalLst = [];
//                     var isFirstFound = false;
//                     var curDate = new Date(startDate); 
//                     var endDateObj = new Date(endDate);
                    
//                     while (curDate <= endDateObj) {
//                         var dateKey = curDate.toISOString().split("T")[0];
//                         if (dateKey in generalDic) {
//                             isFirstFound = true;
//                             finalLst.push(generalDic[dateKey]);
//                         } else if (isFirstFound) {
//                             finalLst.push({ "mothersRegistered": 0, "testsTaken": 0, "date": dateKey });
//                         }
//                         curDate.setDate(curDate.getDate() + 1);
//                     }
//                     return resolve(finalLst);
//                 }).catch(err => {
//                     reject(err);
//                 });

//             }).catch(err => {
//                 reject(err);
//             });

//         } catch (err) {
//             return reject(err);
//         }
//     });
// }
