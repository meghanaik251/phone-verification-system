const User = require("../models/User");
const twilio = require("twilio");
const jwt = require("jsonwebtoken");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);


exports.sendOTP = async (req, res) => {

  try {

    const { phone } = req.body;

    const verification =
      await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verifications
        .create({
          to: phone,
          channel: "sms"
        });

    // find user
    let user = await User.findOne({ phone });

    // create user if not exists
    if (!user) {
      user = new User({ phone });
    }

    // store otp sent time
    user.otpSentAt = new Date();

    await user.save();

    res.json({
      message: "OTP sent successfully",
      status: verification.status
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};


exports.verifyOTP = async (req, res) => {

  try {

    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    const now = new Date();

    const diffInSeconds =
      (now - user.otpSentAt) / 1000;

    if (diffInSeconds > 120) {

      return res.status(400).json({
        message: "OTP expired after 2 minutes"
      });

    }

    const verificationCheck =
      await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks
        .create({
          to: phone,
          code: otp
        });

    console.log(verificationCheck);

    if (verificationCheck.status !== "approved") {

      return res.status(400).json({
        message: "Invalid OTP"
      });

    }

    user.isVerified = true;

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Phone verified successfully",
      token
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
};