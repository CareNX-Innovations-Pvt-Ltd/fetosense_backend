const express = require("express");
const router = express.Router();
const aggregations = require("../aggregations/aggregation");

router.post("/aggregate_data", aggregations.aggregateData);
module.exports = router;
