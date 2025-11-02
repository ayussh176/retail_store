// routes/suppliers.js - Supplier routes with CRUD operations
const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');
const db = require('../db');

// GET all suppliers
router.get('/', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT supplier_id, name, contact_name, email, phone, 
       address, city, state, zipcode, created_at, updated_at 
       FROM suppliers 
       ORDER BY supplier_id`,
      [],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers', details: error.message });
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

// GET a single supplier by ID
router.get('/:id', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT supplier_id, name, contact_name, email, phone, 
       address, city, state, zipcode, created_at, updated_at 
       FROM suppliers 
       WHERE supplier_id = :id`,
      [req.params.id],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Failed to fetch supplier', details: error.message });
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

// POST create a new supplier
router.post('/', async (req, res) => {
  let connection;
  try {
    const { name, contact_name, email, phone, address, city, state, zipcode } = req.body;
    
    connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO suppliers (name, contact_name, email, phone, address, city, state, zipcode) 
       VALUES (:name, :contact_name, :email, :phone, :address, :city, :state, :zipcode) 
       RETURNING supplier_id INTO :id`,
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
      message: 'Supplier created successfully', 
      supplier_id: result.outBinds.id[0] 
    });
  } catch (error) {
    console.error('Error creating supplier:', error);
    res.status(500).json({ error: 'Failed to create supplier', details: error.message });
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

// PUT update a supplier
router.put('/:id', async (req, res) => {
  let connection;
  try {
    const { name, contact_name, email, phone, address, city, state, zipcode } = req.body;
    
    connection = await db.getConnection();
    const result = await connection.execute(
      `UPDATE suppliers 
       SET name = :name, 
           contact_name = :contact_name, 
           email = :email, 
           phone = :phone, 
           address = :address, 
           city = :city, 
           state = :state, 
           zipcode = :zipcode,
           updated_at = CURRENT_TIMESTAMP
       WHERE supplier_id = :id`,
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
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json({ message: 'Supplier updated successfully' });
  } catch (error) {
    console.error('Error updating supplier:', error);
    res.status(500).json({ error: 'Failed to update supplier', details: error.message });
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

// DELETE a supplier
router.delete('/:id', async (req, res) => {
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM suppliers WHERE supplier_id = :id`,
      [req.params.id],
      { autoCommit: true }
    );
    
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Failed to delete supplier', details: error.message });
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
