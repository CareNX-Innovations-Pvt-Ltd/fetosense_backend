/*jshint esversion: 6 */

const mongoose = require("mongoose");

const datasetSchema = mongoose.Schema({
  _id: String,
  id: String
},
  {
    collection: 'dataset',
    strict: false,
    maxTimeMS: 20000
  });

module.exports = mongoose.model("dataset", datasetSchema);