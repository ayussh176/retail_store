// routes/orders.js - Order routes with CRUD operations
const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const db = require('../db');

// GET all orders
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT order_id, customer_id, retailer_id, order_date, 
       total_amount, status, created_at, updated_at 
       FROM orders 
       ORDER BY order_id`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message });
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

// GET a single order by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT order_id, customer_id, retailer_id, order_date, 
       total_amount, status, created_at, updated_at 
       FROM orders 
       WHERE order_id = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order', details: error.message });
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

// POST create a new order
router.post('/', async (req, res) => {
  let connection;
  try {
    const { customer_id, retailer_id, order_date, total_amount, status } = req.body;
    
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO orders (customer_id, retailer_id, order_date, total_amount, status) 
       VALUES (:customer_id, :retailer_id, :order_date, :total_amount, :status) 
       RETURNING order_id INTO :id`,
      {
        customer_id,
        retailer_id,
        order_date: order_date || new Date(),
        total_amount,
        status: status || 'pending',
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );
    
    res.status(201).json({ 
      message: 'Order created successfully', 
      order_id: result.outBinds.id[0] 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order', details: error.message });
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

// PUT update an order
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { customer_id, retailer_id, order_date, total_amount, status } = req.body;
    
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE orders 
       SET customer_id = :customer_id, 
           retailer_id = :retailer_id, 
           order_date = :order_date, 
           total_amount = :total_amount, 
           status = :status,
           updated_at = CURRENT_TIMESTAMP
       WHERE order_id = :id`,
      {
        customer_id,
        retailer_id,
        order_date,
        total_amount,
        status,
        id: req.params.id
      },
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order', details: error.message });
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

// DELETE an order
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM orders WHERE order_id = :id`,
      [req.params.id],
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order', details: error.message });
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
