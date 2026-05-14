const User = require("../models/User");
const twilio = require("twilio");
const jwt = require("jsonwebtoken");

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const otpAttempts = new Map();

exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate phone number format
    const phoneRegex = /^\+91[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone number. Must start with +91 followed by 10 digits (starting with 6-9)"
      });
    }

    // Check if user has requested OTP recently
    const lastAttempt = otpAttempts.get(phone);
    if (lastAttempt && (Date.now() - lastAttempt) < 60000) {
      return res.status(429).json({
        message: "Please wait 60 seconds before requesting another OTP"
      });
    }

    console.log("Sending OTP to:", phone);

    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications
      .create({
        to: phone,
        channel: "sms"
      });

    console.log("OTP sent successfully to:", phone, "Status:", verification.status);

    let user = await User.findOne({ phone });

    if (!user) {
      user = new User({ phone });
    }

    // Store OTP sent time
    const otpExpiryTime = new Date();
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 2);

    user.otpSentAt = new Date();
    user.otpExpiry = otpExpiryTime;

    await user.save();

    // Store attempt time
    otpAttempts.set(phone, Date.now());

   
    setTimeout(() => otpAttempts.delete(phone), 60000);

    res.json({
      message: "OTP sent successfully",
      status: verification.status,
      expiryTime: otpExpiryTime
    });

  } catch (err) {
    console.error("Send OTP Error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({
      message: "Failed to send OTP. Please try again."
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        message: "Phone number and OTP are required"
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        message: "OTP must be 6 digits"
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: "User not found. Please request a new OTP."
      });
    }

    const now = new Date();

    // Check if OTP has expired (2 minutes)
    if (!user.otpExpiry || now > user.otpExpiry) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP."
      });
    }

    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks
      .create({
        to: phone,
        code: otp
      });

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({
        message: "Invalid OTP. Please try again."
      });
    }

    user.isVerified = true;
    user.otpExpiry = null; // Clear expiry after successful verification
    await user.save();

    const token = jwt.sign(
      { id: user._id, phone: user.phone },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Phone verified successfully!",
      token,
      user: {
        phone: user.phone,
        isVerified: user.isVerified
      }
    });

  } catch (err) {
    console.error("Verify OTP Error:", err.message);
    console.error("Full error:", err);
    res.status(500).json({
      message: "Verification failed. Please try again."
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        phone: user.phone,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error("Get Current User Error:", err);
    res.status(500).json({
      message: "Failed to fetch user data"
    });
  }
};

exports.validateToken = async (req, res) => {
  res.json({
    success: true,
    message: "Token is valid",
    user: {
      id: req.user.id,
      phone: req.user.phone
    },
    expiresIn: "1 day"
  });
};