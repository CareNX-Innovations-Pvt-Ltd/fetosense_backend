const express = require("express");
const router = express.Router();
const admin_dashboard = require("../analytics/admin_dashboard");
const doctor_dashboard = require("../analytics/doctor_dashboard");

router.post("/admin_dashboard", admin_dashboard.getDashboardData);
router.post("/doctor_dashboard", doctor_dashboard.getDashboardData);
module.exports = router;
