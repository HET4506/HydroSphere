import express from "express";
import { getTopCities, searchCity } from "../services/rankingService.js";

const router = express.Router();

// Top 5 ranked cities
router.get("/top", async (req, res) => {
  try {
    const cities = await getTopCities();
    res.json(cities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search by city name
router.get("/search", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: "City name required" });

    const city = await searchCity(name);
    res.json(city);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
