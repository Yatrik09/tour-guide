const express = require("express");
const Section = require("../models/Section");
const Place = require("../models/Place");

const router = express.Router();

// ✅ POST: Add a new section
router.post("/", async (req, res) => {
  try {
    const { cityId, name } = req.body;

    if (!cityId || !name) {
      return res.status(400).json({ message: "City ID and section name are required" });
    }

    const newSection = new Section({ cityId, name });
    await newSection.save();
    res.status(201).json(newSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ GET: Get all sections for a specific city along with their places
router.get("/", async (req, res) => {
  try {
    const { cityId } = req.params;

    const sections = await Section.find({ cityId });

    // Populate places for each section
    const sectionsWithPlaces = await Promise.all(
      sections.map(async (section) => {
        const places = await Place.find({ sectionId: section._id });
        return {
          ...section.toObject(),
          places,
        };
      })
    );

    res.json(sectionsWithPlaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
