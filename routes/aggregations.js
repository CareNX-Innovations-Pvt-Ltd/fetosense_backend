/**
 * @file routes/aggregation.js
 * @module routes/aggregation
 * @description Routes for data aggregation.
 */

const express = require("express");
const router = express.Router();
const aggregations = require("../aggregations/aggregation");

/**
 * Route to aggregate data.
 * @name POST /aggregate_data
 * @function
 * @memberof module:routes/aggregation
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

router.post("/aggregate_data", aggregations.aggregateData);
module.exports = router;
