const express = require("express");

const graph = require("../graph/graphV1");

const router = express.Router();

router.post("/get_graph", graph.getGraph);

module.exports = router;
