const express = require("express");
const Place = require("../models/Place");

const router = express.Router();

// Get all places
router.get("/", async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new place
router.post("/", async (req, res) => {
  try {
    const { sectionId, name, image, description, timing, rating } = req.body;
    const newPlace = new Place({ sectionId, name, image, description, timing, rating });
    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
