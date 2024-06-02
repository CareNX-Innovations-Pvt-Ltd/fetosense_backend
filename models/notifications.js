/*jshint esversion: 6 */
const mongoose = require("mongoose");

const notificationsSchema = mongoose.Schema({
  _id: String,
  documentId: String
},
{
  collection: 'notifications',
  strict: false
});

module.exports = mongoose.model("notifications", notificationsSchema);
