const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String },
  gender: { type: String },
  ip_address: { type: String },
});

var User = (module.exports = mongoose.model("testdata", userSchema));
module.exports.get = function (callback, limit) {
  User.find(callback).limit(limit);
};
