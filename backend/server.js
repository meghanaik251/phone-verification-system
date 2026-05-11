const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const app = express();



// Middleware
app.use(cors());

app.use(express.json());



// Routes
app.use("/api/auth", authRoutes);



// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));



// Server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});