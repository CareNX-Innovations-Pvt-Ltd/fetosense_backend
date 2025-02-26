/*jshint esversion: 6 */
const mongoose = require("mongoose");

/**
 * @file models/tests.js
 * @module models/tests
 * @description Mongoose schema for the Tests collection.
 */

/**
 * Represents a Test document.
 * @typedef {Object} Test
 * @property {string} _id - Unique identifier for the test document.
 * @property {string} id - Additional identifier for the test document.
 */

/**
 * Mongoose schema for the Tests collection.
 * @constant {mongoose.Schema<Test>}
 */

const testsSchema = mongoose.Schema({
  _id: String,
  id: String
},
  {
    collection: 'tests',
    strict: false,
    maxTimeMS: 60000
  });

  /**
 * Mongoose model for the Tests collection.
 * @type {mongoose.Model<Test>}
 */

module.exports = mongoose.model("tests", testsSchema);
