// routes/orderItems.js - Order Items routes with CRUD operations
const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const db = require('../db');

// GET all order items
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT order_item_id, order_id, product_id, quantity, 
       unit_price, subtotal, created_at, updated_at 
       FROM order_items 
       ORDER BY order_item_id`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching order items:', error);
    res.status(500).json({ error: 'Failed to fetch order items', details: error.message });
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

// GET order items by order ID
router.get('/order/:orderId', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT order_item_id, order_id, product_id, quantity, 
       unit_price, subtotal, created_at, updated_at 
       FROM order_items 
       WHERE order_id = :orderId
       ORDER BY order_item_id`,
      [req.params.orderId],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching order items for order:', error);
    res.status(500).json({ error: 'Failed to fetch order items', details: error.message });
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

// GET a single order item by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT order_item_id, order_id, product_id, quantity, 
       unit_price, subtotal, created_at, updated_at 
       FROM order_items 
       WHERE order_item_id = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order item:', error);
    res.status(500).json({ error: 'Failed to fetch order item', details: error.message });
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

// POST create a new order item
router.post('/', async (req, res) => {
  let connection;
  try {
    const { order_id, product_id, quantity, unit_price, subtotal } = req.body;
    
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal) 
       VALUES (:order_id, :product_id, :quantity, :unit_price, :subtotal) 
       RETURNING order_item_id INTO :id`,
      {
        order_id,
        product_id,
        quantity,
        unit_price,
        subtotal,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );
    
    res.status(201).json({ 
      message: 'Order item created successfully', 
      order_item_id: result.outBinds.id[0] 
    });
  } catch (error) {
    console.error('Error creating order item:', error);
    res.status(500).json({ error: 'Failed to create order item', details: error.message });
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

// PUT update an order item
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { order_id, product_id, quantity, unit_price, subtotal } = req.body;
    
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE order_items 
       SET order_id = :order_id, 
           product_id = :product_id, 
           quantity = :quantity, 
           unit_price = :unit_price, 
           subtotal = :subtotal,
           updated_at = CURRENT_TIMESTAMP
       WHERE order_item_id = :id`,
      {
        order_id,
        product_id,
        quantity,
        unit_price,
        subtotal,
        id: req.params.id
      },
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    
    res.json({ message: 'Order item updated successfully' });
  } catch (error) {
    console.error('Error updating order item:', error);
    res.status(500).json({ error: 'Failed to update order item', details: error.message });
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

// DELETE an order item
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM order_items WHERE order_item_id = :id`,
      [req.params.id],
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }
    
    res.json({ message: 'Order item deleted successfully' });
  } catch (error) {
    console.error('Error deleting order item:', error);
    res.status(500).json({ error: 'Failed to delete order item', details: error.message });
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
