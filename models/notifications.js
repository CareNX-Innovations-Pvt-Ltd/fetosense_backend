/*jshint esversion: 6 */
const mongoose = require("mongoose");

const notificationsSchema = mongoose.Schema({
  _id: String,
  documentId: String
},
  {
    collection: 'notifications',
    strict: false,
    maxTimeMS: 20000
  });

module.exports = mongoose.model("notifications", notificationsSchema);
