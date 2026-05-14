const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();

// Trust proxy for rate limiter 
app.set('trust proxy', true);

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    message: "Too many OTP requests. Please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});

const verifyLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, 
  max: 10, 
  message: {
    message: "Too many verification attempts. Please try again after 30 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});

app.use(cors());
app.use(express.json());

app.use("/api/auth/send-otp", otpLimiter);
app.use("/api/auth/verify-otp", verifyLimiter);
app.use("/api/auth", authRoutes);

// MongoDB connection for Lambda with lazy connection
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedDb = mongoose.connection;
    console.log("MongoDB Connected");
    return cachedDb;
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    throw err;
  }
}

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    await connectToDatabase();
    res.json({ status: "OK", database: "connected", timestamp: new Date().toISOString() });
  } catch (error) {
    res.json({ status: "OK", database: "disconnected", error: error.message, timestamp: new Date().toISOString() });
  }
});

// Middleware to ensure database connection for API routes
app.use(async (req, res, next) => {
  if (req.path === '/api/health') {
    return next();
  }
  
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("Database connection failed for route:", req.path, error);
    res.status(500).json({ message: "Database connection failed. Please try again." });
  }
});

// Local development server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  connectToDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(` Local: http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
}

module.exports = app;