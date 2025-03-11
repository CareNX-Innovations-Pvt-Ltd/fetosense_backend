/*jshint esversion: 6 */
const mongoose = require("mongoose");


/**
 * @file models/users.js
 * @module models/users
 * @description Mongoose schema for the Users collection.
 */

/**
 * Represents a User document.
 * @typedef {Object} User
 * @property {string} _id - Unique identifier for the user document.
 * @property {string} documentId - Additional document ID reference.
 */

/**
 * Mongoose schema for the Users collection.
 * @constant {mongoose.Schema<User>}
 */

const usersSchema = mongoose.Schema({
  _id: String,
  documentId: String
},
  {
    collection: 'users',
    strict: false,
    maxTimeMS: 60000
  });

  /**
 * Mongoose model for the Users collection.
 * @type {mongoose.Model<User>}
 */

module.exports = mongoose.model("users", usersSchema);
