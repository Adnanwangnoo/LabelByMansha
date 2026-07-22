const cors = require('cors');
const express = require('express');
const path = require('path');

const productsRouter = require('./routes/products');
const contactRouter = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;
// app.use(cors({
//   origin: 'https://labelbymansha.com'
// }));
app.use(cors({
  origin: [
    'https://labelbymansha.com',
    'https://www.labelbymansha.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ------------------------------- API routes --------------------------------
app.use('/api/products', productsRouter);
app.use('/api', contactRouter); // exposes /api/contact, /api/enquire, /api/messages

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'label-by-mansha', time: new Date().toISOString() });
});

// ------------------------------ Static frontend -----------------------------
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
app.use(express.static(PUBLIC_DIR));

// Friendly 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Fallback: send index.html for any other unmatched route (simple SPA-style
// fallback; harmless for a multi-page site since real files are served above)
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Label by Mansha server running at http://localhost:${PORT}`);
});
