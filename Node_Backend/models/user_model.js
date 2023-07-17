const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: String,
  name: String,
  email: String,
  contactNo: Number,
  password: String,
  role: {
    type: String,
    enum: ["admin", "customer", "seller"],
    default: "customer",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
});

module.exports.userModel = mongoose.model("User", userSchema);