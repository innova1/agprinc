const express = require('express');
const router = express.Router();
const db = require('../controllers/dynamoController');

// GET /api/v2/frameworks
router.get('/frameworks', async (_req, res, next) => {
  try {
    const frameworks = await db.getFrameworks();
    res.json(frameworks);
  } catch (err) {
    next(err);
  }
});

// GET /api/v2/items?framework=manifesto&type=principle
router.get('/items', async (req, res, next) => {
  try {
    const { framework } = req.query;
    const items = framework ? await db.getItemsByFramework(framework) : await db.getAllItems();
    const filtered = req.query.type ? items.filter((i) => i.type === req.query.type) : items;
    res.json(filtered);
  } catch (err) {
    next(err);
  }
});

// GET /api/v2/items/:framework/:type/:id
router.get('/items/:framework/:type/:id', async (req, res, next) => {
  try {
    const { framework, type, id } = req.params;
    const item = await db.getItemByKey(framework, type, id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// GET /api/v2/search?keywords=delivery,customer&matchType=ALL
router.get('/search', async (req, res, next) => {
  try {
    const { keywords, matchType = 'ANY' } = req.query;
    if (!keywords) return res.status(400).json({ error: 'keywords parameter required' });
    const kwdArray = keywords.split(',').map((k) => k.trim()).filter(Boolean);
    const results = await db.searchByKeywords(kwdArray, matchType.toUpperCase());
    res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /api/v2/suggestions?partial=cust
router.get('/suggestions', async (req, res, next) => {
  try {
    const { partial = '' } = req.query;
    const suggestions = await db.getSuggestions(partial);
    res.json(suggestions);
  } catch (err) {
    next(err);
  }
});

// GET /api/v2/keywordsmap
router.get('/keywordsmap', async (_req, res, next) => {
  try {
    const map = await db.getKeywordsMap();
    res.json(map);
  } catch (err) {
    next(err);
  }
});

// PUT /api/v2/items/:framework/:type/:id/keywords
router.put('/items/:framework/:type/:id/keywords', async (req, res, next) => {
  try {
    const { framework, type, id } = req.params;
    const { keywords } = req.body;
    if (!keywords) return res.status(400).json({ error: 'keywords required in body' });
    const result = await db.updateKeywords(framework, type, id, keywords);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
