/**
 * @file routes/mis.js
 * @module routes/mis
 * @description Routes for fetching MIS (Management Information System) data.
 */

const express = require("express");

const deviceMis = require("../mis/device_mis");
const orgMis=require('../mis/organization_mis');
const doctorMis=require('../mis/doctor_mis');
const motherMis=require('../mis/mother_mis');
const testsMis=require('../mis/tests_mis');

const router = express.Router();

/**
 * Route to fetch device MIS data.
 * @name POST /getDevices
 * @function
 * @memberof module:routes/mis
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

router.post("/getDevices", deviceMis.getData);


/**
 * Route to fetch organization MIS data.
 * @name POST /getOrganizations
 * @function
 * @memberof module:routes/mis
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

router.post("/getOrganizations", orgMis.getData);

/**
 * Route to fetch doctor MIS data.
 * @name POST /getDoctors
 * @function
 * @memberof module:routes/mis
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

router.post("/getDoctors",doctorMis.getData);

/**
 * Route to fetch mother MIS data.
 * @name POST /getMothers
 * @function
 * @memberof module:routes/mis
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

router.post("/getMothers",motherMis.getData);

/**
 * Route to fetch test MIS data.
 * @name POST /getTests
 * @function
 * @memberof module:routes/mis
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

router.post("/getTests",testsMis.getData);



module.exports = router;
