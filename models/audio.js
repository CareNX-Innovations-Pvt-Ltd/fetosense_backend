/*jshint esversion: 6 */
const mongoose = require("mongoose");

/**
 * @file models/audio.js
 * @module models/audio
 * @description Mongoose schema for the Audio collection.
 */
/**
 * Represents an Audio document.
 * @typedef {Object} Audio
 * @property {string} _id - Unique identifier for the audio document.
 * @property {string} id - Additional identifier for the audio document.
 */
/**
 * Mongoose model for the Audio collection.
 * @type {mongoose.Model<Audio>}
 */

const audioSchema = mongoose.Schema({
  _id: String,
  id: String
},
  {
    collection: 'audio',
    strict: false,
    maxTimeMS: 60000
  });

module.exports = mongoose.model("audio", audioSchema);
