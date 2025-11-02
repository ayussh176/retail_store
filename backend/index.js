const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getConnection } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => res.send('API Running'));

// Products list endpoint
app.get('/products', async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    // Update table name & columns as needed for your schema!
    const result = await conn.execute('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// Add product endpoint (example)
app.post('/products', async (req, res) => {
  let conn;
  try {
    const { name, price, stock_quantity, description, category, supplier_id, image_url } = req.body;
    conn = await getConnection();
    const result = await conn.execute(
      `INSERT INTO products (name, description, price, stock_quantity, category, supplier_id, image_url) VALUES (:name, :description, :price, :stock_quantity, :category, :supplier_id, :image_url)`,
      { name, description, price, stock_quantity, category, supplier_id, image_url },
      { autoCommit: true }
    );
    res.status(201).json({ message: 'Product added!', productId: result.lastRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
