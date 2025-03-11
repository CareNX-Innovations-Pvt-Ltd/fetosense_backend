/*jshint esversion: 6 */
const mongoose = require("mongoose");

/**
 * @file models/validTests.js
 * @module models/validTests
 * @description Mongoose schema for the ValidTests collection.
 */

/**
 * Represents a Valid Test document.
 * @typedef {Object} ValidTest
 * @property {string} _id - Unique identifier for the valid test document.
 * @property {string} id - Additional identifier for the valid test document.
 */

/**
 * Mongoose schema for the ValidTests collection.
 * @constant {mongoose.Schema<ValidTest>}
 */

const validTestsSchema = mongoose.Schema({
  _id: String,
  id: String
},
  {
    collection: 'ValidTests',
    strict: false,
    maxTimeMS: 60000
  });

  /**
 * Mongoose model for the ValidTests collection.
 * @type {mongoose.Model<ValidTest>}
 */

module.exports = mongoose.model("ValidTests", validTestsSchema);