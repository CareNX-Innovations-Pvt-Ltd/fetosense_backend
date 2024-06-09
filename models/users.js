/*jshint esversion: 6 */
const mongoose = require("mongoose");

const usersSchema = mongoose.Schema({
  _id: String,
  documentId: String
},
  {
    collection: 'users',
    strict: false,
    maxTimeMS: 20000
  });

module.exports = mongoose.model("users", usersSchema);
