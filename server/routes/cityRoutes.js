const express = require("express");
const City = require("../models/cityModel");
const Section = require("../models/Section");
const Place = require("../models/Place");

const router = express.Router();

// ✅ Route to add a new city
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

// ✅ Route to get all cities with sections and places
router.get("/all", async (req, res) => {
  try {
    const cities = await City.aggregate([
      {
        $lookup: {
          from: "sections",
          localField: "_id",
          foreignField: "cityId",
          as: "sections"
        }
      },
      {
        $unwind: { path: "$sections", preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: "places",
          localField: "sections._id",
          foreignField: "sectionId",
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

module.exports = router;
