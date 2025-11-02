// routes/products.js - Product routes with CRUD operations
const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const db = require('../db');

// GET all products
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT product_id, name, description, price, stock_quantity, 
       supplier_id, category, created_at, updated_at 
       FROM products 
       ORDER BY product_id`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// GET a single product by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT product_id, name, description, price, stock_quantity, 
       supplier_id, category, created_at, updated_at 
       FROM products 
       WHERE product_id = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product', details: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// POST create a new product
router.post('/', async (req, res) => {
  let connection;
  try {
    const { name, description, price, stock_quantity, supplier_id, category } = req.body;
    
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO products (name, description, price, stock_quantity, supplier_id, category) 
       VALUES (:name, :description, :price, :stock_quantity, :supplier_id, :category) 
       RETURNING product_id INTO :id`,
      {
        name,
        description,
        price,
        stock_quantity,
        supplier_id,
        category,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );
    
    res.status(201).json({ 
      message: 'Product created successfully', 
      product_id: result.outBinds.id[0] 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product', details: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// PUT update a product
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { name, description, price, stock_quantity, supplier_id, category } = req.body;
    
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE products 
       SET name = :name, 
           description = :description, 
           price = :price, 
           stock_quantity = :stock_quantity, 
           supplier_id = :supplier_id, 
           category = :category,
           updated_at = CURRENT_TIMESTAMP
       WHERE product_id = :id`,
      {
        name,
        description,
        price,
        stock_quantity,
        supplier_id,
        category,
        id: req.params.id
      },
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product', details: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// DELETE a product
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM products WHERE product_id = :id`,
      [req.params.id],
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product', details: error.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

module.exports = router;
