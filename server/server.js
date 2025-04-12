const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/local", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Import Routes
const cityRoutes = require("./routes/cityRoutes");
const sectionRoutes = require("./routes/sectionRoutes");
const placeRoutes = require("./routes/placeRoutes");

// Use Routes
app.use("/api/cities", cityRoutes);
app.use("/api/sections", sectionRoutes);
app.use("/api/places", placeRoutes);

// Start Server
const PORT = process.env.PORT || 5020;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
