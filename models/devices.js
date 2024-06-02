/*jshint esversion: 6 */

const mongoose = require("mongoose");

const devicesSchema = mongoose.Schema({
  _id: String,
  documentId: String
},
{
  collection: 'devices',
  strict: false
});

module.exports = mongoose.model("devices", devicesSchema);