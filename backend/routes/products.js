const express = require('express');
const router = express.Router();
const db = require('../db');

// Columns used across queries
const COLUMNS = [
  "product_id", "name", "description", "price", "stock_quantity",
  "stock_status", "category", "supplier_id", "image_url", "created_at"
];

const mapRowToObject = (row) => Object.fromEntries(row.map((v, i) => [COLUMNS[i], v]));

// GET all products
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT ${COLUMNS.join(', ')} FROM products ORDER BY product_id`
    );
    res.json(result.rows.map(mapRowToObject));
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// GET product by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT ${COLUMNS.join(', ')} FROM products WHERE product_id = :id`,
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Product not found' });
    res.json(mapRowToObject(result.rows[0]));
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// POST add new product (requires product_id)
router.post('/', async (req, res) => {
  let connection;
  try {
    let {
      product_id,
      name, description, price, stock_quantity, stock_status,
      category, supplier_id, image_url
    } = req.body;

    if (!product_id) return res.status(400).json({ error: "product_id is required" });
    if (!name) return res.status(400).json({ error: "name is required" });
    if (price == null) return res.status(400).json({ error: "price is required" });
    if (stock_quantity == null) return res.status(400).json({ error: "stock_quantity is required" });

    const created_at = new Date();

    connection = await db.getConnection();
    await connection.execute(
      `INSERT INTO products
      (product_id, name, description, price, stock_quantity, stock_status, category, supplier_id, image_url, created_at)
      VALUES (:product_id, :name, :description, :price, :stock_quantity, :stock_status, :category, :supplier_id, :image_url, :created_at)`,
      { product_id, name, description, price, stock_quantity, stock_status, category, supplier_id, image_url, created_at },
      { autoCommit: true }
    );

    const result = await connection.execute(
      `SELECT ${COLUMNS.join(', ')} FROM products WHERE product_id = :product_id`,
      { product_id }
    );
    res.status(201).json(mapRowToObject(result.rows[0]));
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// PUT update product (by product_id)
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const {
      name, description, price, stock_quantity, stock_status,
      category, supplier_id, image_url
    } = req.body;

    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE products SET
         name = :name,
         description = :description,
         price = :price,
         stock_quantity = :stock_quantity,
         stock_status = :stock_status,
         category = :category,
         supplier_id = :supplier_id,
         image_url = :image_url
       WHERE product_id = :id`,
      { name, description, price, stock_quantity, stock_status, category, supplier_id, image_url, id: req.params.id },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0)
      return res.status(404).json({ error: 'Product not found' });

    const updated = await connection.execute(
      `SELECT ${COLUMNS.join(', ')} FROM products WHERE product_id = :id`,
      [req.params.id]
    );
    res.json(mapRowToObject(updated.rows[0]));
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

// DELETE product (by product_id)
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM products WHERE product_id = :id`,
      [req.params.id],
      { autoCommit: true }
    );
    if (result.rowsAffected === 0)
      return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  } finally {
    if (connection) await connection.close().catch(console.error);
  }
});

module.exports = router;
