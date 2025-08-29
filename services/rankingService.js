import { fetchCityData } from "./dataService.js";
import { normalize } from "../utils/normalize.js";

const candidateCities = ["Mumbai", "Chennai", "Ahmedabad", "Bengaluru", "Hyderabad", "Jaipur", "Kolkata", "Delhi"];

export const getTopCities = async () => {
  const results = [];
  for (const city of candidateCities) {
    const data = await fetchCityData(city);
    const score = calculateScore(data);
    results.push({ ...data, score });
  }

  // Sort & return top 5
  return results.sort((a, b) => b.score - a.score).slice(0, 5);
};

export const searchCity = async (name) => {
  const data = await fetchCityData(name);
  return { ...data, score: calculateScore(data) };
};

const calculateScore = (data) => {
  // Normalize all attributes between 0-1
  const solar = normalize(data.solarPotential, 0, 10);
  const wind = normalize(data.windPotential, 0, 10);
  const water = normalize(data.waterAvailability, 0, 10);
  const demand = normalize(data.industrialDemand, 0, 10);

  // Weighted scoring model
  return 0.35 * solar + 0.25 * wind + 0.2 * water + 0.2 * demand;
};

