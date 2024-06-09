/*jshint esversion: 6 */
const mongoose = require("mongoose");

const validTestsSchema = mongoose.Schema({
  _id: String,
  id: String
},
  {
    collection: 'ValidTests',
    strict: false,
    maxTimeMS: 20000
  });

module.exports = mongoose.model("ValidTests", validTestsSchema);