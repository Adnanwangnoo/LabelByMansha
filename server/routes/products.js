const express = require('express');
const { readJSON } = require('../store');

const router = express.Router();

// GET /api/products?category=kurtis
router.get('/', (req, res) => {
  const products = readJSON('products.json', []);
  const { category } = req.query;

  const filtered = category && category !== 'all'
    ? products.filter((p) => p.category === category)
    : products;

  res.json({
    count: filtered.length,
    products: filtered
  });
});

// GET /api/products/categories — distinct categories for building filter UI
router.get('/categories', (req, res) => {
  const products = readJSON('products.json', []);
  const seen = new Map();
  products.forEach((p) => {
    if (!seen.has(p.category)) seen.set(p.category, p.categoryLabel);
  });
  const categories = Array.from(seen, ([value, label]) => ({ value, label }));
  res.json({ categories });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const products = readJSON('products.json', []);
  const product = products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json({ product });
});

module.exports = router;
