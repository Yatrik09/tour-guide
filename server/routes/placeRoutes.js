const express = require("express");
const Place = require("../models/Place");
const { uploadSingleImage } = require("../middlewares/uploadMiddleware"); // Import the middleware

const router = express.Router();

// ✅ READ - Get all places OR filter by sectionId
router.get("/", async (req, res) => {
  try {
    const { sectionId } = req.query;
    const filter = sectionId ? { section: sectionId } : {};
    const places = await Place.find(filter);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ READ - Get a single place by ID
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ CREATE - Add a new place (with image upload)
router.post("/", uploadSingleImage, async (req, res) => {
  try {
    const { sectionId, name, description, timing, rating } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!sectionId || !name) {
      return res.status(400).json({ message: "Section ID and name are required" });
    }

    const newPlace = new Place({
      section: sectionId,
      name,
      image,
      description,
      timing,
      rating,
    });

    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ UPDATE - Update a place by ID (with optional image)
router.put("/:id", uploadSingleImage, async (req, res) => {
  try {
    const { name, description, timing, rating } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updateData = {
      name,
      description,
      timing,
      rating,
    };

    if (image !== undefined) {
      updateData.image = image;
    }

    const updatedPlace = await Place.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json({ message: "Place updated successfully", place: updatedPlace });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ DELETE - Delete a place by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedPlace = await Place.findByIdAndDelete(req.params.id);

    if (!deletedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
