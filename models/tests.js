/*jshint esversion: 6 */
const mongoose = require("mongoose");

const testsSchema = mongoose.Schema({
  _id: String,
  id: String
},
{
  collection: 'tests',
  strict: false
});

module.exports = mongoose.model("tests", testsSchema);
