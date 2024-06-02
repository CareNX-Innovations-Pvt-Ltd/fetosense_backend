/*jshint esversion: 6 */
const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  _id: String,
  documentId: String
},
{
  collection: 'users',
  strict: false
});

module.exports = mongoose.model("users", usersSchema);
