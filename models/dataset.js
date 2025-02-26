/*jshint esversion: 6 */

const mongoose = require("mongoose");
/**
 * @file models/dataset.js
 * @module models/dataset
 * @description Mongoose schema for the Dataset collection.
 */

/**
 * Represents a Dataset document.
 * @typedef {Object} Dataset
 * @property {string} _id - Unique identifier for the dataset document.
 * @property {string} id - Additional identifier for the dataset document.
 */

/**
 * Mongoose schema for the Dataset collection.
 * @constant {mongoose.Schema<Dataset>}
 */

const datasetSchema = mongoose.Schema({
  _id: String,
  id: String
},
  {
    collection: 'dataset',
    strict: false,
    maxTimeMS: 60000
  });

  /**
 * Mongoose model for the Dataset collection.
 * @type {mongoose.Model<Dataset>}
 */

module.exports = mongoose.model("dataset", datasetSchema);