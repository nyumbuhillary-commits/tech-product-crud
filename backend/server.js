require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());            // Enable CORS so the HTML page can call the API
app.use(express.json());    // Parse JSON request bodies

// Serve the frontend from the same server (one link when deployed)
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ---- helpers ----
function validate(body, { partial = false } = {}) {
  const errors = [];
  const name = body.product_name;
  if (!partial || name !== undefined) {
    if (typeof name !== 'string' || !name.trim()) errors.push('product_name is required');
    else if (name.length > 150) errors.push('product_name max length is 150');
  }
  if (body.price !== undefined && body.price !== null && body.price !== '' &&
      (isNaN(Number(body.price)) || Number(body.price) < 0)) errors.push('price must be a number >= 0');
  if (body.stock !== undefined && body.stock !== null && body.stock !== '' &&
      (!Number.isInteger(Number(body.stock)) || Number(body.stock) < 0)) errors.push('stock must be an integer >= 0');
  return errors;
}
const getById = (id) => db.prepare('SELECT * FROM products WHERE id = ?').get(id);

// ---- API ----
// GET /api/products -> list all
app.get('/api/products', (req, res) => {
  res.json(db.prepare('SELECT * FROM products ORDER BY id DESC').all());
});

// GET /api/products/:id -> one record
app.get('/api/products/:id', (req, res) => {
  const row = getById(req.params.id);
  if (!row) return res.status(404).json({ error: 'Product not found' });
  res.json(row);
});

// POST /api/products -> create
app.post('/api/products', (req, res) => {
  const errors = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const { product_name, brand = null, category = null, price = 0, stock = 0, description = null } = req.body;
  const info = db.prepare(
    `INSERT INTO products (product_name, brand, category, price, stock, description)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).run(product_name.trim(), brand, category, Number(price) || 0, Number(stock) || 0, description);
  res.status(201).json(getById(info.lastInsertRowid));
});

// PUT /api/products/:id -> update
app.put('/api/products/:id', (req, res) => {
  const existing = getById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  const errors = validate(req.body, { partial: true });
  if (errors.length) return res.status(400).json({ errors });
  const m = { ...existing, ...req.body };
  db.prepare(
    `UPDATE products
     SET product_name = ?, brand = ?, category = ?, price = ?, stock = ?, description = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`
  ).run(String(m.product_name).trim(), m.brand, m.category, Number(m.price) || 0, Number(m.stock) || 0, m.description, existing.id);
  res.json(getById(existing.id));
});

// DELETE /api/products/:id -> delete
app.delete('/api/products/:id', (req, res) => {
  const existing = getById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Product not found' });
  db.prepare('DELETE FROM products WHERE id = ?').run(existing.id);
  res.json({ message: 'Product deleted', deleted: existing });
});

// JSON 404 + error handler for API
app.use('/api', (req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
