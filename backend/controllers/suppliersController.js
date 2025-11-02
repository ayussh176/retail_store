// controllers/suppliersController.js - Suppliers controller
const db = require('../db');
exports.getAllSuppliers = async (req, res) => {
  try { const [rows] = await db.query('SELECT * FROM suppliers'); res.json(rows); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
exports.getSupplierById = async (req, res) => {
  try { const [rows] = await db.query('SELECT * FROM suppliers WHERE id = ?', [req.params.id]); if (rows.length === 0) return res.status(404).json({ message: 'Supplier not found' }); res.json(rows[0]); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
exports.createSupplier = async (req, res) => {
  try { const { name, contact, address } = req.body; const [result] = await db.query('INSERT INTO suppliers (name, contact, address) VALUES (?, ?, ?)', [name, contact, address]); res.status(201).json({ id: result.insertId, message: 'Supplier created' }); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
exports.updateSupplier = async (req, res) => {
  try { const { name, contact, address } = req.body; await db.query('UPDATE suppliers SET name = ?, contact = ?, address = ? WHERE id = ?', [name, contact, address, req.params.id]); res.json({ message: 'Supplier updated' }); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
exports.deleteSupplier = async (req, res) => {
  try { await db.query('DELETE FROM suppliers WHERE id = ?', [req.params.id]); res.json({ message: 'Supplier deleted' }); }
  catch (error) { res.status(500).json({ error: error.message }); }
};
