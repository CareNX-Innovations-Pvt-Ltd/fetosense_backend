
/**
 * @file routes/general.js
 * @module routes/general
 * @description Routes for general MongoDB operations.
 */

const express = require("express");

const general = require("../general/general");

const router = express.Router();

/**
 * Route to insert data into MongoDB.
 * @name POST /mongoInsert
 * @function
 * @memberof module:routes/general
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

router.post("/mongoInsert", general.mongoInsert);

/**
 * Route to perform MongoDB aggregation.
 * @name POST /mongoAggregate
 * @function
 * @memberof module:routes/general
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

router.post("/mongoAggregate", general.mongoAggregate);

/**
 * Route to find data in MongoDB.
 * @name POST /mongoFind
 * @function
 * @memberof module:routes/general
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

router.post("/mongoFind", general.mongoFind);

/**
 * Route to delete data from MongoDB.
 * @name POST /mongoDelete
 * @function
 * @memberof module:routes/general
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

router.post("/mongoDelete", general.mongoDelete);

/**
 * Route to update data in MongoDB.
 * @name POST /mongoUpdate
 * @function
 * @memberof module:routes/general
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

router.post("/mongoUpdate", general.mongoUpdate);

module.exports = router;
