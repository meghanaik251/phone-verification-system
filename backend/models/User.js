const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true
  },

  otp: {
    type: String
  },

  otpExpiry: {
    type: Date
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  otpSentAt: {
  type: Date
}

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);