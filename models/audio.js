/*jshint esversion: 6 */
const mongoose = require("mongoose");

const audioSchema = mongoose.Schema({
  _id: String,
  id: String
},
  {
    collection: 'audio',
    strict: false,
    maxTimeMS: 20000
  });

module.exports = mongoose.model("audio", audioSchema);
