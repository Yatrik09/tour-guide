const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: "City" }, // 🔗 Belongs to City
    places: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }] // 🔗 Connects to Places
});

module.exports = mongoose.model("Section", sectionSchema);
