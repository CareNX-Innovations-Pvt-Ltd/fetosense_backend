/**
 * @file routes/graph.js
 * @module routes/graph
 * @description Routes for graph data retrieval.
 */

const express = require("express");

const graph = require("../graph/graphV1");

const router = express.Router();

/**
 * Route to fetch graph data.
 * @name POST /get_graph
 * @function
 * @memberof module:routes/graph
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

router.post("/get_graph", graph.getGraph);

module.exports = router;
