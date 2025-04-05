const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    timing: { type: String, required: true },
    rating: { type: Number, required: true },
    section: { type: mongoose.Schema.Types.ObjectId, ref: "Section" } // 🔗 Belongs to Section
});

module.exports = mongoose.model("Place", placeSchema);
