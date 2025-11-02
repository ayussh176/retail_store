// routes/retailers.js - Retailer routes with CRUD operations
const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const db = require('../db');

// GET all retailers
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT retailer_id, name, contact_name, email, phone, 
       address, city, state, zipcode, created_at, updated_at 
       FROM retailers 
       ORDER BY retailer_id`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching retailers:', error);
    res.status(500).json({ error: 'Failed to fetch retailers', details: error.message });
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

// GET a single retailer by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT retailer_id, name, contact_name, email, phone, 
       address, city, state, zipcode, created_at, updated_at 
       FROM retailers 
       WHERE retailer_id = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Retailer not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching retailer:', error);
    res.status(500).json({ error: 'Failed to fetch retailer', details: error.message });
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

// POST create a new retailer
router.post('/', async (req, res) => {
  let connection;
  try {
    const { name, contact_name, email, phone, address, city, state, zipcode } = req.body;
    
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO retailers (name, contact_name, email, phone, address, city, state, zipcode) 
       VALUES (:name, :contact_name, :email, :phone, :address, :city, :state, :zipcode) 
       RETURNING retailer_id INTO :id`,
      {
        name,
        contact_name,
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
      message: 'Retailer created successfully', 
      retailer_id: result.outBinds.id[0] 
    });
  } catch (error) {
    console.error('Error creating retailer:', error);
    res.status(500).json({ error: 'Failed to create retailer', details: error.message });
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

// PUT update a retailer
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { name, contact_name, email, phone, address, city, state, zipcode } = req.body;
    
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE retailers 
       SET name = :name, 
           contact_name = :contact_name, 
           email = :email, 
           phone = :phone, 
           address = :address, 
           city = :city, 
           state = :state, 
           zipcode = :zipcode,
           updated_at = CURRENT_TIMESTAMP
       WHERE retailer_id = :id`,
      {
        name,
        contact_name,
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
      return res.status(404).json({ error: 'Retailer not found' });
    }
    
    res.json({ message: 'Retailer updated successfully' });
  } catch (error) {
    console.error('Error updating retailer:', error);
    res.status(500).json({ error: 'Failed to update retailer', details: error.message });
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

// DELETE a retailer
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM retailers WHERE retailer_id = :id`,
      [req.params.id],
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Retailer not found' });
    }
    
    res.json({ message: 'Retailer deleted successfully' });
  } catch (error) {
    console.error('Error deleting retailer:', error);
    res.status(500).json({ error: 'Failed to delete retailer', details: error.message });
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
