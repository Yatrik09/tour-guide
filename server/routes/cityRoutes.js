const express = require("express");
const City = require("../models/cityModel");
const Section = require("../models/Section");
const Place = require("../models/Place");

const router = express.Router();

// CREATE - Add a new city
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "City name is required" });
    }

    const existingCity = await City.findOne({ name });
    if (existingCity) {
      return res.status(400).json({ message: "City already exists" });
    }

    const newCity = new City({ name });
    await newCity.save();

    res.status(201).json({ message: "City added successfully", city: newCity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - Get all cities with sections and places
router.get("/all", async (req, res) => {
  try {
    const cities = await City.aggregate([
      {
        $lookup: {
          from: "sections",
          localField: "_id",
          foreignField: "city",
          as: "sections"
        }
      },
      {
        $unwind: {
          path: "$sections",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "places",
          localField: "sections._id",
          foreignField: "section",
          as: "sections.places"
        }
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          sections: { $push: "$sections" }
        }
      }
    ]);
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// NEW - Get one city with its sections and places
router.get("/city-data/:cityName", async (req, res) => {
  try {
    const { cityName } = req.params;

    const city = await City.findOne({ name: cityName });
    if (!city) return res.status(404).json({ message: "City not found" });

    const sections = await Section.find({ city: city._id });

    const sectionsWithPlaces = await Promise.all(
      sections.map(async (section) => {
        const places = await Place.find({ section: section._id });
        return {
          _id: section._id,
          name: section.name,
          places,
        };
      })
    );

    res.json({
      city: city.name,
      sections: sectionsWithPlaces,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE - Update a city by ID
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "City name is required" });
    }

    const updatedCity = await City.findByIdAndUpdate(req.params.id, { name }, { new: true });

    if (!updatedCity) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json({ message: "City updated successfully", city: updatedCity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete a city and its sections & places
router.delete("/:id", async (req, res) => {
  try {
    const cityId = req.params.id;

    const sections = await Section.find({ city: cityId });
    const sectionIds = sections.map((s) => s._id);

    await Place.deleteMany({ section: { $in: sectionIds } });
    await Section.deleteMany({ city: cityId });
    const deletedCity = await City.findByIdAndDelete(cityId);

    if (!deletedCity) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json({ message: "City and related data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
