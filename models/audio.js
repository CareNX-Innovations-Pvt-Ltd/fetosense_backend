/*jshint esversion: 6 */
const mongoose = require("mongoose");

/**
 * @module models/audio
 * @description Mongoose schema for the Audio collection.
 */

/**
 * Represents an Audio document.
 * @typedef {Object} Audio
 * @property {string} _id - Unique identifier for the audio document.
 * @property {string} id - Additional identifier for the audio document.
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

/**
* Mongoose model for the Audio collection.
* @type {mongoose.Model<Audio>}
*/

/** Export the model */

module.exports = mongoose.model("audio", audioSchema);
