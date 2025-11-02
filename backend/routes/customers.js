// routes/customers.js - Customer routes with CRUD operations
const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const db = require('../db');

// GET all customers
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT customer_id, name, email, phone, address, 
       city, state, zipcode, created_at, updated_at 
       FROM customers 
       ORDER BY customer_id`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers', details: error.message });
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

// GET a single customer by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT customer_id, name, email, phone, address, 
       city, state, zipcode, created_at, updated_at 
       FROM customers 
       WHERE customer_id = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer', details: error.message });
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

// POST create a new customer
router.post('/', async (req, res) => {
  let connection;
  try {
    const { name, email, phone, address, city, state, zipcode } = req.body;
    
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO customers (name, email, phone, address, city, state, zipcode) 
       VALUES (:name, :email, :phone, :address, :city, :state, :zipcode) 
       RETURNING customer_id INTO :id`,
      {
        name,
        email,
        phone,
        address,
        city,
        state,
        zipcode,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );
    
    res.status(201).json({ 
      message: 'Customer created successfully', 
      customer_id: result.outBinds.id[0] 
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer', details: error.message });
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

// PUT update a customer
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { name, email, phone, address, city, state, zipcode } = req.body;
    
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE customers 
       SET name = :name, 
           email = :email, 
           phone = :phone, 
           address = :address, 
           city = :city, 
           state = :state, 
           zipcode = :zipcode,
           updated_at = CURRENT_TIMESTAMP
       WHERE customer_id = :id`,
      {
        name,
        email,
        phone,
        address,
        city,
        state,
        zipcode,
        id: req.params.id
      },
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json({ message: 'Customer updated successfully' });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer', details: error.message });
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

// DELETE a customer
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM customers WHERE customer_id = :id`,
      [req.params.id],
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer', details: error.message });
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
