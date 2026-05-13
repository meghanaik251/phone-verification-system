const express = require("express");
const router = express.Router();

const {
  sendOTP,
  verifyOTP,
   getCurrentUser,      
  validateToken        
} = require("../controllers/authController");

const authMiddleware = require("../middleware/auth");  

router.post("/send-otp", sendOTP);

router.post("/verify-otp", verifyOTP);

router.get("/me", authMiddleware, getCurrentUser);
router.get("/validate-token", authMiddleware, validateToken);

module.exports = router;