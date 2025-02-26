/*jshint esversion: 6 */
const mongoose = require("mongoose");

/**
 * @file models/notifications.js
 * @module models/notifications
 * @description Mongoose schema for the Notifications collection.
 */

/**
 * Represents a Notification document.
 * @typedef {Object} Notification
 * @property {string} _id - Unique identifier for the notification document.
 * @property {string} documentId - Additional document ID reference.
 */

/**
 * Mongoose schema for the Notifications collection.
 * @constant {mongoose.Schema<Notification>}
 */

const notificationsSchema = mongoose.Schema({
  _id: String,
  documentId: String
},
  {
    collection: 'notifications',
    strict: false,
    maxTimeMS: 60000
  });

  /**
 * Mongoose model for the Notifications collection.
 * @type {mongoose.Model<Notification>}
 */

module.exports = mongoose.model("notifications", notificationsSchema);
