const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const db = require('../db');

// Optionally make all results OBJECT by default
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// GET all products
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT 
        product_id AS "product_id",
        name AS "name",
        description AS "description",
        price AS "price",
        stock_quantity AS "stock_quantity",
        stock_status AS "stock_status",
        supplier_id AS "supplier_id",
        category AS "category",
        image_url AS "image_url",
        created_at AS "created_at"
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
      `SELECT 
        product_id AS "product_id",
        name AS "name",
        description AS "description",
        price AS "price",
        stock_quantity AS "stock_quantity",
        stock_status AS "stock_status",
        supplier_id AS "supplier_id",
        category AS "category",
        image_url AS "image_url",
        created_at AS "created_at"
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
    const {
      name,
      description,
      price,
      stock_quantity,
      stock_status,
      category,
      supplier_id,
      image_url
    } = req.body;

    connection = await db.getConnection();
    await connection.execute(
      `
      INSERT INTO products
        (name, description, price, stock_quantity, stock_status, category, supplier_id, image_url)
      VALUES
        (:name, :description, :price, :stock_quantity, :stock_status, :category, :supplier_id, :image_url)
      `,
      {
        name,
        description,
        price,
        stock_quantity,
        stock_status,
        category,
        supplier_id,
        image_url
      },
      { autoCommit: true }
    );

    // Fetch the most recently inserted product for confirmation.
    const result = await connection.execute(
      `SELECT 
        product_id AS "product_id",
        name AS "name",
        description AS "description",
        price AS "price",
        stock_quantity AS "stock_quantity",
        stock_status AS "stock_status",
        supplier_id AS "supplier_id",
        category AS "category",
        image_url AS "image_url",
        created_at AS "created_at"
      FROM products
      WHERE name = :name AND price = :price
      ORDER BY created_at DESC
      FETCH FIRST 1 ROWS ONLY`,
      { name, price },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.status(201).json(result.rows[0]);
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
    const {
      name,
      description,
      price,
      stock_quantity,
      stock_status,
      category,
      supplier_id,
      image_url
    } = req.body;

    connection = await db.getConnection();
    const result = await connection.execute(
      `
      UPDATE products
         SET name = :name,
             description = :description,
             price = :price,
             stock_quantity = :stock_quantity,
             stock_status = :stock_status,
             category = :category,
             supplier_id = :supplier_id,
             image_url = :image_url
       WHERE product_id = :id
      `,
      {
        name,
        description,
        price,
        stock_quantity,
        stock_status,
        category,
        supplier_id,
        image_url,
        id: req.params.id
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Return the updated product
    const updated = await connection.execute(
      `SELECT 
        product_id AS "product_id",
        name AS "name",
        description AS "description",
        price AS "price",
        stock_quantity AS "stock_quantity",
        stock_status AS "stock_status",
        supplier_id AS "supplier_id",
        category AS "category",
        image_url AS "image_url",
        created_at AS "created_at"
      FROM products
      WHERE product_id = :id`,
      { id: req.params.id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    res.json(updated.rows[0]);
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
