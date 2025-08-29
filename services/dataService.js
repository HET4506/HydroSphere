const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const csvParse = require('csv-parse/lib/sync');

const DEFAULT_DATA_PATH = path.join(__dirname, '..', 'data'); // optionally keep CSV/GeoJSON here

// In-memory cache for processed sites
let sitesCache = null;

/**
 * loadRawCSV - helper to load CSV from local path
 */
async function loadRawCSV(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  const records = csvParse(raw, { columns: true, skip_empty_lines: true });
  return records;
}

/**
 * fetchJSON - fetch from URL if present
 */
async function fetchJSON(url) {
  if (!url) return null;
  const resp = await axios.get(url, { timeout: 20000 });
  return resp.data;
}

/**
 * fetchAndMerge - core loader: fetches sources and merges into site objects
 * NOTE: You must adapt the merging logic to match your data sources.
 */
async function fetchAndMergeSources() {
  // read environment-configured sources
  const solarUrl = process.env.SOLAR_API_URL || '';
  const windUrl = process.env.WIND_API_URL || '';
  const waterUrl = process.env.WATER_API_URL || '';
  const industryUrl = process.env.INDUSTRY_API_URL || '';
  const portsUrl = process.env.PORTS_API_URL || '';

  // fetch remote sources if provided
  const [solarRaw, windRaw, waterRaw, industryRaw, portsRaw] = await Promise.allSettled([
    fetchJSON(solarUrl),
    fetchJSON(windUrl),
    fetchJSON(waterUrl),
    fetchJSON(industryUrl),
    fetchJSON(portsUrl)
  ]);

  // Placeholder merging approach:
  // - Decide the canonical list of candidate sites (e.g., industrial clusters or coastal hubs)
  // - For each candidate assign attributes by matching region names or using nearest coords
  // Here we leave a template: implement matching logic with your actual sources.

  const candidates = []; // <- YOU MUST FILL: build candidate list either from industryRaw or local file

  // Example template of expected final shape for each site (do not include example values here):
  // {
  //   id: 'visakhapatnam',
  //   name: 'Visakhapatnam',
  //   state: 'Andhra Pradesh',
  //   lat: 17.6868,
  //   lon: 83.2185,
  //   solar: <numeric>,
  //   wind: <numeric>,
  //   water: <numeric>,
  //   industry: <numeric>,
  //   port: <numeric>,
  //   metadata: { ... }
  // }

  // ---------- IMPORTANT ----------
  // Implement your own merging logic here:
  // - Use industryRaw (industrial hubs) to seed candidate sites
  // - Use solarRaw/windRaw to attach resource metrics by nearest region
  // - Use waterRaw for freshwater availability or desal feasibility
  // - Use portsRaw to set port proximity/export readiness
  // --------------------------------

  // For now, return empty array if not implemented
  return candidates;
}

/**
 * reloadData - fetch/process/normalize raw datasets and cache processed sites
 */
async function reloadData() {
  const merged = await fetchAndMergeSources();
  // optional: write to a local JSON for debugging
  try {
    await fs.mkdir(DEFAULT_DATA_PATH, { recursive: true });
    await fs.writeFile(path.join(DEFAULT_DATA_PATH, 'processed_sites.json'), JSON.stringify(merged, null, 2), 'utf8');
  } catch (err) {
    console.warn('Unable to write debug file:', err.message);
  }
  sitesCache = merged;
  return merged;
}

/**
 * getSites - returns processed sites, loads data if needed
 */
async function getSites() {
  if (!sitesCache) {
    await reloadData();
  }
  return sitesCache || [];
}

/**
 * getSiteByIdOrName - search cached sites
 */
async function getSiteByIdOrName(idOrName) {
  const sites = await getSites();
  const key = String(idOrName).toLowerCase();
  return sites.find(s => (s.id && s.id.toLowerCase() === key) || (s.name && s.name.toLowerCase() === key));
}

module.exports = {
  reloadData,
  getSites,
  getSiteByIdOrName
};
