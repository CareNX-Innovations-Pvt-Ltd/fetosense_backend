/*jshint esversion: 6 */
const Users = require("../models/users"); // Import devices model
const general = require("../general/general");
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
    const deviceQuery = Users.find(query);
    const orgQuery = Users.find(queryOrg);
    orgQuery.then(orgs => {
        for (var org of orgs) {
            orgDic[org.documentId] = JSON.parse(JSON.stringify(org));
        }
        //console.log("orgDic", orgDic);
        return deviceQuery;

    }).then(documents => {
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

const average = (array) => array.reduce((a, b) => a + b) / array.length;