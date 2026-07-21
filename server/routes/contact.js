const express = require('express');
const crypto = require('crypto');
const { readJSON, writeJSON } = require('../store');

const router = express.Router();

const ADMIN_KEY = process.env.ADMIN_KEY || 'mansha-admin';

function isValidEmail(value) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function saveMessage(entry) {
  const messages = readJSON('messages.json', []);
  const record = {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    ...entry
  };
  messages.unshift(record); // newest first
  writeJSON('messages.json', messages);
  return record;
}

// POST /api/contact — the main contact form
router.post('/contact', (req, res) => {
  const { name, phone, email, topic, message } = req.body || {};

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Please tell us your name.' });
  }
  if (!phone || !phone.trim()) {
    return res.status(400).json({ error: 'Please share a phone or WhatsApp number so we can reach you.' });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Please add a short message so we know how to help.' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'That email address doesn\'t look right.' });
  }

  const record = saveMessage({
    type: 'contact',
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : null,
    topic: topic || 'Something else',
    message: message.trim()
  });

  res.status(201).json({
    ok: true,
    message: 'Thank you — your message has been noted. We\'ll get back to you shortly.',
    id: record.id
  });
});

// POST /api/enquire — quick per-product "Enquire" button from the Collections page
router.post('/enquire', (req, res) => {
  const { productId, productName, name, phone } = req.body || {};

  if (!productName) {
    return res.status(400).json({ error: 'Missing product name.' });
  }
  if (!name || !phone) {
    return res.status(400).json({ error: 'Please include your name and phone/WhatsApp number.' });
  }

  const record = saveMessage({
    type: 'enquiry',
    productId: productId || null,
    productName,
    name: name.trim(),
    phone: phone.trim()
  });

  res.status(201).json({
    ok: true,
    message: `Got it — we'll message you about the ${productName} shortly.`,
    id: record.id
  });
});

// GET /api/messages — simple admin view, protected by a key
// Usage: GET /api/messages?key=YOUR_ADMIN_KEY
router.get('/messages', (req, res) => {
  if (req.query.key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized. Pass the correct ?key= to view messages.' });
  }
  const messages = readJSON('messages.json', []);
  res.json({ count: messages.length, messages });
});

module.exports = router;
