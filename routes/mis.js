const express = require("express");

const deviceMis = require("../mis/device_mis");
const orgMis=require('../mis/organization_mis');
const doctorMis=require('../mis/doctor_mis');
const motherMis=require('../mis/mother_mis');
const testsMis=require('../mis/tests_mis');

const router = express.Router();

router.post("/getDevices", deviceMis.getData);
router.post("/getOrganizations", orgMis.getData);
router.post("/getDoctors",doctorMis.getData);
router.post("/getMothers",motherMis.getData);
router.post("/getTests",testsMis.getData);



module.exports = router;
