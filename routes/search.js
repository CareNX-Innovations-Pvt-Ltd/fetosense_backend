/**
 * @file routes/search.js
 * @module routes/search
 * @description Routes for searching mother records.
 */
const express = require("express");

const search = require("../search/search");


const router = express.Router();


/**
 * Route to search for mothers.
 * @name POST /searchMother
 * @function
 * @memberof module:routes/search
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */

router.post("/searchMother", search.searchMother);

module.exports = router;
