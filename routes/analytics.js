/**
 * @file routes/analytics.js
 * @module routes/analytics
 * @description Routes for analytics and dashboard data.
 */

const express = require("express");
const router = express.Router();
const admin_dashboard = require("../analytics/admin_dashboard");
const doctor_dashboard = require("../analytics/doctor_dashboard");

/**
 * Route to fetch admin dashboard analytics.
 * @name POST /admin_dashboard
 * @function
 * @memberof module:routes/analytics
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

router.post("/admin_dashboard", admin_dashboard.getDashboardData);

/**
 * Route to fetch doctor dashboard analytics.
 * @name POST /doctor_dashboard
 * @function
 * @memberof module:routes/analytics
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

router.post("/doctor_dashboard", doctor_dashboard.getDashboardData);
module.exports = router;
