const express = require('express');
const router = express.Router();
const rankingService = require('../services/rankingService');
const dataService = require('../services/dataService');

/**
 * GET /api/sites/top?n=5
 * Returns top N sites using default weights (or configured weights)
 */
router.get('/top', async (req, res, next) => {
  try {
    const n = req.query.n ? parseInt(req.query.n) : 5;
    const results = await rankingService.getTopSites(n);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/sites/custom
 * Body: { weights: { solar, wind, water, industry, port }, n }
 * Returns top N sites using provided weights
 */
router.post('/custom', async (req, res, next) => {
  try {
    const { weights, n } = req.body;
    const topN = n ? parseInt(n) : 5;
    const results = await rankingService.getTopSites(topN, weights);
    res.json(results);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/sites/reload
 * Trigger a manual reload/refresh of the raw datasets (useful during dev)
 */
router.post('/reload', async (req, res, next) => {
  try {
    await dataService.reloadData();
    res.json({ status: 'reloaded' });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/sites (all processed sites)
 */
router.get('/', async (req, res, next) => {
  try {
    const sites = await dataService.getSites();
    res.json(sites);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/sites/:id
 * Returns detailed profile for a site (by id or name)
 */
router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const site = await dataService.getSiteByIdOrName(id);
    if (!site) return res.status(404).json({ error: 'Site not found' });
    res.json(site);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
