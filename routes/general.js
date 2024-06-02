const express = require("express");

const general = require("../general/general");

const router = express.Router();

router.post("/mongoInsert", general.mongoInsert);
router.post("/mongoAggregate", general.mongoAggregate);
router.post("/mongoFind", general.mongoFind);
router.post("/mongoDelete", general.mongoDelete);
router.post("/mongoUpdate", general.mongoUpdate);

module.exports = router;
