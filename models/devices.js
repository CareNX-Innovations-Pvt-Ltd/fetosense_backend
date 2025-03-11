/*jshint esversion: 6 */

const mongoose = require("mongoose");

/**
 * @file models/devices.js
 * @module models/devices
 * @description Mongoose schema for the Devices collection.
 */

/**
 * Represents a Device document.
 * @typedef {Object} Device
 * @property {string} _id - Unique identifier for the device document.
 * @property {string} documentId - Additional document ID reference.
 */

/**
 * Mongoose schema for the Devices collection.
 * @constant {mongoose.Schema<Device>}
 */

const devicesSchema = mongoose.Schema({
  _id: String,
  documentId: String
},
  {
    collection: 'devices',
    strict: false,
    maxTimeMS: 60000
  });

  /**
 * Mongoose model for the Devices collection.
 * @type {mongoose.Model<Device>}
 */

module.exports = mongoose.model("devices", devicesSchema);