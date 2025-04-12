const express = require("express");
const Section = require("../models/Section");
const Place = require("../models/Place");

const router = express.Router();

// ✅ CREATE - Add a new section
router.post("/", async (req, res) => {
  try {
    const { cityId, name } = req.body;

    if (!cityId || !name) {
      return res.status(400).json({ message: "City ID and section name are required" });
    }

    const newSection = new Section({ city: cityId, name });
    await newSection.save();

    res.status(201).json(newSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ READ - Get all sections for a specific city (with places)
router.get("/", async (req, res) => {
  try {
    const { cityId } = req.query;

    const sections = await Section.find({ city: cityId });

    const sectionsWithPlaces = await Promise.all(
      sections.map(async (section) => {
        const places = await Place.find({ section: section._id });
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

// ✅ READ - Get single section by ID
router.get("/:id", async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const places = await Place.find({ section: section._id });
    res.json({ ...section.toObject(), places });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ UPDATE - Update a section
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;

    const updatedSection = await Section.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!updatedSection) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json({ message: "Section updated successfully", section: updatedSection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ DELETE - Delete a section (optional: delete places inside it)
router.delete("/:id", async (req, res) => {
  try {
    const deletedSection = await Section.findByIdAndDelete(req.params.id);

    if (!deletedSection) {
      return res.status(404).json({ message: "Section not found" });
    }

    // ❗ Optional: Also delete all places in this section
    await Place.deleteMany({ section: req.params.id });

    res.json({ message: "Section and its places deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
